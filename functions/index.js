//@ts-check
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const app = admin.initializeApp();
const db = app.firestore();
const base_url = 'sgmentores.web.app';
sgMail.setApiKey(functions.config().sendgrid.apikey);

exports.mailSeguimientoForm = functions.firestore
  .document('forms/seguimiento/responses/{id}')
  .onCreate(async (change, context) => {
    const responseData = change.data();
    const formId = context.params.id;
    const students = responseData.students;

    const mailQueue = [];
    students.forEach(student => {
      const msg = {
        to: `${student.studentUsername}@utpl.edu.ec`,
        from: 'bruno.be81@gmail.com',
        templateId: 'd-db5d5d6bfb6649c1afcb97151da70051',
        dynamic_template_data: Object.assign(responseData, {
          rejectLink: `https://${base_url}/validate-form/${formId}/${student.rejectKey}`,
          approveLink: `https://${base_url}/validate-form/${formId}/${student.acceptKey}`,
          formId,
          subject: 'Validación Seguimiento - Proyecto Mentores',
          student
        })
      };

      mailQueue.push(sgMail.send(msg));
    });

    try {
      let res = await Promise.all(mailQueue);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  });

exports.confirmSeguimientoForm = functions.firestore
  .document('forms/seguimiento/responses/{id}')
  .onUpdate(async (change, context) => {
    const newResponseData = change.after.data();
    const oldResponseData = change.before.data();
    const responseId = context.params.id;

    // get changed users documents
    const newStudents = newResponseData.students;
    const oldStudents = oldResponseData.students;

    if (newStudents.length !== oldStudents.length) {
      throw new Error("Students length doesn't match.");
    }

    // check witch student changed, to send emails
    const mailQueue = [];
    for (let i = 0; i < newStudents.length; i++) {
      const newStudent = newStudents[i];
      const oldStudent = oldStudents[i];

      if (JSON.stringify(newStudent) !== JSON.stringify(oldStudent)) {
        const msg = {
          to: `${newResponseData.mentorUsername}@utpl.edu.ec`,
          from: 'bruno.be81@gmail.com',
          templateId: 'd-3c06731ec93343b797e4af2d13ececfe',
          dynamic_template_data: Object.assign(newResponseData, {
            formId: responseId,
            studentName: newStudent.studentName
          })
        };

        if (newStudent.confirmationStatus === 'ACCEPTED') {
          // Confirmed
          msg.dynamic_template_data.subject = `Tu Formulario de Seguimiento ha sido ACEPTADO por ${newStudent.studentName} - Proyecto Mentores`;
          msg.dynamic_template_data.status = 'ACEPTADO';
        } else if (newStudent.confirmationStatus === 'REJECTED') {
          // Rejected
          msg.dynamic_template_data.subject = `Tu Formulario de Seguimiento ha sido RECHAZADO por ${newStudent.studentName} - Proyecto Mentores`;
          msg.dynamic_template_data.status = 'RECHAZADO';
        } else {
          continue;
        }

        mailQueue.push(sgMail.send(msg));
      }
    }

    try {
      let res = await Promise.all(mailQueue);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  });

exports.validateForm = functions.https.onRequest(async (req, res) => {
  const params = req.params[0].split('/');
  const formId = params[2];
  const keyID = params[3];

  let snap = await db
    .collection(`forms/seguimiento/responses/`)
    .doc(formId)
    .get();

  let doc = snap.data();

  if (!formId || !keyID || !snap.exists) {
    return res.status(404).send('Petición Invalida');
  }

  if (doc.acceptKey === keyID) {
    await db
      .collection(`forms/seguimiento/responses/`)
      .doc(formId)
      .update({
        acceptKey: null,
        rejectKey: null,
        confirmationStatus: 'ACCEPTED'
      });
  } else if (doc.rejectKey === keyID) {
    await db
      .collection(`forms/seguimiento/responses/`)
      .doc(formId)
      .update({
        acceptKey: null,
        rejectKey: null,
        confirmationStatus: 'REJECTED'
      });
  } else {
    return res.send('Este documento ya fue confirmado.');
  }

  return res.send('Gracias por colaborar');
});

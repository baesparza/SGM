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

    const msg = {
      to: `${responseData.studentUsername}@utpl.edu.ec`,
      from: 'bruno.be81@gmail.com',
      templateId: 'd-db5d5d6bfb6649c1afcb97151da70051',
      dynamic_template_data: Object.assign(responseData, {
        rejectLink: `https://${base_url}/validate-form/${formId}/${responseData.rejectKey}`,
        approveLink: `https://${base_url}/validate-form/${formId}/${responseData.acceptKey}`,
        formId
      }),
      subject: 'Validación Seguimiento - Proyecto Mentores'
    };
    try {
      let res = await sgMail.send(msg);
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

    const msg = {
      to: `${newResponseData.mentorUsername}@utpl.edu.ec`,
      from: 'bruno.be81@gmail.com',
      templateId: 'd-3c06731ec93343b797e4af2d13ececfe',
      dynamic_template_data: Object.assign(newResponseData, {
        formId: responseId
      }),
      subject: 'Validación Seguimiento - Proyecto Mentores'
    };

    if (newResponseData.confirmationStatus === 'ACCEPTED') {
      // Confirmed
      msg.subject = 'Tu Formulario de Seguimiento ha sido aceptado - Proyecto Mentores';
      msg.dynamic_template_data.status = 'ACEPTADO';
    } else if (newResponseData.confirmationStatus === 'REJECTED') {
      // Rejected
      msg.subject = 'Tu Formulario de Seguimiento ha sido rechazado - Proyecto Mentores';
      msg.dynamic_template_data.status = 'RECHAZADO';
    } else {
      return;
    }

    try {
      let res = await sgMail.send(msg);
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
      .update({ acceptKey: null, rejectKey: null, confirmationStatus: 'ACCEPTED' });
  } else if (doc.rejectKey === keyID) {
    await db
      .collection(`forms/seguimiento/responses/`)
      .doc(formId)
      .update({ acceptKey: null, rejectKey: null, confirmationStatus: 'REJECTED' });
  } else {
    return res.send('Este documento ya fue confirmado.');
  }

  return res.send('Gracias por colaborar');
});

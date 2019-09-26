const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(functions.config().sendgrid.apikey);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

//@ts-check
exports.mailSeguimientoForm = functions.firestore
  .document('forms/seguimiento/responses/{id}')
  .onWrite(async (change, context) => {
    const responseData = change.after.data();
    const responseId = context.params.id;

    const msg = {
      to: `${responseData.studentUsername}@utpl.edu.ec`,
      from: 'bruno.be81@gmail.com',
      subject: 'Validación seguimiento - Proyecto Mentores',
      html: `
      <p>
      Hola ${responseData.studentName}
      </p>
      <p>
      Este es un correo para validar una forma de Seguimiento <b>${responseId}</b> subida por: ${responseData.mentorName}
      </p>
      `
    };
    try {
      let res = await sgMail.send(msg);
      console.log(res);
    } catch (err) {
      console.err(err);
    }
  });

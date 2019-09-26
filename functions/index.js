const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(functions.config().sendgrid.apikey);

exports.mailSeguimientoForm = functions.firestore
  .document('forms/seguimiento/responses/{id}')
  .onCreate(async (change, context) => {
    const responseData = change.data();
    const responseId = context.params.id;

    const header = createEmailHeather(
      responseData.studentName,
      `Tu mentor ${responseData.mentorName} ha realizado el seguimiento.`
    );
    const body = createEmailBody(responseData);

    const msg = {
      to: `${responseData.studentUsername}@utpl.edu.ec`,
      from: 'bruno.be81@gmail.com',
      subject: 'Validación Seguimiento - Proyecto Mentores',
      html: `
      ${header}
      <hr>
      ${body}
      <hr>
      <p style="font-size: 18px; line-height: 1.2; mso-line-height-alt: 22px; margin: 0;">
      Confirmar
      </p>
      <p style="font-size: 18px; line-height: 1.2; mso-line-height-alt: 22px; margin: 0;">
      Rechazar
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

exports.confirmSeguimientoForm = functions.firestore
  .document('forms/seguimiento/responses/{id}')
  .onUpdate(async (change, context) => {
    const newResponseData = change.after.data();
    const oldResponseData = change.before.data();
    const responseId = context.params.id;

    let mail = {
      to: `${newResponseData.mentorUsername}@utpl.edu.ec`,
      from: 'bruno.be81@gmail.com'
    };
    if (newResponseData.confirmationStatus === 'ACCEPTED') {
      // Confirmed

      const header = createEmailHeather(
        newResponseData.mentorName,
        `Tu estudiante ${newResponseData.studentName} ha confirmado que el seguimiento se ha realizado como tu nos lo detallaste. `
      );
      const body = createEmailBody(newResponseData);

      mail.subject = 'Tu Formulario de Seguimiento ha sido aceptado - Proyecto Mentores';
      mail.html = `
        ${header}
        ${body}
        `;
    } else if (newResponseData.confirmationStatus === 'REJECTED') {
      // Rejected
      const header = createEmailHeather(
        newResponseData.mentorName,
        `Tu estudiante ${newResponseData.studentName} ha rechazado que el seguimiento se ha realizado.`
      );
      const body = createEmailBody(newResponseData);

      mail.subject = 'Tu Formulario de Seguimiento ha sido rechazado - Proyecto Mentores';
      mail.html = `
            ${header}
            <hr>
            ${body}
            <hr>
            <p style="font-size: 18px; line-height: 1.2; mso-line-height-alt: 22px; margin: 0;">
            Si crees que es un error escribe un <a href="mailto:bruno.be81@gmail.com">bruno.be81@gmail.com</a>
             </p>
          `;
    } else {
      return;
    }

    try {
      let res = await sgMail.send(mail);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  });

function createEmailHeather(name, message) {
  return `
  <div>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    Hola, ${name}.
  </p>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>

  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    ${message}
  </p>

  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    <strong>Unidad Responsable</strong>: Vicerrectorado Académico
  </p>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    <strong>Proyecto</strong>: Estudiante Mentores para alumnos de nuevo ingreso
  </p>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>

  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    <strong>Modalidad Presencial</strong>
  </p>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    <strong>Periodo Académico</strong>: Octubre 2019 - Febrero 2020
  </p>
  <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
    <strong>Estudiante de</strong>: Primer ciclo
  </p>
  </div>
`;
}
function createEmailBody(obj) {
  return `
  <div>
    <p style="font-size: 18px; line-height: 1.2; mso-line-height-alt: 22px; margin: 0;">
      Información del Formulario de Seguimiento
    </p>
    <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <strong>Nombre del Estudiante Mentor:</strong>${obj.mentorName}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <strong>Nombre del Estudiante de Nuevo Ingreso:</strong>${obj.studentName}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <strong>Seguimiento:</strong>${obj.follow}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <strong>Tipos de problemas encontrados:</strong>${obj.problemType}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <strong>Temas Desarrollados:</strong>
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      ${obj.topic}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <strong>Descripción del Problema:</strong>
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      ${obj.problems}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      <strong>Soluciones:</strong>
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;">
      ${obj.solutions}
      </p>
      <p style="font-size: 15px; line-height: 1.2; mso-line-height-alt: 18px; margin: 0;"></p>
  </div>
`;
}

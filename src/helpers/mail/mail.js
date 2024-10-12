const nodemailer = require("nodemailer");

// Função para enviar o email
// function sendEmail(subject, message, fromEmail, recipientList) {
//   if (typeof recipientList === "string") {
//     recipientList = JSON.parse(recipientList);
//   }
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_HOST_USER,
//       pass: process.env.EMAIL_HOST_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: fromEmail,
//     to: recipientList,
//     subject: subject,
//     text: message,
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log("Erro ao enviar email:", error);
//     } else {
//       console.log("Email enviado: " + info.response);
//     }
//   });
// }

function forgetPassword(message, recipientList) {
  if (typeof recipientList === "string") {
    recipientList = JSON.parse(recipientList);
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_HOST_USER,
    to: recipientList,
    subject: 'Forget Password',
    text: 'Your new passwors is ' + message + '/n Please change it as soon as possible',
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erro ao enviar email:", error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });
}

module.exports = { sendWelcomeEmail };

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

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

async function emailForgetPassword(password, recipientList) {
  try {
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
     const templatePath = path.join(__dirname, "../../templates/email.html");
       const emailTemplate = fs
         .readFileSync(templatePath, "utf-8")
         .replace("${password}", password);
    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: recipientList,
      subject: "Forget Password",
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email enviado: " + info.response);
    return { success: true, response: info.response }; // Retorna sucesso e informação do email enviado
  } catch (error) {
    console.log("Erro ao enviar email:", error);
    return { success: false, error: error.message }; // Retorna o erro
  }
}


module.exports = { emailForgetPassword };

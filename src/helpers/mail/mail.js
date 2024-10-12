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

async function emailForgetPassword(message, recipientList) {
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

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: recipientList,
      subject: "Forget Password",
      text:
        "Your new password is " +
        message +
        "\nPlease change it as soon as possible",
    };

    // Usar await para enviar email de forma assíncrona
    const info = await transporter.sendMail(mailOptions);

    console.log("Email enviado: " + info.response);
    return { success: true, response: info.response }; // Retorna sucesso e informação do email enviado
  } catch (error) {
    console.log("Erro ao enviar email:", error);
    return { success: false, error: error.message }; // Retorna o erro
  }
}


module.exports = { emailForgetPassword };

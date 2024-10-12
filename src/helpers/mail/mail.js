const nodemailer = require("nodemailer");

// Função para enviar o email
function sendWelcomeEmail(subject, message, fromEmail, recipientList) {
  if (typeof recipientList === "string") {
    // Converte a lista de destinatários de string para array
    recipientList = JSON.parse(recipientList);
  }

  // Configuração do transportador com as credenciais SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to: recipientList,
    subject: subject,
    text: message,
  };

  // Envia o email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erro ao enviar email:", error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });
}

module.exports = { sendWelcomeEmail };

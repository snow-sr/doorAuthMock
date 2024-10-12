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

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: recipientList,
      subject: "Forget Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #333;">Password Recovery</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Here is your new temporary password:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <input type="text" value="${password}" id="passwordInput" readonly 
                   style="padding: 10px; font-size: 18px; border: 1px solid #ccc; border-radius: 5px; width: 80%; text-align: center;">
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="#" onclick="navigator.clipboard.writeText('${password}'); alert('Password copied to clipboard!');" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Copy Password
            </a>
          </div>

          <p style="color: #999;">Please, make sure to change your password after logging in for security reasons.</p>
        </div>
      `,
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

const nodemailer = require("nodemailer");
const { NOD_MAIL_EMAIL, NOD_MAIL_PASS_KEY } = process.env;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: NOD_MAIL_EMAIL, //your email
    pass: NOD_MAIL_PASS_KEY, //generate this password from  https://myaccount.google.com/apppasswords
  },
});

const sendMail = async (data) => {
  const { email, subject, text, html } = data;
  try {
    const info = await transporter.sendMail({
      from: `<${NOD_MAIL_EMAIL}>`, // sender address
      to: email, //"bar@example.com, baz@example.com",
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(">>error send email", error);
    return false;
  }
};
module.exports = sendMail;

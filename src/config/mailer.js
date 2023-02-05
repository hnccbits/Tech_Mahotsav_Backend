const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  security: false,
  port: 587,
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD
  }
});

const sendMail = async ({ to, subject, text }) => {
  /*
  await transporter.sendMail({
    from: `Tech Mahotsav'23 @ BIT Sindri ${process.env.GMAIL_ID}`,
    to: to,
    subject: subject,
    text: text
    //html: "<b>Hello world?</b>" // html body
  });
  */
};

global.sendMail = sendMail;

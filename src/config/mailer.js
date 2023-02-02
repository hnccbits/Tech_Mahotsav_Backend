const nodemailer = require("nodemailer");

let transporter = nodemailer.transporter({
  service: "gmail",
  host: "smtp.gmail.com",
  security: false,
  port: 587,
    auth: {
        user: process.env.GMAILID,
        pass:process.env.GMAILPASSWORD
  }
});

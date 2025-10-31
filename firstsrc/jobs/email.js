// implement with SendGrid or nodemailer
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendEmail(to, subject, text) {
  const msg = { to, from: process.env.EMAIL_FROM, subject, text };
  return sgMail.send(msg);
};

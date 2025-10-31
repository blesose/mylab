// src/workers/email.worker.js
const { emailQueue } = require("../utils/queues");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create mail transporter
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

emailQueue.process(async (job) => {
  const { to, subject, text, html } = job.data;
  console.log("Processing email job:", job.id, to);

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email job ${job.id} failed:`, err.message);
    throw err;
  }
});

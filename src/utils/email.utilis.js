// src/utils/email.utils.js
const nodemailer = require("nodemailer");

// ✅ Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail", // can be SMTP
  auth: {
    user: process.env.EMAIL,        // your email address
    pass: process.env.EMAILSECRET,  // app password or SMTP password
  },
  tls: {
    rejectUnauthorized: false, // allow self-signed certs
  },
});

// ✅ Verify transporter connection (useful in production)
(async () => {
  try {
    await transporter.verify();
    console.log("📨 Email transporter verified successfully");
  } catch (err) {
    console.error("❌ Email transporter verification failed:", err.message);
  }
})();

/**
 * ✅ Send an email (with HTML + plain text)
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 * @param {Array} [options.attachments] - Optional attachments
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"MyLab" <${process.env.EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html || "<p>No HTML content provided</p>",
      text: options.text || "Your email client does not support HTML.",
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = { sendEmail };


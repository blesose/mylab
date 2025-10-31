import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MYLAB_EMAIL,
    pass: process.env.MYLAB_EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"MyLab Wellness" <${process.env.MYLAB_EMAIL}>`,
    to,
    subject,
    html,
  });
}

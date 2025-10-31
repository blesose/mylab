const { notificationQueue } = require("./queues");
const sendEmail = require("../utils/email"); // implement using SendGrid / nodemailer / your provider

// Process "period-reminder" jobs
notificationQueue.process("period-reminder", async (job) => {
  const { userId, email, predictedStartDate } = job.data;
  // build email text
  const subject = "MyLab: Upcoming period reminder";
  const body = `Hi — based on your cycle history, your period is predicted to start on ${new Date(
    predictedStartDate
  ).toDateString()}. This is a friendly reminder from MyLab.`;

  // call your email helper
  await sendEmail(email, subject, body);

  // Optionally, create DB notification record here
  return Promise.resolve();
});

// Generic processor for other notification types can be added similarly

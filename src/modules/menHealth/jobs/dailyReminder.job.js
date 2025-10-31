// src/modules/mentalHealth/jobs/dailyReminder.job.js
const { mentalHealthQueue } = require("../../../utils/queues");
const { sendEmail } = require("../../../utils/email.utils");
const User = require("../../user/models/user.model");

const scheduleDailyReminders = async () => {
  try {
    await mentalHealthQueue.add(
      "sendDailyReminders",
      {},
      {
        repeat: { cron: "0 7 * * *" }, // every day at 7 AM
        removeOnComplete: true,
      }
    );
    console.log("✅ Daily mental health reminders scheduled.");
  } catch (err) {
    console.error("Error scheduling daily reminders:", err);
  }
};

mentalHealthQueue.process("sendDailyReminders", async () => {
  console.log("🔔 Sending daily mental health reminders...");
  try {
    const users = await User.find({ "settings.dailyReminders": true });
    for (const user of users) {
      await mentalHealthQueue.add("deliverDailyReminder", {
        email: user.email,
        name: user.name || "Friend",
      });
    }
    return { count: users.length };
  } catch (err) {
    console.error("Error in sendDailyReminders job:", err);
    throw err;
  }
});

mentalHealthQueue.process("deliverDailyReminder", async (job) => {
  const { email, name } = job.data;
  const affirmations = [
    "Take a deep breath. You’re doing better than you think.",
    "Small steps matter. Keep going 💪.",
    "You deserve peace and progress — one day at a time.",
  ];
  const randomAffirmation =
    affirmations[Math.floor(Math.random() * affirmations.length)];

  try {
    await sendEmail({
      to: email,
      subject: "💚 Daily Mental Health Reminder",
      html: `<p>Hi ${name},</p><p>${randomAffirmation}</p><p>— Your MyLab Team</p>`,
    });
    console.log(`✅ Reminder sent to ${email}`);
  } catch (err) {
    console.error(`Error sending reminder to ${email}:`, err);
    throw err;
  }
});

module.exports = { scheduleDailyReminders };

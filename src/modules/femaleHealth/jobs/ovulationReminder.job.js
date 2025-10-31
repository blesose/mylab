const { emailQueue } = require("../../queues/queues");

/**
 * Repeatable job to send ovulation/fertility window reminders
 */
const scheduleOvulationReminders = async (user, ovulationDate, fertileStart) => {
  await emailQueue.add(
    "ovulationReminder",
    { user, ovulationDate, fertileStart },
    {
      delay: 1000 * 60 * 60 * 24 * 2, // 2 days before fertile window
      repeat: { cron: "0 9 * * *" }, // every day at 9AM (example)
      removeOnComplete: true,
    }
  );
};

module.exports = { scheduleOvulationReminders };

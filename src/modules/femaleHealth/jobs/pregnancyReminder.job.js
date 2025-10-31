const Queue = require("bull");
const Pregnancy = require("../model/pregnancy.model");
const { updatePregnancyWeek } = require("../service/pregnancy.service");

const pregnancyReminderQueue = new Queue("pregnancy-reminder");

pregnancyReminderQueue.process(async (job) => {
  const { userId } = job.data;
  const updated = await updatePregnancyWeek(userId);
  console.log(`Pregnancy week updated for user ${userId}: Week ${updated.currentWeek}`);
});

const schedulePregnancyReminder = async (userId) => {
  await pregnancyReminderQueue.add({ userId }, { repeat: { cron: "0 9 * * 1" } }); // Every Monday 9am
};

module.exports = { pregnancyReminderQueue, schedulePregnancyReminder };

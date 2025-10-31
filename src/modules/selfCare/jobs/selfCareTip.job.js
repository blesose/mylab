const Queue = require("bull");
const { generateSmartTip } = require("../../ai/ai.service");
const { createNotification } = require("../../utils/notify");

const selfCareReminderQueue = new Queue("selfCareReminder");

selfCareReminderQueue.process(async (job) => {
  const { userId } = job.data;
  const aiTip = await generateSmartTip("Give a short motivational self-care tip for today.");
  await createNotification(userId, "Daily Self-Care Reminder", aiTip, "reminder");
});

const scheduleDailyReminders = (userId) => {
  selfCareReminderQueue.add({ userId }, { repeat: { cron: "0 8 * * *" } }); // every morning 8am
};

module.exports = { selfCareReminderQueue, scheduleDailyReminders };



// const Queue = require("bull");
// const { generateSmartHealthTip } = require("../../../ai/ai.helper");

// const selfCareTipQueue = new Queue("self-care-tip-queue");

// selfCareTipQueue.process(async (job) => {
//   const { userId, userData } = job.data;
//   const tip = await generateSmartHealthTip({
//     category: "Self-Care",
//     userData,
//     context: "Send a short daily reminder to relax and care for themselves."
//   });

//   console.log(`🧘‍♀️ Sent self-care tip to ${userData.name || userId}: ${tip}`);
// });

// module.exports = selfCareTipQueue;

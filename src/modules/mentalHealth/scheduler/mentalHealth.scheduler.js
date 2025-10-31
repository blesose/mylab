// src/modules/mentalHealth/schedulers/mentalHealth.scheduler.js
const { getQueue } = require("../../../config/bull.config");
const User = require("../../../models/user.schema"); // your user model
const mentalHealthQueue = getQueue("mentalHealthQueue");

// schedule weekly summary per user who opted in
async function scheduleWeeklySummariesForOptedUsers() {
  const users = await User.find({ "settings.weeklyMentalSummary": true }).select("_id");
  for (const u of users) {
    await mentalHealthQueue.add("weeklySummary", { userId: u._id.toString() }, {
      repeat: { cron: "0 9 * * MON" }, // Mondays 9 AM
      jobId: `mental-weekly-${u._id}`
    });
  }
  console.log(`Scheduled weekly mental summaries: ${users.length}`);
}

module.exports = { scheduleWeeklySummariesForOptedUsers };

// const cron = require("node-cron");
// const { mentalHealthQueue } = require("../jobs/mentalHealthSummary.job");

// const startMentalHealthScheduler = () => {
//   console.log("🗓️ MentalHealth Scheduler active...");

//   cron.schedule("0 8 * * 1", async () => {
//     console.log("🧾 Queuing weekly mental health summary...");
//     await mentalHealthQueue.add({}, { attempts: 3, backoff: 60000 });
//   });
// };

// module.exports = { startMentalHealthScheduler };

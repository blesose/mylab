const cron = require("node-cron");
const { mensHealthQueue } = require("../jobs/menHealth.job");
const User = require("../../../models/user.schema"); // adjust path

function startMenHealthScheduler() {
  console.log("🗓️ MenHealth Scheduler started");

  // Weekly summary: every Monday at 9 AM
  cron.schedule("0 9 * * 1", async () => {
    console.log("📅 Enqueueing weekly men health summaries...");
    const users = await User.find({}, "_id email");
    for (const u of users) {
      await mensHealthQueue.add("weeklyMenSummary", { userId: u._id, email: u.email }, { removeOnComplete: true });
    }
    console.log(`📅 Enqueued weekly men summaries for ${users.length} users`);
  });
}

module.exports = { startMenHealthScheduler };

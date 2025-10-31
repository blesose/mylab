const Queue = require("bull");
const { redisConfig } = require("../../config/redis.config");
const { femaleHealthSummaryJob } = require("../jobs/femaleHealthSummary.job");

const femaleHealthQueue = new Queue("femaleHealthQueue", redisConfig);

async function scheduleWeeklyHealthSummary(userId) {
  await femaleHealthQueue.add(
    { userId },
    {
      repeat: { cron: "0 9 * * MON" }, // every Monday at 9 AM
      jobId: `femaleHealth-weekly-${userId}`,
    }
  );
  console.log(`📅 Scheduled weekly summary for user ${userId}`);
}

// Attach processor
femaleHealthQueue.process(femaleHealthSummaryJob);

femaleHealthQueue.on("completed", (job) => {
  console.log("✅ Weekly summary completed:", job.id);
});

femaleHealthQueue.on("failed", (job, err) => {
  console.error("❌ Weekly summary failed:", job.id, err.message);
});

module.exports = { scheduleWeeklyHealthSummary };

const Queue = require("bull");
const { redisConfig } = require("../../config/redis.config");
const { menHealthSummaryJob } = require("../jobs/menHealthSummary.job");

const menHealthQueue = new Queue("menHealthQueue", redisConfig);

async function scheduleWeeklyMenHealthSummary(userId) {
  await menHealthQueue.add(
    { userId },
    {
      repeat: { cron: "0 9 * * MON" }, // Every Monday at 9 AM
      jobId: `menHealth-weekly-${userId}`,
    }
  );
  console.log(`📅 Scheduled Men’s Health summary for user ${userId}`);
}

// Attach job processor
menHealthQueue.process(menHealthSummaryJob);

menHealthQueue.on("completed", (job) => {
  console.log("✅ MenHealth summary completed:", job.id);
});

menHealthQueue.on("failed", (job, err) => {
  console.error("❌ MenHealth summary failed:", job.id, err.message);
});

module.exports = { scheduleWeeklyMenHealthSummary };

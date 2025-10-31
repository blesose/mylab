// src/modules/mentalHealth/jobs/mentalHealth.jobs.js
const { getQueue } = require("../../../config/bull.config");
const mentalHealthQueue = getQueue("mentalHealthQueue");
const mentalService = require("../services/mentalHealth.service");
const { generateSmartHealthTip } = require("../../../ai/ai.helper");

// Schedule a weekly repeatable summary per user (schedulers will enqueue per-user)
mentalHealthQueue.process("weeklySummary", async (job) => {
  const { userId } = job.data;
  console.log(`🧠 Processing weekly mental summary for ${userId}`);
  try {
    const summary = await mentalService.getDashboardSummary(userId);
    // Optionally persist or notify
    // e.g., Notification.create({ userId, title: "Weekly mental summary", message: summary.aiTip.tip || summary.aiTip });
    return { ok: true, summary };
  } catch (err) {
    console.error("weeklySummary job error:", err);
    throw err;
  }
});

// Daily micro-reminder job
mentalHealthQueue.process("dailyReminder", async (job) => {
  const { userId } = job.data;
  const tip = await generateSmartHealthTip({
    category: "Mental Health",
    userData: {},
    context: "Give a one-line daily mindfulness prompt or breathing exercise."
  });
  // create notification or send email, in-app push
  return { ok: true, tip: tip.tip || tip };
});

module.exports = { mentalHealthQueue };

// const Queue = require("bull");
// require("dotenv").config();
// const { generateWeeklyMentalHealthSummary } = require("../services/mentalHealth.service");

// const mentalHealthQueue = new Queue("mentalHealthQueue", {
//   redis: {
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: process.env.REDIS_PORT || 6379,
//   },
// });

// mentalHealthQueue.process(async (job) => {
//   console.log(`🔄 Processing MentalHealth job ID: ${job.id}`);
//   const result = await generateWeeklyMentalHealthSummary();
//   return result;
// });

// module.exports = { mentalHealthQueue };



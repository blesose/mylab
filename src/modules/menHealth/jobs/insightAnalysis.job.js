// src/modules/mentalHealth/jobs/insightAnalysis.job.js
const { mentalHealthQueue } = require("../../../utils/queues");
const MentalHealth = require("../models/mentalHealth.model");
const { getMentalInsightsForUser } = require("../services/mentalHealth.analysis");

const scheduleInsightAnalysis = async () => {
  try {
    await mentalHealthQueue.add(
      "insightAnalysis",
      {},
      {
        repeat: { cron: "0 2 * * *" }, // every day 2 AM
        removeOnComplete: true,
      }
    );
    console.log("✅ Insight analysis job scheduled.");
  } catch (err) {
    console.error("Error scheduling insight analysis:", err);
  }
};

mentalHealthQueue.process("insightAnalysis", async (job) => {
  console.log("🔬 Running mood pattern analysis...");
  try {
    const distinctUsers = await MentalHealth.distinct("userId");
    for (const userId of distinctUsers) {
      await mentalHealthQueue.add("analyzeUserPatterns", { userId });
    }
    return { count: distinctUsers.length };
  } catch (err) {
    console.error("Error in insightAnalysis job:", err);
    throw err;
  }
});

mentalHealthQueue.process("analyzeUserPatterns", async (job) => {
  const { userId } = job.data;
  console.log(`🧩 Analyzing patterns for user ${userId}`);
  try {
    const insights = await getMentalInsightsForUser(userId);
    console.log(`✅ Insights generated for ${userId}:`, insights);
    return { userId, insights };
  } catch (err) {
    console.error("Error analyzing user patterns:", err);
    throw err;
  }
});

module.exports = { scheduleInsightAnalysis };

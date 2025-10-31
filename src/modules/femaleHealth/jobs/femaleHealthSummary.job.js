const { mensHealthQueue } = require("../../../queues/menHealth.queue"); // similar pattern
const { generateHealthInsight } = require("../ai/healthInsight.service");
const { getUserCycleData } = require("../services/femaleHealth.service");

async function femaleHealthSummaryJob(job) {
  const { userId } = job.data;

  console.log(`🩺 Running female health summary job for user ${userId}`);

  // Fetch user’s latest health data
  const userData = await getUserCycleData(userId);

  // Generate personalized AI tip
  const aiTip = await generateHealthInsight(userData, userData.moduleType);

  // Log summary or notify
  console.log(`✅ AI Health Tip for ${userId}:`, aiTip);

  // Example: store to DB or send email
  // await Notification.create({ userId, message: aiTip, type: "health-tip" });

  return { userId, aiTip };
}

module.exports = { femaleHealthSummaryJob };

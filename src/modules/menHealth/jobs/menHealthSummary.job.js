const { getUserHealthData } = require("../services/menHealth.service");
const { generateMenHealthInsight } = require("../ai/healthInsight.service");

async function menHealthSummaryJob(job) {
  const { userId } = job.data;
  console.log(`💪 Running menHealth summary for user ${userId}`);

  const userData = await getUserHealthData(userId);
  const aiTip = await generateMenHealthInsight(userData, userData.focusArea);

  // You can save this to DB or send as a notification
  console.log(`✅ AI Health Tip for ${userId}:`, aiTip);

  return { userId, aiTip };
}

module.exports = { menHealthSummaryJob };

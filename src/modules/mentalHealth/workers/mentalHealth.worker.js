const { mentalHealthQueue } = require("../jobs/mentalHealthSummary.job");
const { analyzeMoodTrends } = require("../services/mentalHealth.analysis");

mentalHealthQueue.process(async (job) => {
  const { userId } = job.data;
  console.log(`🧠 Worker analyzing mood for user ${userId}`);
  const result = await analyzeMoodTrends(userId);
  return result;
});


// const { mentalHealthQueue } = require("../../../utils/queues");
// const MentalHealth = require("../models/mentalHealth.model");
// const { getMentalInsightsForUser } = require("../services/mentalHealth.analysis");
// const { sendEmail } = require("../../../utils/email.utils");

// mentalHealthQueue.process("analyzeMoodPattern", async (job) => {
//   const { userId } = job.data;
//   const recent = await MentalHealth.find({ userId }).sort({ createdAt: -1 }).limit(20);
//   const insights = getMentalInsightsForUser(recent);
//   console.log("🧠 Analysis complete:", insights);
//   return insights;
// });

// mentalHealthQueue.process("weeklySummaryReport", async (job) => {
//   const { userId, email } = job.data;
//   const recent = await MentalHealth.find({ userId }).sort({ createdAt: -1 }).limit(20);
//   const insights = getMentalInsightsForUser(recent);
//   if (email) {
//     await sendEmail({
//       to: email,
//       subject: "🧘 Your Weekly MyLab Mental Health Summary",
//       html: `<h3>Your Mood Summary</h3><p>${insights.insight}</p>`,
//     });
//   }
//   return { sent: true };
// });


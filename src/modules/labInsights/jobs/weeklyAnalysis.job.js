const cron = require("node-cron");
const { enqueueInsightJob } = require("./insights.job");
const MentalHealth = require("../../mentalHealth/models/mentalHealth.model");
const Fitness = require("../../fitnessAndNutrition/models/fitness.model");
const { aggregateUserScores } = require("../services/labInsights.utils");

// Run every Monday at 7AM
cron.schedule("0 7 * * 1", async () => {
  console.log("Running weekly AI insight job...");

  // Example: fetch last 7 days of data per user
  const users = await MentalHealth.distinct("userId");
  for (const userId of users) {
    const mentalData = await MentalHealth.find({ userId }).sort({ createdAt: -1 }).limit(7);
    const fitnessData = await Fitness.find({ userId }).sort({ createdAt: -1 }).limit(7);

    if (mentalData.length) {
      enqueueInsightJob(userId, "mentalHealth", aggregateUserScores(mentalData));
    }
    if (fitnessData.length) {
      enqueueInsightJob(userId, "fitness", aggregateUserScores(fitnessData));
    }
  }
});

// src/modules/femaleHealth/fitnessNutrition/jobs/dailyMealPlan.job.js
const Queue = require("bull");
const { redisConfig } = require("../../../../config/redis.config");
const { sendNotification } = require("../../../shared/notification.utils"); // adapt path
const FitnessNutrition = require("../models/fitnessNutrition.model");

const queue = new Queue("fitness-daily-meal", redisConfig);

queue.process(async (job) => {
  const { userId } = job.data;
  // fetch last plan
  const plan = await FitnessNutrition.findOne({ userId }).sort({ createdAt: -1 });
  if (!plan) return { ok: false, message: "No plan found" };

  // You may want to use AI to reformat today's meals; for now send existing aiTip
  await sendNotification(userId, `Today's meal plan: ${plan.aiTip}`);
  return { ok: true };
});

async function scheduleDailyMeal(userId) {
  await queue.add({ userId }, { repeat: { cron: "0 7 * * *" }, jobId: `dailyMeal-${userId}` }); // 7am daily
}

module.exports = { queue, scheduleDailyMeal };

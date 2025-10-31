const Queue = require("bull");
const { sendNotification } = require("../utils/notification.utils");

const fitnessNutritionQueue = new Queue("fitness-nutrition-reminder");

fitnessNutritionQueue.process(async (job) => {
  const { userId, message } = job.data;
  await sendNotification(userId, message);
});

async function scheduleFitnessReminder(userId) {
  await fitnessNutritionQueue.add(
    { userId, message: "Time for your daily fitness and nutrition check-in! 💪" },
    { repeat: { cron: "0 8 * * *" } } // every morning 8AM
  );
}

module.exports = { fitnessNutritionQueue, scheduleFitnessReminder };

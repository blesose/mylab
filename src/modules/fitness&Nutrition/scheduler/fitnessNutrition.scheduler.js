// src/modules/femaleHealth/fitnessNutrition/schedulers/fitnessNutrition.scheduler.js
const { scheduleDailyMeal } = require("../jobs/dailyMealPlan.job");
const User = require("../../../../models/user.schema"); // adjust path

async function startFitnessScheduler() {
  // Schedule for all opted-in users
  const users = await User.find({ "settings.dailyMealReminders": true }).select("_id");
  for (const u of users) {
    await scheduleDailyMeal(u._id.toString());
  }
  console.log(`Scheduled daily meal reminders for ${users.length} users`);
}

module.exports = { startFitnessScheduler };






// const { scheduleFitnessReminder } = require("../jobs/fitnessNutritionReminder.job");

// function startFitnessScheduler() {
//   console.log("Starting fitness reminder scheduler...");
//   // Example — should load users from DB and add reminders for opted-in users
//   const mockUsers = ["user1", "user2"];
//   mockUsers.forEach((userId) => scheduleFitnessReminder(userId));
// }

// module.exports = { startFitnessScheduler };

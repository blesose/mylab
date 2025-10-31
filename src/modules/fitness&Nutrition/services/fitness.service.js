// src/modules/fitness&Nutrition/services/fitness.service.js
const Fitness = require("../models/fitness.model");

async function createFitnessActivity(data) {
  return await Fitness.create(data);
}

async function getUserFitnessActivities(userId) {
  return await Fitness.find({ userId }).sort({ createdAt: -1 });
}

// async function updateFitnessActivity(id, updates) {
//   return await Fitness.findByIdAndUpdate(id, updates, { new: true });
// }
async function updateFitnessActivity(id, updates) {
  return await Fitness.findByIdAndUpdate(id, updates, { new: true });
}

async function deleteFitnessActivity(id) {
  return await Fitness.findByIdAndDelete(id);
}

module.exports = {
  createFitnessActivity,
  getUserFitnessActivities,
  updateFitnessActivity,
  deleteFitnessActivity,
};
// // src/modules/fitness&Nutrition/services/fitness.service.js
// const Fitness = require("../models/fitness.model");

// async function createFitnessActivity(data) {
//   return await Fitness.create(data);
// }

// async function getUserFitnessActivities(userId) {
//   return await Fitness.find({ userId }).sort({ createdAt: -1 });
// }
// async function getAUserFitnessActivities(activityId, userId) {
//   return await Fitness.findOne({_id: activityId, userId }).sort({ createdAt: -1 });
// }

// async function updateFitnessActivity(id, updates) {
//   return await Fitness.findByIdAndUpdate(id, updates, { new: true });
// }

// async function deleteFitnessActivity(id) {
//   return await Fitness.findByIdAndDelete(id);
// }

// module.exports = {
//   createFitnessActivity,
//   getUserFitnessActivities,
//   updateFitnessActivity,
//   deleteFitnessActivity,
//   getAUserFitnessActivities,
// };
// const Fitness = require("../models/fitness.model");

// async function createFitnessActivity(data) {
//   return await Fitness.create(data);
// }

// async function getUserFitnessActivities(userId) {
//   return await Fitness.find({ userId }).sort({ createdAt: -1 });
// }

// async function updateFitnessActivity(id, updates) {
//   return await Fitness.findByIdAndUpdate(id, updates, { new: true });
// }

// async function deleteFitnessActivity(id) {
//   return await Fitness.findByIdAndDelete(id);
// }

// module.exports = {
//   createFitnessActivity,
//   getUserFitnessActivities,
//   updateFitnessActivity,
//   deleteFitnessActivity,
// };
// // src/modules/femaleHealth/fitnessNutrition/services/fitnessNutrition.service.js
// const FitnessNutrition = require("../models/fitness.model");
// const { calculateBMR, targetCalories, macroSplit } = require("../utils/fitness.utils");
// const { generateMealPlanAI } = require("./nutrition.ai.service");

// async function generatePersonalizedPlan(userProfile, planPreferences) {
//   // userProfile: { sex, weightKg, heightCm, age, activityLevel }
//   // planPreferences: { goal, dietaryPreference, allergies, mealsPerDay, macroSplitOverride }
//   const bmr = calculateBMR(userProfile);
//   const calories = targetCalories({ bmr, activityLevel: userProfile.activityLevel || "moderate", goal: planPreferences.goal });
//   const macro = macroSplit(calories, planPreferences.macroSplitOverride || undefined);

//   const aiContext = {
//     calories,
//     proteinG: macro.proteinG,
//     fatG: macro.fatG,
//     carbsG: macro.carbsG,
//     dietaryPreference: planPreferences.dietaryPreference,
//     allergies: planPreferences.allergies,
//     mealsPerDay: planPreferences.mealsPerDay || 3,
//     goal: planPreferences.goal,
//     activityLevel: userProfile.activityLevel,
//   };

//   const aiResult = await generateMealPlanAI(aiContext);

//   // persist plan
//   const planDoc = await FitnessNutrition.create({
//     userId: userProfile.userId,
//     goal: planPreferences.goal,
//     activityLevel: userProfile.activityLevel,
//     dietaryPreference: planPreferences.dietaryPreference,
//     caloriesTarget: calories,
//     dailyMeals: aiResult.meals ? aiResult.meals.map(m => m.name) : [aiResult.text || "AI fallback plan"],
//     exercisePlan: planPreferences.exercisePlan || [],
//     aiTip: aiResult.tip || aiResult.text || "Personalized plan generated",
//   });

//   return { plan: planDoc, aiResult, meta: { calories, macro } };
// }
// const { generateSmartHealthTip } = require("../../../ai/ai.helper");

// async function getFitnessNutritionTip(userData) {
//   return await generateSmartHealthTip({
//     category: "Fitness & Nutrition",
//     userData,
//     context: "Focus on daily workout encouragement or dietary balance advice.",
//   });
// }

// // module.exports = { getFitnessNutritionTip };


// module.exports = { generatePersonalizedPlan, getFitnessNutritionTip };
// src/modules/fitness&Nutrition/utils/fitness.utils.js
function calculateCaloriesBurned(duration, intensity) {
  const factor = intensity === "high" ? 10 : intensity === "medium" ? 7 : 5;
  return Math.round(duration * factor);
}

function normalizeActivityType(type) {
  return type.trim().toLowerCase();
}

module.exports = { calculateCaloriesBurned, normalizeActivityType };
// function calculateCaloriesBurned(duration, intensity) {
//   const factor = intensity === "high" ? 10 : intensity === "medium" ? 7 : 5;
//   return duration * factor;
// }

// module.exports = { calculateCaloriesBurned };
// // src/modules/femaleHealth/fitnessNutrition/utils/fitnessNutrition.utils.js
// function calculateBMR({ sex = "female", weightKg, heightCm, age }) {
//   // Mifflin-St Jeor
//   if (sex === "male") {
//     return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
//   }
//   return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
// }

// function activityMultiplier(level = "moderate") {
//   switch (level) {
//     case "low": return 1.2;
//     case "moderate": return 1.55;
//     case "high": return 1.725;
//     default: return 1.55;
//   }
// }

// function targetCalories({ bmr, activityLevel, goal }) {
//   const maint = Math.round(bmr * activityMultiplier(activityLevel));
//   if (goal === "weight_loss") return Math.max(1200, maint - 500);
//   if (goal === "muscle_gain") return maint + 300;
//   return maint;
// }

// function macroSplit(calories, split = { protein: 0.25, fat: 0.25, carbs: 0.5 }) {
//   // calories -> grams (protein/fat/carbs): protein & carbs = 4 kcal/g; fat = 9 kcal/g
//   const proteinKcal = calories * (split.protein || 0.25);
//   const fatKcal = calories * (split.fat || 0.25);
//   const carbsKcal = calories * (split.carbs || 0.5);
//   return {
//     proteinG: Math.round(proteinKcal / 4),
//     fatG: Math.round(fatKcal / 9),
//     carbsG: Math.round(carbsKcal / 4),
//   };
// }

// module.exports = { calculateBMR, targetCalories, macroSplit, activityMultiplier };

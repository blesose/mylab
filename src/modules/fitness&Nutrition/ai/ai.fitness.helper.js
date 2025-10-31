// src/modules/fitness&Nutrition/ai/ai.helper.js
const { calculateCaloriesBurned } = require("../utils/fitness.utils");

/** Grade user performance */
function gradeFitness({ duration, intensity, frequency }) {
  const score =
    (duration / 60) * (intensity === "high" ? 3 : intensity === "medium" ? 2 : 1) * (frequency / 3);

  if (score >= 4) return "Excellent 💪";
  if (score >= 2) return "Good 👍";
  return "Needs Improvement 💤";
}

/** Generate smart tips */
async function getFitnessNutritionTip({ goal, activityLevel, duration, grade }) {
  const calories = calculateCaloriesBurned(duration, activityLevel);
  const tips = {
    "Excellent 💪": `🔥 You're doing awesome! Keep pushing toward your ${goal || "fitness"} goal.`,
    "Good 👍":` 👏 Great effort! Try slightly increasing intensity or duration.`,
    "Needs Improvement 💤": `💡 Start small and stay consistent. Even 15 mins daily makes a difference!`,
  };

  return {
    tip: `${tips[grade]}\nYou burned approximately ${calories} kcal.`,
  };
}

module.exports = { gradeFitness, getFitnessNutritionTip };
// // src/helpers/ai.helper.js
// function gradeFitness({ duration, intensity, frequency }) {
//   let score = 0;
//   if (duration >= 45) score += 3;
//   else if (duration >= 30) score += 2;
//   else if (duration >= 15) score += 1;

//   if (intensity === "high") score += 3;
//   else if (intensity === "medium") score += 2;
//   else score += 1;

//   if (frequency >= 5) score += 3;
//   else if (frequency >= 3) score += 2;
//   else score += 1;

//   if (score >= 8) return "Excellent 💪";
//   if (score >= 5) return "Good 👍";
//   return "Needs Improvement 💤";
// }

// function gradeNutrition({ calories, protein, sugar, fiber }) {
//   const warnings = [];
//   if (calories > 2500) warnings.push("High calorie intake");
//   if (sugar > 50) warnings.push("Too much sugar");
//   if (protein < 50) warnings.push("Low protein");
//   if (fiber < 25) warnings.push("Increase fiber");

//   return warnings.length === 0 ? "Balanced Diet 🥗" : warnings.join(", ");
// }

// module.exports = { gradeFitness, gradeNutrition };
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

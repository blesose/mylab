// src/ai/ai.nutrition.helper.js

/**
 * Grade a nutrition entry based on calories, protein, sugar, and fiber.
 * Returns a grade string.
 */
function gradeNutrition({ calories, protein, sugar, fiber }) {
  if (calories === undefined || protein === undefined || sugar === undefined || fiber === undefined) {
    return "Incomplete data ⚠";
  }

  if (calories <= 2500 && protein >= 50 && sugar < 30 && fiber >= 25) return "Balanced 🍏";
  if (calories > 2500 || sugar > 60) return "High Calorie ⚠";
  if (protein < 50 || fiber < 20) return "Needs Adjustment ⚠";
  return "Moderate ⚖";
}

/**
 * Generate a smart nutrition tip based on the grade and user data.
 * Accepts an object { calories, protein, sugar, fiber, grade }.
 * Returns an object with a tip string.
 */
async function getNutritionTip({ calories, protein, sugar, fiber, grade, goal }) {
  const goalTips = {
    weightLoss: "Focus on high protein, low carb meals and control portions.",
    muscleGain: "Include protein-rich foods and complex carbs for energy.",
    maintenance: "Maintain a balanced diet with all macronutrients in moderation.",
    detox: "Eat more fruits, vegetables, and drink plenty of water.",
  };

  let tip;

  switch (true) {
    case grade.includes("Balanced"):
      tip = "Keep up your balanced diet! 🥗";
      break;
    case grade.includes("High"):
      tip = "Reduce calorie intake and watch sugar levels.";
      break;
    case grade.includes("Adjustment"):
      tip = "Increase protein and fiber for better balance.";
      break;
    default:
      tip = "Maintain a healthy and consistent meal routine.";
  }

  if (goal && goalTips[goal]) {
    tip += ` Goal Tip: ${goalTips[goal]}`;
  }

  return { tip };
}

module.exports = { gradeNutrition, getNutritionTip };
// // src/ai/ai.nutrition.helper.js

// /**
//  * Grades a nutrition entry based on calories, protein, sugar, and fiber
//  */
// function gradeNutrition({ calories, protein, sugar, fiber }) {
//   if (calories <= 2500 && protein >= 50 && sugar < 30 && fiber >= 25) return "Balanced 🍏";
//   if (calories > 2500) return "High Calorie ⚠";
//   if (protein < 50 || fiber < 20) return "Needs Adjustment ⚠";
//   return "Moderate ⚖";
// }

// /**
//  * Returns a smart tip for nutrition based on the grade and user data
//  */
// async function getNutritionTip({ calories, protein, sugar, fiber, grade }) {
//   if (grade.includes("Balanced")) return { tip: "Keep up your balanced diet! 🥗" };
//   if (grade.includes("High")) return { tip: "Reduce calorie intake and watch sugar levels." };
//   if (grade.includes("Adjustment")) return { tip: "Increase protein and fiber for better balance." };
//   return { tip: "Maintain a healthy and consistent meal routine." };
// }

// module.exports = { gradeNutrition, getNutritionTip };
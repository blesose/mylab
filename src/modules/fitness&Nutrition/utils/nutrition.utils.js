// src/utils/nutrition.utils.js

/**
 * Calculate macronutrients from total calories.
 * Protein: 30%, Fat: 25%, Carbs: 45%
 */
function calculateMacros(calories) {
  if (!calories) return { protein: 0, fat: 0, carbs: 0 };
  const protein = (calories * 0.3) / 4;
  const fat = (calories * 0.25) / 9;
  const carbs = (calories * 0.45) / 4;
  return { protein, fat, carbs };
}

/**
 * Calculate total calories from macros
 */
function calculateCaloriesFromMacros({ protein, fat, carbs }) {
  return (protein || 0) * 4 + (fat || 0) * 9 + (carbs || 0) * 4;
}

/**
 * Utility: check if a number is within a specific range
 */
function isWithinRange(value, min, max) {
  return value >= min && value <= max;
}

module.exports = { calculateMacros, calculateCaloriesFromMacros, isWithinRange };
// // src/modules/femaleHealth/fitnessNutrition/utils/nutrition.utils.js

// /**
//  * Calculate macros based on total calories
//  */
// function calculateMacros(calories) {
//   const protein = (calories * 0.3) / 4; // 30% of calories to protein, 4 cal per gram
//   const fat = (calories * 0.25) / 9; // 25% calories to fat, 9 cal per gram
//   const carbs = (calories * 0.45) / 4; // 45% calories to carbs, 4 cal per gram
//   return { protein, fat, carbs };
// }

// module.exports = { calculateMacros };
// function calculateMacros(calories) {
//   const protein = (calories * 0.3) / 4;
//   const fat = (calories * 0.25) / 9;
//   const carbs = (calories * 0.45) / 4;
//   return { protein, fat, carbs };
// }

// module.exports = { calculateMacros };
// // src/modules/femaleHealth/fitnessNutrition/utils/parseMealPlan.util.js
// /**
//  * Try to extract JSON-like plan from AI text. If AI returns JSON, parse it; else return trimmed text.
//  */
// function parseAIResponse(text) {
//   // Attempt to locate a JSON block
//   const jsonMatch = text.match(/(\{[\s\S]*\})/);
//   if (jsonMatch) {
//     try {
//       return JSON.parse(jsonMatch[1]);
//     } catch (e) {
//       // fallthrough
//     }
//   }
//   // fallback: return raw text
//   return { text: text.trim() };
// }

// module.exports = { parseAIResponse };

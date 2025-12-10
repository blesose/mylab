// src/utils/nutrition.utils.js

  // Calculate macronutrients from total calories.
  // Protein: 30%, Fat: 25%, Carbs: 45%
 
function calculateMacros(calories) {
  if (!calories) return { protein: 0, fat: 0, carbs: 0 };
  const protein = (calories * 0.3) / 4;
  const fat = (calories * 0.25) / 9;
  const carbs = (calories * 0.45) / 4;
  return { protein, fat, carbs };
}

  // Calculate total calories from macros
function calculateCaloriesFromMacros({ protein, fat, carbs }) {
  return (protein || 0) * 4 + (fat || 0) * 9 + (carbs || 0) * 4;
}

  // Utility: check if a number is within a specific range
function isWithinRange(value, min, max) {
  return value >= min && value <= max;
}

module.exports = { calculateMacros, calculateCaloriesFromMacros, isWithinRange };

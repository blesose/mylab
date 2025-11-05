// src/modules/fitness&Nutrition/utils/fitness.utils.js
function calculateCaloriesBurned(duration, intensity) {
  const factor = intensity === "high" ? 10 : intensity === "medium" ? 7 : 5;
  return Math.round(duration * factor);
}

function normalizeActivityType(type) {
  return type.trim().toLowerCase();
}

module.exports = { calculateCaloriesBurned, normalizeActivityType };

// src/analysis/nutrition.analysis.js

/**
 * Analyze nutrition records for averages and trends
 */
function analyzeNutritionRecords(records) {
  if (!records || records.length === 0) {
    return { message: "No nutrition records yet", trend: "N/A" };
  }

  const totalCalories = records.reduce((sum, r) => sum + r.calories, 0);
  const totalProtein = records.reduce((sum, r) => sum + r.protein, 0);
  const totalSugar = records.reduce((sum, r) => sum + r.sugar, 0);
  const totalFiber = records.reduce((sum, r) => sum + r.fiber, 0);

  const avgCalories = totalCalories / records.length;
  const avgProtein = totalProtein / records.length;
  const avgSugar = totalSugar / records.length;
  const avgFiber = totalFiber / records.length;

  let trend = "Balanced diet trend";
  if (avgCalories > 2500 || avgSugar > 60) trend = "High calorie/sugar intake";
  else if (avgCalories < 1800 || avgProtein < 50 || avgFiber < 20) trend = "Low calorie/protein/fiber intake";

  return {
    averageCalories: avgCalories,
    averageProtein: avgProtein,
    averageSugar: avgSugar,
    averageFiber: avgFiber,
    trend,
  };
}

module.exports = { analyzeNutritionRecords };

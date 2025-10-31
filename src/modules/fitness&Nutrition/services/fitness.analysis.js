// src/modules/fitness&Nutrition/analysis/fitness.analysis.js
function analyzeFitnessProgress(records) {
  if (!records.length)
    return { message: "No activity data yet.", trend: "N/A", avgDuration: 0 };

  const avgDuration = records.reduce((s, r) => s + r.duration, 0) / records.length;
  const highIntensityCount = records.filter(r => r.intensity === "high").length;
  const highRatio = highIntensityCount / records.length;

  const trend = highRatio > 0.6 ? "High intensity trend 💥" : "Moderate consistency 🧘‍♂";
  const message =
    highRatio > 0.6
      ? "You’ve maintained a strong routine!"
      : "Your effort is steady — consider raising intensity.";

  return { message, trend, avgDuration: Math.round(avgDuration) };
}

module.exports = { analyzeFitnessProgress };
// function analyzeFitnessProgress(records) {
//   if (!records.length) return { message: "No records yet", trend: "N/A" };

//   const avgDuration = records.reduce((s, r) => s + r.duration, 0) / records.length;
//   const avgIntensity = records.filter(r => r.intensity === "high").length / records.length;

//   return {
//     trend: avgIntensity > 0.5 ? "High effort trend" : "Moderate consistency",
//     avgDuration,
//   };
// }

// module.exports = { analyzeFitnessProgress };
// function analyzeProgress(history) {
//   const averageCalories = history.reduce((sum, h) => sum + h.calories, 0) / history.length;
//   return {
//     trend: averageCalories > 2000 ? "High intake" : "Balanced intake",
//     consistency: history.length > 5 ? "Consistent" : "Needs consistency",
//   };
// }

// module.exports = { analyzeProgress };

// src/utils/mensHealth.utils.js

/**
 * Analyze a user's record and return key insights for men's health.
 * You can extend this later with AI-based scoring, habits, or medical data.
 */
function getMensHealthInsights(record) {
  const insights = [];

  if (!record) return ["No data found. Please update your profile."];

  const { age, weight, height, exerciseFrequency, sleepHours, stressLevel, dietQuality } = record;

  // BMI calculation
  if (weight && height) {
    const bmi = weight / ((height / 100) ** 2);
    if (bmi < 18.5) insights.push("You're underweight. Consider adding more protein-rich foods.");
    else if (bmi < 25) insights.push("Your BMI is healthy — keep up your current habits!");
    else if (bmi < 30) insights.push("You're slightly overweight. Try adding more cardio sessions.");
    else insights.push("High BMI detected — talk to a health professional about your diet and fitness plan.");
  }

  // Exercise
  if (exerciseFrequency < 2) insights.push("Try exercising at least 3 times per week for optimal health.");
  else insights.push("Great job maintaining regular exercise!");

  // Sleep
  if (sleepHours < 6) insights.push("You’re not sleeping enough. Aim for 7–8 hours per night.");
  else insights.push("Good sleep habits — keep it up!");

  // Stress
  if (stressLevel >= 7) insights.push("Your stress level seems high. Consider meditation or deep breathing exercises.");

  // Diet
  if (dietQuality === "poor") insights.push("Improve your diet: cut down on sugar and processed foods.");
  else if (dietQuality === "balanced") insights.push("Your diet looks good — continue eating whole foods.");
  else if (dietQuality === "excellent") insights.push("Excellent diet! Keep nourishing your body well.");

  // Age-based reminder
  if (age && age > 40) insights.push("Consider scheduling an annual check-up for prostate and heart health.");

  // Fallback
  if (insights.length === 0) insights.push("Stay active, eat well, and track your progress with MyLab!");

  return insights;
}

module.exports = { getMensHealthInsights };

// // src/utils/mensHealth.utils.js
// exports.getMensHealthInsights = (record) => {
//   const insights = [];

//   if (record.sleepHours < 6)
//     insights.push("😴 You may not be getting enough rest. Aim for 7–8 hours daily.");

//   if (record.stressLevel > 7)
//     insights.push("🧘 Consider meditation or regular exercise to lower stress levels.");

//   if (record.exerciseFrequency === "none" || record.exerciseFrequency === "rarely")
//     insights.push("🏃‍♂️ Regular physical activity boosts testosterone and mood.");

//   if (record.dietType === "junk-heavy")
//     insights.push("🥗 Reduce processed foods; include fruits and vegetables daily.");

  if (!record.prostateCheck)
    insights.push("🩺 Consider scheduling a prostate check if you’re over 40.");

  if (record.testosteroneLevel && record.testosteroneLevel < 300)
    insights.push("⚕️ Low testosterone detected. Consult your healthcare provider.");

  return insights;
};

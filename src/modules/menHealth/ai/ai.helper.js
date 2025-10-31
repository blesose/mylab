/**
 * ai.helper.js
 * Central AI-like helper module for generating smart insights and wellness tips.
 * Handles both female and male health use cases.
 */

const OpenAI = require("openai"); // Optional if you plan real AI API calls later
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ----- GENERIC SMART TIP FUNCTION -----
async function generateSmartHealthTip({ category, userData = {}, context = "" }) {
  try {
    // Here you could later replace this with an AI API call (OpenAI, Gemini, etc.)
    // For now, we use lightweight rule-based logic for local dev.

    const name = userData?.name || "Friend";

    switch (category.toLowerCase()) {
      // FEMALE HEALTH (Already Exists)
      case "female health":
      case "women's health":
      case "pregnancy":
        return `Hey ${name}, keep maintaining hydration and rest — your body’s doing great. Remember to eat folate-rich foods and monitor your energy. 💖`;

      // MEN'S HEALTH
      case "men's health":
      case "male health":
        return generateMensHealthTip(userData, context);

      // FALLBACK
      default:
        return `Hey ${name}, prioritize your well-being today — small habits build lifelong health.`;
    }
  } catch (err) {
    console.error("Error generating smart health tip:", err.message);
    return "Stay mindful of your health and keep a balanced lifestyle.";
  }
}

// ----- MEN’S HEALTH LOGIC -----
function generateMensHealthTip(userData, context) {
  const stress = userData?.stressLevel || 0;
  const sleep = userData?.sleepHours || 0;
  const workout = userData?.workoutDays || 0;
  const age = userData?.age || null;

  let tips = [];

  // Sleep insights
  if (sleep < 6) {
    tips.push("Try improving sleep — lack of rest affects testosterone and energy.");
  } else if (sleep >= 7) {
    tips.push("Good sleep pattern! Keep maintaining 7–8 hours daily.");
  }

  // Stress insights
  if (stress >= 7) {
    tips.push("Stress seems high. Practice deep breathing, meditation, or brief breaks during work.");
  } else {
    tips.push("Stress levels look okay — stay consistent with your calm routines.");
  }

  // Exercise
  if (workout < 3) {
    tips.push("Aim for at least 3 workout days weekly — it boosts mood and heart health.");
  } else {
    tips.push("You’re active — great job keeping your body strong!");
  }

  // Age-based prostate check reminder
  if (age && age >= 40) {
    tips.push("If you haven’t done a prostate check recently, schedule one with your doctor.");
  }

  // Contextual extra
  if (context?.toLowerCase().includes("testosterone")) {
    tips.push("Consider foods like eggs, tuna, and leafy greens to support hormone balance.");
  }

  return tips.join(" ");
}

module.exports = {
  generateSmartHealthTip,
};

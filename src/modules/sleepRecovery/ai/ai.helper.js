/**
 * ai.helper.js
 * -----------------------------------
 * Local production-grade AI helper for SleepRecovery.
 * Works offline — no external API required.
 * Generates realistic, dynamic, science-based sleep advice.
 */

const { format } = require("date-fns");

/**
 * Generates a personalized sleep tip based on user data.
 * @param {object} params - User sleep data
 * @param {string} params.sleepStart - Sleep start time (HH:mm)
 * @param {string} params.sleepEnd - Sleep end time (HH:mm)
 * @param {number} params.sleepQuality - Sleep quality 1–10
 * @returns {object} { tip, category, responseTime, generatedAt }
 */
function getSmartTip({ sleepStart, sleepEnd, sleepQuality }) {
  const startTime = new Date();
  const responseTime = Math.floor(Math.random() * 200) + 80; // simulate quick AI response (80–280ms)

  // Simple duration calculation
  const hoursSlept = calculateSleepDuration(sleepStart, sleepEnd);
  const category = classifySleep(hoursSlept, sleepQuality);
  const tip = generateTip(category, sleepQuality);

  return {
    success: true,
    tip,
    category,
    hoursSlept,
    responseTime: `${responseTime}ms`,
    generatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  };
};

/**
 * Calculates total sleep duration in hours.
 */
// function calculateSleepDuration(start, end) {
//   const [startH, startM] = start.split(":").map(Number);
//   const [endH, endM] = end.split(":").map(Number);
//   let total = (endH + endM / 60) - (startH + startM / 60);
//   if (total < 0) total += 24; // Adjust for midnight crossover
//   return parseFloat(total.toFixed(1));
// }
function calculateSleepDuration(start, end) {
  if (!start || !end) {
    console.warn("⚠ Missing sleepStart or sleepEnd — using default 0 duration");
    return 0;
  }

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  let total = (endH + endM / 60) - (startH + startM / 60);
  if (total < 0) total += 24; // Adjust for midnight crossover
  return parseFloat(total.toFixed(1));
}

/**
 * Classifies sleep into meaningful patterns.
 */
function classifySleep(hours, quality) {
  if (hours < 5) return "Sleep deprived";
  if (hours < 7) return quality < 5 ? "Poor sleep" : "Moderate rest";
  return quality < 6 ? "Tired but rested" : "Well-rested";
}

/**
 * Generates a realistic local AI-style response.
 */
function generateTip(category, quality) {
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const baseTips = {
    "Sleep deprived": [
      "You’re running low on rest — try going to bed 30–60 minutes earlier tonight.",
      "Insufficient sleep weakens focus. Plan an early night to recover.",
      "A quick power nap and early bedtime can help you reset your energy levels."
    ],
    "Poor sleep": [
      "Your sleep quality seems low. Avoid screens and caffeine 2 hours before bed.",
      "Try deep breathing or light stretches before sleeping to unwind.",
      "A warm shower before bed may help calm your mind for better sleep."
    ],
    "Moderate rest": [
      "You're getting a fair amount of rest — consistency is key. Stick to a steady bedtime.",
      "Moderate sleep detected. Avoid heavy meals late at night to improve quality.",
      "You're almost there! Try limiting blue light exposure to boost rest quality."
    ],
    "Tired but rested": [
      "You’re sleeping enough, but recovery might be incomplete. Focus on better sleep quality.",
      "Good hours, but low quality — consider relaxing music or white noise to fall asleep faster.",
      "Try reducing stress or adjusting room temperature for deeper sleep."
    ],
    "Well-rested": [
      "Great job maintaining healthy sleep habits! Keep it up 🌙",
      "Solid rest detected — your routine seems balanced and effective.",
      "Your sleep pattern looks strong. Continue your bedtime consistency!"
    ]
  };

  let advice = random(baseTips[category] || baseTips["Moderate rest"]);

  // Add contextual nuance
  if (quality < 4) advice += " You might also want to take short breaks during the day.";
  else if (quality > 8) advice += " Excellent quality — keep your bedtime routine steady.";

  return advice;
}

module.exports = { getSmartTip };
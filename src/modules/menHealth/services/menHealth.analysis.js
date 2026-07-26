const MenHealth = require("../models/menHealth.model");

async function getMenHealthInsights(userId) {
  try {a
    const records = await MenHealth.find({ userId }).sort({ createdAt: -1 }).limit(5);
    if (!records.length) {
      return {
        insights: [],
        advice: "No previous data yet — add more records to see trends.",
      };
    }

    const avgSleep =
      records.reduce((sum, r) => sum + (r.sleepHours || 0), 0) / records.length;
    const avgStress =
      records.reduce((sum, r) => sum + (r.stressLevel || 0), 0) / records.length;

    let advice = "";
    if (avgSleep < 6) advice += "Try to improve your sleep quality. ";
    if (avgStress > 7) advice += "You seem quite stressed — try relaxation or short walks. ";
    if (!advice) advice = "You're maintaining good balance. Keep it up!";

    return {
      insights: [
        { metric: "Average Sleep (hrs)", value: avgSleep.toFixed(1) },
        { metric: "Average Stress Level", value: avgStress.toFixed(1) },
      ],
      advice,
    };
  } catch (err) {
    console.error("Error generating men health insights:", err.message);
    return { insights: [], advice: "Could not generate insights." };
  }
}

module.exports = { getMenHealthInsights };
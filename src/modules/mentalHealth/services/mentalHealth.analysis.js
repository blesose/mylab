// src/modules/mentalHealth/services/mentalHealth.analysis.js
/**
 * Lightweight analysis utilities for mental health
 */

function computeMoodDistribution(entries) {
  const dist = {};
  entries.forEach(e => {
    dist[e.moodType] = (dist[e.moodType] || 0) + 1;
  });
  return dist;
}

function detectNegativeTrend(entries, windowSize = 10) {
  // look at last `windowSize` entries and compute negative ratio
  const last = entries.slice(0, windowSize);
  if (!last.length) return { negativeRatio: 0, flagged: false };
  const negativeCount = last.filter(e => ["sad","stressed","anxious"].includes(e.moodType)).length;
  const ratio = negativeCount / last.length;
  return { negativeRatio: ratio, flagged: ratio >= 0.4 }; // flag if >=40% negative
}


module.exports = { computeMoodDistribution, detectNegativeTrend };
// modules/mentalHealth/service/mentalHealth.analysis.js
export function detectNegativeTrend(moodEntries) {
  const threshold = -0.3; // drop in average mood
  if (moodEntries.length < 3) return false;
  
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const firstHalf = avg(moodEntries.slice(0, Math.floor(moodEntries.length / 2)));
  const secondHalf = avg(moodEntries.slice(Math.floor(moodEntries.length / 2)));

  return secondHalf - firstHalf < threshold;
}


exports.analyzeMoodTrends = async (userId) => {
  console.log(`🔍 Running mood analysis for user ${userId}`);

  // In production, this would pull from DB
  const fakeData = [
    { mood: "calm", stress: 3 },
    { mood: "happy", stress: 2 },
    { mood: "neutral", stress: 4 },
  ];

  const averageStress = fakeData.reduce((sum, m) => sum + m.stress, 0) / fakeData.length;

  return {
    userId,
    trend: averageStress < 5 ? "Improving" : "Needs attention",
    recommendation:
      averageStress < 5
        ? "Continue mindfulness & exercise."
        : "Consider talking with a counselor.",
  };
};
import { detectNegativeTrend } from "../service/mentalHealth.analysis.js";
import { queueMentalHealthAlert } from "../jobs/mentalHealthAlert.job.js";

export async function analyzeMood(req, res) {
  const { moodEntries, user } = req.body;
  const negative = detectNegativeTrend(moodEntries);

  if (negative) {
    await queueMentalHealthAlert(user);
  }

  res.json({ trend: negative ? "negative" : "stable" });
}


// // src/modules/mentalHealth/services/mentalHealth.analysis.js
// exports.getMentalInsightsForUser = (records) => {
//   if (!records || records.length === 0) return ["No recent records found"];

//   const counts = records.reduce((acc, r) => {
//     acc[r.moodType] = (acc[r.moodType] || 0) + 1;
//     return acc;
//   }, {});

//   const total = records.length;
//   const stressRatio = ((counts.stressed || 0) + (counts.sad || 0)) / total;

//   if (stressRatio > 0.4)
//     return [
//       "You've had several stressful or sad days recently — consider meditation or journaling.",
//       "Reach out to a friend or counselor if the pattern continues.",
//     ];

//   if ((counts.happy || 0) / total > 0.5)
//     return ["You're maintaining a positive outlook — keep it up! 🌞"];

//   return ["Mixed mood trend detected — maintain good rest, nutrition, and routine."];
// };


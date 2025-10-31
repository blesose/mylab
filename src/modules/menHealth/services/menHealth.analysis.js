const MenHealth = require("../models/menHealth.model");

async function getMenHealthInsights(userId) {
  try {
    const records = await MenHealth.find({ userId }).sort({ createdAt: -1 }).limit(5);
    if (!records.length) {
      return {
        insights: [],
        advice: "No previous data yet — add more records to see trends.",
      };
    }

    // compute averages
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

// const MenHealth = require("../models/menHealth.model");
// const getMenHealthInsights = async (userId) => {
//   const records = await MenHealth.find({ userId }).sort({ createdAt: -1 }).limit(5);

//   if (records.length === 0) {
//     return { insights: [], advice: "No records yet to analyze trends." };
//   }

//   const avgSleep = records.reduce((sum, r) => sum + r.sleepHours, 0) / records.length;
//   const avgStress = records.reduce((sum, r) => sum + r.stressLevel, 0) / records.length;

//   let advice = "";
//   if (avgSleep < 6) advice += "Try to get more sleep. ";
//   if (avgStress > 7) advice += "You seem stressed — consider relaxation exercises. ";
//   if (!advice) advice = "You're doing well, maintain your habits.";

//   return {
//     insights: [
//       { metric: "Average Sleep (hrs)", value: avgSleep.toFixed(1) },
//       { metric: "Average Stress Level", value: avgStress.toFixed(1) },
//     ],
//     advice,
//   };
// };

// module.exports = { getMenHealthInsights };
// // const MenHealth = require("../models/menHealth.model");

// // /**
// //  * Lightweight insights generator for men's health
// //  * Can be extended later with ML/AI or richer rules.
// //  */
// // async function getMenHealthInsights(userId) {
// //   // examine last 12 records
// //   const recs = await MenHealth.find({ userId }).sort({ date: -1 }).limit(12);
// //   if (!recs.length) return ["No records yet — try logging your first entry."];

// //   // simple aggregates
// //   const avgSleep = recs.reduce((s, r) => s + (r.sleepHours || 0), 0) / recs.length;
// //   const avgStress = recs.reduce((s, r) => s + (r.stressLevel || 0), 0) / recs.length;
// //   const lowSleep = avgSleep < 6;
// //   const highStress = avgStress >= 7;

// //   const insights = [];
// //   if (lowSleep) insights.push(`Your average sleep over the last ${recs.length} entries is ${avgSleep.toFixed(1)}h — aim for 7–8h.`);
// //   if (highStress) insights.push(`Stress appears elevated (avg ${avgStress.toFixed(1)}). Try short daily relaxation practices.`);
// //   if (!lowSleep && !highStress) insights.push("Overall trends look stable — keep up balanced habits!");

// //   // prostate reminder (age check could be added when user profile has age)
// //   const anyProstate = recs.some(r => r.prostateCheck);
// //   if (!anyProstate) insights.push("If you're over 40, consider scheduling a prostate check with your doctor.");

// //   return insights;
// // }

// // module.exports = { getMenHealthInsights };
// import MenHealth from "../models/menHealth.model.js";

// export const getMenHealthInsights = async (userId) => {
//   try {
//     const records = await MenHealth.find({ userId }).sort({ createdAt: -1 }).limit(5);

//     if (!records.length) {
//       return { advice: "No previous records found to analyze trends." };
//     }

//     // Example simple analysis
//     const avgSleep = records.reduce((sum, r) => sum + r.sleepHours, 0) / records.length;
//     const avgStress = records.reduce((sum, r) => sum + r.stressLevel, 0) / records.length;

//     let advice = "";
//     if (avgSleep < 6) advice += "You should improve your sleep routine. ";
//     if (avgStress > 7) advice += "Try relaxation techniques to reduce stress. ";
//     if (!advice) advice = "Keep up your good health habits!";

//     return { avgSleep, avgStress, advice };
//   } catch (error) {
//     console.error("Error generating men health insights:", error);
//     throw error;
//   }
// };


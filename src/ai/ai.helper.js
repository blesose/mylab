// const { generateAIResponse } = require("./adapters/ai.adapter");

// /**
//  * Generate a smart, contextual health tip for the user.
//  * @param {Object} options - { category, userData, context }
//  */
// async function generateSmartHealthTip({ category, userData = {}, context = "" }) {
//   const { name = "User", gender = "unspecified", age = "unknown", goal = "" } = userData;

//   const prompt = `
//   You are an empathetic and concise AI health coach.
//   Category: ${category}
//   User: ${name}, Gender: ${gender}, Age: ${age}, Goal: ${goal || "overall well-being"}.
//   Context: ${context}

//   Generate one short (max 2 sentences) personalized health tip.
//   Tone: supportive, uplifting, medically sound.
//   `;

//   const tip = await generateAIResponse(prompt);
//   return { tip, generatedAt: new Date(), category };
// }

// module.exports = { generateSmartHealthTip };

// const { generateSmartHealthTip } = require("../../../ai/ai.helper");

// const ovulationAnalysis = {
//   analyze(entries) {
//     if (!entries || entries.length === 0) {
//       return { message: "No ovulation records available for analysis." };
//     }

//     const latest = entries[0];
//     const averageCycle = Math.round(
//       entries.reduce((sum, e) => sum + (e.cycleLength || 28), 0) / entries.length
//     );

//     const tip = generateSmartHealthTip({
//       category: "Ovulation",
//       userData: { cycleLength: averageCycle },
//       context: "Provide personalized ovulation tracking and fertility guidance.",
//     });

//     return {
//       message: "Ovulation data analyzed successfully.",
//       averageCycle,
//       lastCycleStart: latest.cycleStart,
//       lastOvulationDate: latest.ovulationDate,
//       tip,
//     };
//   },
// };

// module.exports = ovulationAnalysis;

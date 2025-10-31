/**
 * Cycle analysis module — part of the service layer
 * Computes averages, irregularities, and predictions
 */

const { calculateNextCycle } = require("../utils/calculateCycle");
const { generateSmartHealthTip } = require("../ai/ai.helper");

class CycleAnalysis {
  analyze(cycles) {
    if (!cycles || cycles.length < 2)
      return {
        message: "Not enough data for meaningful analysis.",
        status: "Insufficient",
      };

    // Sort cycles by start date (newest first)
    cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Calculate cycle lengths based on gap between start dates
    const lengths = [];
    for (let i = 0; i < cycles.length - 1; i++) {
      const diff =
        (new Date(cycles[i].startDate) - new Date(cycles[i + 1].startDate)) /
        (1000 * 60 * 60 * 24);
      if (diff > 10 && diff < 50) lengths.push(diff); // filter unrealistic values
    }

    const avgLength =
      lengths.length > 0
        ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
        : 28;

    const irregularities = lengths.filter(
      l => Math.abs(l - avgLength) > 3
    ).length;

    const isRegular = irregularities === 0;

    const lastCycle = cycles[0];
    const predictedNext = calculateNextCycle(lastCycle.startDate, avgLength);

    // 🔹 Generate AI Tip with smarter logic
    const tip = generateSmartHealthTip({
      category: "Cycle",
      userData: { notes: lastCycle.notes || "" },
      context: "Provide menstrual cycle tracking and comfort advice.",
    });

    // 🔹 Determine health status (for color indicators)
    let status = "Healthy";
    if (irregularities > 2) status = "Irregular";
    else if (irregularities > 0) status = "Monitor";

    // 🔹 Build human-readable summary
    const summary = isRegular
      ? "Your cycle appears regular. Great job maintaining consistency!"
      : "Some irregularities detected. Consider tracking more closely or consulting a professional.";

    return {
      averageLength: avgLength,
      irregularities,
      isRegular,
      predictedNext,
      summary,
      status,
      tip,
    };
  }
}

module.exports = new CycleAnalysis();

// const { calculateNextCycle } = require("../utils/calculateCycle");
// const { generateSmartHealthTip } = require("../ai/ai.helper");

// class CycleAnalysis {
//   analyze(cycles) {
//     if (!cycles || cycles.length < 2)
//       return { message: "Not enough data for meaningful analysis." };

//     const lengths = cycles.map(c =>
//       (new Date(c.endDate) - new Date(c.startDate)) / (1000 * 60 * 60 * 24)
//     );

//     const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
//     const irregularities = lengths.filter(l => Math.abs(l - avgLength) > 3).length;
//     const isRegular = irregularities === 0;

//     const lastCycle = cycles[0];
//     const predictedNext = calculateNextCycle(lastCycle.startDate, avgLength);

//     // 🔹 Generate AI Tip here
//     const tip = generateSmartHealthTip({
//       category: "Cycle",
//       userData: { notes: lastCycle.notes || "" },
//       context: "Provide menstrual cycle tracking and comfort advice."
//     });

//     return {
//       averageLength: avgLength,
//       irregularities,
//       isRegular,
//       predictedNext,
//       summary: isRegular
//         ? "Your cycle appears regular. Great job maintaining consistency!"
//         : "Some irregularities detected. Consider tracking more closely or consulting a professional.",
//       tip, // 🔹 include it in the response
//     };
//   }
// }

// module.exports = new CycleAnalysis();

// /**
//  * Cycle analysis module — part of the service layer
//  * Computes averages, irregularities, and predictions
//  */

// const { calculateNextCycle } = require("../utils/calculateCycle");

// class CycleAnalysis {
//   analyze(cycles) {
//     if (!cycles || cycles.length < 2)
//       return { message: "Not enough data for meaningful analysis." };

//     const lengths = cycles.map(c =>
//       (new Date(c.endDate) - new Date(c.startDate)) / (1000 * 60 * 60 * 24)
//     );

//     const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
//     const irregularities = lengths.filter(l => Math.abs(l - avgLength) > 3).length;
//     const isRegular = irregularities === 0;

//     const lastCycle = cycles[0];
//     const predictedNext = calculateNextCycle(lastCycle.startDate, avgLength);

//     return {
//       averageLength: avgLength,
//       irregularities,
//       isRegular,
//       predictedNext,
//       summary: isRegular
//         ? "Your cycle appears regular. Great job maintaining consistency!"
//         : "Some irregularities detected. Consider tracking more closely or consulting a professional.",
//     };
//   }
// }

// module.exports = new CycleAnalysis();



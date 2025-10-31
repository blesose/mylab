const { generateSmartHealthTip } = require("../ai/ai.helper");

const ovulationAnalysis = {
  analyze(entries) {
    if (!entries || entries.length === 0) {
      return { message: "No ovulation records available for analysis." };
    }

    const latest = entries[0];
    const averageCycle = Math.round(
      entries.reduce((sum, e) => sum + (e.cycleLength || 28), 0) / entries.length
    );

    const tip = generateSmartHealthTip({
      category: "Ovulation",
      userData: { cycleLength: averageCycle },
      context: "Provide personalized ovulation tracking and fertility guidance.",
    });

    return {
      message: "Ovulation data analyzed successfully.",
      averageCycle,
      lastCycleStart: latest.cycleStart,
      lastOvulationDate: latest.ovulationDate,
      tip,
    };
  },
};

module.exports = ovulationAnalysis;

// /**
//  * Simple Ovulation Analysis — identifies patterns and irregularity.
//  */

// class OvulationAnalysis {
//   analyze(entries) {
//     if (!entries || entries.length < 2)
//       return { message: "Not enough ovulation data for meaningful analysis." };

//     const intervals = entries.map((e, i) => {
//       if (i === 0) return 0;
//       return (new Date(entries[i - 1].ovulationDate) - new Date(e.ovulationDate)) / (1000 * 60 * 60 * 24);
//     }).filter(v => v > 0);

//     const avgInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
//     const irregularities = intervals.filter(i => Math.abs(i - avgInterval) > 3).length;
//     const isRegular = irregularities === 0;

//     return {
//       avgInterval,
//       isRegular,
//       irregularities,
//       summary: isRegular
//         ? "Ovulation patterns appear consistent."
//         : "Some irregular patterns detected. Keep tracking for accuracy.",
//     };
//   }
// }

// const tip = generateSmartHealthTip({
//   category: "Ovulation",
//   userData: { cycleStart, cycleLength },
// });

// module.exports = new OvulationAnalysis();

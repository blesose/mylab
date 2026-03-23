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
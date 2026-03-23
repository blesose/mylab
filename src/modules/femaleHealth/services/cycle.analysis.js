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

    // 🔹 Generate AI Tip with all data
    const tip = generateSmartHealthTip({
      category: "Cycle",
      userData: { 
        notes: lastCycle.notes || "",
        flowLevel: lastCycle.flowLevel,
        mood: lastCycle.mood,
        energyLevel: lastCycle.energyLevel,
        crampsIntensity: lastCycle.crampsIntensity,
        symptoms: lastCycle.symptoms
      },
      context: "Provide menstrual cycle tracking and comfort advice based on symptoms and patterns.",
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
      // Add symptom analysis
      commonSymptoms: this.analyzeSymptoms(cycles),
      moodPatterns: this.analyzeMoods(cycles),
      flowPatterns: this.analyzeFlow(cycles)
    };
  }

  // Helper methods for detailed analysis
  analyzeSymptoms(cycles) {
    const symptomCount = {};
    cycles.forEach(cycle => {
      if (cycle.symptoms && Array.isArray(cycle.symptoms)) {
        cycle.symptoms.forEach(symptom => {
          symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
        });
      }
    });
    
    return Object.entries(symptomCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, frequency: count }));
  }

  analyzeMoods(cycles) {
    const moodCount = {};
    cycles.forEach(cycle => {
      if (cycle.mood) {
        moodCount[cycle.mood] = (moodCount[cycle.mood] || 0) + 1;
      }
    });
    
    return Object.entries(moodCount)
      .sort(([,a], [,b]) => b - a)
      .map(([mood, count]) => ({ mood, count }));
  }

  analyzeFlow(cycles) {
    const flowCount = {};
    cycles.forEach(cycle => {
      if (cycle.flowLevel) {
        flowCount[cycle.flowLevel] = (flowCount[cycle.flowLevel] || 0) + 1;
      }
    });
    
    return Object.entries(flowCount)
      .sort(([,a], [,b]) => b - a)
      .map(([flow, count]) => ({ flow, count }));
  }
}

module.exports = new CycleAnalysis();
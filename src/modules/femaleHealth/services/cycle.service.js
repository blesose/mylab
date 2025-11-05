const Cycle = require("../models/cycle.model");
const { calculateNextCycle, calculatePeriodLength } = require("../utils/calculateCycle");
const cycleAnalysis = require("./cycle.analysis");

class CycleService {
  async createCycle(userId, startDate, endDate, notes = "") {
    const cycleLength = calculatePeriodLength(startDate, endDate);
    const nextCycle = calculateNextCycle(startDate, cycleLength);

    const cycle = await Cycle.create({ userId, startDate, endDate, notes });
    return { cycle, cycleLength, nextCycle };
  }

  async getCyclesWithAnalysis(userId) {
    const cycles = await Cycle.find({ userId }).sort({ startDate: -1 });
    const analysis = cycleAnalysis.analyze(cycles);
    return { cycles, analysis };
  }

  async getLatestCycle(userId) {
    return await Cycle.findOne({ userId }).sort({ startDate: -1 });
  }
}
const { generateSmartHealthTip } = require("../ai/ai.helper");

async function getCycleHealthTip(userData) {
  return await generateSmartHealthTip({
    category: "Female Cycle Health",
    userData,
    context: "Offer advice for hormonal balance, cramps, and rest during cycle.",
  });
}



module.exports = { getCycleHealthTip };

module.exports = new CycleService();



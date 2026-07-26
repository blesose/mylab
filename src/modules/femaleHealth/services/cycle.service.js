const Cycle = require("../models/cycle.model");
const { calculateNextCycle, calculatePeriodLength } = require("../utils/calculateCycle");
const cycleAnalysis = require("./cycle.analysis");

class CycleService {
  async createCycle(
    userId, 
    startDate, 
    endDate, 
    notes = "", 
    flowLevel = 'medium',
    symptoms = [],
    mood = 'neutral',
    energyLevel = 'medium',
    crampsIntensity = 'none',
    flowConsistency = 'normal'
  ) {
    const cycleLength = calculatePeriodLength(startDate, endDate);
    const nextCycle = calculateNextCycle(startDate, cycleLength);

    const cycle = await Cycle.create({ 
      userId, 
      startDate, 
      endDate, 
      notes,
      flowLevel,
      symptoms,
      mood,
      energyLevel,
      crampsIntensity,
      flowConsistency
    });
    
    return { 
      cycle, 
      cycleLength, 
      nextCycle 
    };
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

async function getCycleHealthTip(userData) {
  return await generateSmartHealthTip({
    category: "Female Cycle Health",
    userData,
    context: `Based on cycle data: Flow: ${userData.flowLevel}, Mood: ${userData.mood}, Energy: ${userData.energyLevel}, Cramps: ${userData.crampsIntensity}. Offer advice for hormonal balance, cramps, and rest during cycle.`,
  });
}

module.exports = new CycleService();
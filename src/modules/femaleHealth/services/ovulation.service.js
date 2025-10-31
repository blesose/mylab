const Ovulation = require("../models/ovulation.model");
const { calculateOvulation } = require("../utils/calculateOvulation");
const ovulationAnalysis = require("./ovulation.analysis");
const { generateSmartHealthTip } = require("../ai/ai.helper"); // ✅ Correct path

class OvulationService {
  async createEntry(userId, cycleStart, cycleLength = 28, notes = "") {
    const { ovulation, fertileStart, fertileEnd } = calculateOvulation(cycleStart, cycleLength);

    const entry = await Ovulation.create({
      userId,
      cycleStart,
      cycleLength,
      ovulationDate: ovulation,
      fertileWindowStart: fertileStart,
      fertileWindowEnd: fertileEnd,
      notes,
    });

    return {
      entry,
      prediction: { ovulation, fertileStart, fertileEnd },
    };
  }

  async getEntriesWithAnalysis(userId) {
    const entries = await Ovulation.find({ userId }).sort({ cycleStart: -1 });
    const analysis = ovulationAnalysis.analyze(entries);
    return { entries, analysis };
  }

  async getNextOvulation(userId) {
    const last = await Ovulation.findOne({ userId }).sort({ cycleStart: -1 });
    if (!last) return null;
    const next = calculateOvulation(last.cycleStart, last.cycleLength);
    return next;
  }

  async analyzeOvulation(userData) {
    const analysis = ovulationAnalysis.analyze([userData]);

    const tip = generateSmartHealthTip({
      category: "Ovulation",
      userData,
      context: "Provide personalized ovulation tracking and fertility guidance.",
    });

    return { analysis, tip };
  }
}

module.exports = new OvulationService();

// const Ovulation = require("../models/ovulation.model");
// const { calculateOvulation } = require("../utils/calculateOvulation");
// const ovulationAnalysis = require("./ovulation.analysis");
// const { generateSmartHealthTip } = require("../ai/ai.helper"); // ✅ FIXED PATH

// class OvulationService {
//   async createEntry(userId, cycleStart, cycleLength = 28, notes = "") {
//     const { ovulation, fertileStart, fertileEnd } = calculateOvulation(cycleStart, cycleLength);

//     const entry = await Ovulation.create({
//       userId,
//       cycleStart,
//       cycleLength,
//       ovulationDate: ovulation,
//       fertileWindowStart: fertileStart,
//       fertileWindowEnd: fertileEnd,
//       notes,
//     });

//     return {
//       entry,
//       prediction: { ovulation, fertileStart, fertileEnd },
//     };
//   }

//   async getEntriesWithAnalysis(userId) {
//     const entries = await Ovulation.find({ userId }).sort({ cycleStart: -1 });
//     const analysis = ovulationAnalysis.analyze(entries);
//     return { entries, analysis };
//   }

//   async getNextOvulation(userId) {
//     const last = await Ovulation.findOne({ userId }).sort({ cycleStart: -1 });
//     if (!last) return null;
//     const next = calculateOvulation(last.cycleStart, last.cycleLength);
//     return next;
//   }

//   // ✅ Added inside the class (not outside)
//   async analyzeOvulation(userData) {
//     const analysis = ovulationAnalysis.analyze([userData]);

//     const tip = await generateSmartHealthTip({
//       category: "Ovulation",
//       userData,
//       context: "Provide personalized ovulation tracking and fertility guidance.",
//     });

//     return { analysis, tip };
//   }
// }

// module.exports = new OvulationService();

// const Ovulation = require("../models/ovulation.model");
// const { calculateOvulation } = require("../utils/calculateOvulation");
// const ovulationAnalysis = require("./ovulation.analysis");
// const { generateSmartHealthTip } = require("../utils/ai.helper");
// class OvulationService {
//   async createEntry(userId, cycleStart, cycleLength = 28, notes = "") {
//     const { ovulation, fertileStart, fertileEnd } = calculateOvulation(cycleStart, cycleLength);
//     const entry = await Ovulation.create({ userId, cycleStart, cycleLength, ovulationDate: ovulation, fertileWindowStart: fertileStart, fertileWindowEnd: fertileEnd, notes });
//     return { entry, prediction: { ovulation, fertileStart, fertileEnd } };
//   }

//   async getEntriesWithAnalysis(userId) {
//     const entries = await Ovulation.find({ userId }).sort({ cycleStart: -1 });
//     const analysis = ovulationAnalysis.analyze(entries);
//     return { entries, analysis };
//   }

//   async getNextOvulation(userId) {
//     const last = await Ovulation.findOne({ userId }).sort({ cycleStart: -1 });
//     if (!last) return null;
//     const next = calculateOvulation(last.cycleStart, last.cycleLength);
//     return next;
//   }
// }
// async function analyzeOvulation(userData) {
//   // your logic here...
  
//   const tip = await generateSmartHealthTip({
//     category: "Ovulation",
//     userData,
//     context: "Provide personalized ovulation tracking and fertility guidance.",
//   });

//   return { analysis, tip };
// }

// module.exports = { analyzeOvulation };
// // const tip = generateSmartHealthTip({
// //   category: "Ovulation",
// //   userData: { cycleStart, cycleLength },
// // });

// module.exports = new OvulationService();

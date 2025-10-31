// src/modules/sleep/services/sleep.service.js

const SleepRecord = require("../models/sleep.model");
const { analyzeSleepPattern } = require("./sleep.analysis");
const { getSmartTip } = require("../ai/ai.helper"); // ✅ Adjust path as needed

/**
 * Log a new sleep record and generate insights + AI tip.
 * @param {object} data - Sleep record details
 * @returns {object} record, analysis, aiResponse
 */
const logSleepRecord = async (data) => {
  try {
    const { userId, date, sleepStart, sleepEnd, sleepQuality, notes } = data;

    // Analyze raw sleep data
    const analysis = analyzeSleepPattern(sleepStart, sleepEnd, sleepQuality);

    // Generate contextual AI-like advice (local)
    const aiResponse = getSmartTip({
      sleepStart,
      sleepEnd,
      sleepQuality,
    });

    // Create and save the sleep record
    const record = new SleepRecord({
      userId,
      date,
      sleepStart,
      sleepEnd,
      sleepQuality,
      notes,
      aiTip: aiResponse.tip,
    });

    await record.save();

    // Return everything for the controller
    return {
      success: true,
      record,
      analysis,
      aiResponse,
    };

  } catch (error) {
    console.error("Error logging sleep record:", error);
    throw new Error("Failed to log sleep record");
  }
};

/**
 * Fetch all sleep records for a user.
 * @param {string} userId - User’s ID
 * @returns {Array} Sorted sleep history
 */
const getSleepHistory = async (userId) => {
  try {
    const records = await SleepRecord.find({ userId }).sort({ date: -1 });
    return { success: true, records };
  } catch (error) {
    console.error("Error fetching sleep history:", error);
    throw new Error("Failed to fetch sleep history");
  }
};

module.exports = { logSleepRecord, getSleepHistory };
// // src/modules/sleep/services/sleep.service.js
// const SleepRecord = require("../models/sleep.model");
// const { analyzeSleepPattern } = require("../services/sleep.analysis");
// // Use your AI helper function (adjust import path if different)
// const { generateSmartHealthTip } = require("../../../ai/ai.helper"); // <-- make sure path is correct

// const logSleepRecord = async (data) => {
//   const { userId, date, sleepStart, sleepEnd, sleepQuality, notes } = data;

//   // run local analysis
//   const analysis = analyzeSleepPattern(sleepStart, sleepEnd, sleepQuality);

//   // generate a tip — replace with your real AI helper or keep simple string
//   // If generateSmartHealthTip is synchronous, adjust accordingly (function currently returns string).
//   const aiTip = await generateSmartHealthTip({
//     category: "Sleep",
//     userData: { sleepQuality, hours: analysis.hoursSlept },
//     context: "Give a practical sleep improvement tip."
//   });

//   const record = new SleepRecord({ userId, date, sleepStart, sleepEnd, sleepQuality, notes, aiTip });
//   await record.save();

//   return { record, analysis };
// };

// const getSleepHistory = async (userId) => {
//   return await SleepRecord.find({ userId }).sort({ date: -1 });
// };

// module.exports = { logSleepRecord, getSleepHistory };
// const SleepRecord  = require("../models/sleep.model.js");
// const { analyzeSleepPattern } = require("../services/sleep.analysis.js");
// // import { getSmartTip } from "../";

// const logSleepRecord = async (data) => {
//   const { userId, date, sleepStart, sleepEnd, sleepQuality, notes } = data;

//   const analysis = analyzeSleepPattern(sleepStart, sleepEnd, sleepQuality);
//   const aiTip = await getSmartTip(`Give a helpful sleep improvement tip based on ${sleepQuality}/10 quality`);

//   const record = new SleepRecord({ userId, date, sleepStart, sleepEnd, sleepQuality, notes, aiTip });
//   await record.save();

//   return { record, analysis };
// };

// const getSleepHistory = async (userId) => {
//   return await SleepRecord.find({ userId }).sort({ date: -1 });
// };

// module.exports = { logSleepRecord, getSleepHistory }
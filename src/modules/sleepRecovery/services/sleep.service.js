const SleepRecord = require("../models/sleep.model");
const { analyzeSleepPattern } = require("./sleep.analysis");
const { getSmartTip } = require("../ai/ai.helper");

const logSleepRecord = async (data) => {
  try {
    const { userId, sleepStart, sleepEnd, sleepQuality, notes } = data;

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
      sleepStart,
      sleepEnd,
      sleepQuality,
      notes,
      aiTip: aiResponse.tip,
    });

    await record.save();

    // Return everything for the controller
    return {
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
 * @param {string} userId - User's ID
 * @returns {Array} Sorted sleep history
 */
const getSleepHistory = async (userId) => {
  try {
    const records = await SleepRecord.find({ userId }).sort({ createdAt: -1 });
    return records;  // ✅ Return just the array, not wrapped object
  } catch (error) {
    console.error("Error fetching sleep history:", error);
    throw new Error("Failed to fetch sleep history");
  }
};

module.exports = { logSleepRecord, getSleepHistory };
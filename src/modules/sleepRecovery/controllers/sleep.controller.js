const SleepRecord = require("../models/sleep.model");
const { logSleepRecord, getSleepHistory } = require("../services/sleep.service");
const { analyzeSleepPattern } = require("../services/sleep.analysis");
const { getSmartTip } = require("../ai/ai.helper");

// ✅ CREATE (Add new sleep record)
const addSleepRecord = async (req, res) => {
  try {
    const userId = req.userId;
    const payload = { ...req.body, userId };
    const result = await logSleepRecord(payload);

    res.status(201).json({
      success: true,
      message: "Sleep record logged successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error in addSleepRecord:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ READ ALL (Get user’s full sleep history)
const fetchSleepHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await getSleepHistory(userId);

    res.status(200).json({
      success: true,
      message: "Sleep history retrieved successfully",
      data,
    });
  } catch (err) {
    console.error("Error in fetchSleepHistory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ READ ONE (Get a single sleep record)
const fetchSleepRecordById = async (req, res) => {
  try {
    const userId = req.userId;
    const { recordId } = req.params;

    const record = await SleepRecord.findOne({ _id: recordId, userId });
    if (!record)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.status(200).json({
      success: true,
      message: "Sleep record retrieved successfully",
      data: record,
    });
  } catch (err) {
    console.error("Error in fetchSleepRecordById:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
const updateSleepRecord = async (req, res) => {
  try {
    const userId = req.userId;
    const { recordId } = req.params;
    const updates = req.body;

    // Fetch the existing record
    const existing = await SleepRecord.findOne({ _id: recordId, userId });
    if (!existing)
      return res.status(404).json({ success: false, message: "Record not found" });

    // Identify fields that affect AI logic
    const fieldsThatAffectTip = ["sleepStart", "sleepEnd", "sleepQuality"];
    const shouldRegenerate = fieldsThatAffectTip.some(
      (key) => updates[key] !== undefined && updates[key] !== existing[key]
    );

    // If relevant fields changed → re-analyze & generate AI tip
    if (shouldRegenerate) {
      const newData = {
        sleepStart: updates.sleepStart || existing.sleepStart,
        sleepEnd: updates.sleepEnd || existing.sleepEnd,
        sleepQuality: updates.sleepQuality || existing.sleepQuality,
      };

      const analysis = analyzeSleepPattern(
        newData.sleepStart,
        newData.sleepEnd,
        newData.sleepQuality
      );

      // Use your local AI helper
      const aiResponse = getSmartTip({
        sleepStart: newData.sleepStart,
        sleepEnd: newData.sleepEnd,
        sleepQuality: newData.sleepQuality,
      });

      updates.aiTip = aiResponse.tip;
    }

    // Apply updates
    const updated = await SleepRecord.findOneAndUpdate(
      { _id: recordId, userId },
      updates,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Sleep record updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Error in updateSleepRecord:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ DELETE
const deleteSleepRecord = async (req, res) => {
  try {
    const userId = req.userId;
    const { recordId } = req.params;

    const deleted = await SleepRecord.findOneAndDelete({ _id: recordId, userId });
    if (!deleted)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.status(200).json({
      success: true,
      message: "Sleep record deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteSleepRecord:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addSleepRecord,
  fetchSleepHistory,
  fetchSleepRecordById,
  updateSleepRecord,
  deleteSleepRecord,
};
// // src/modules/sleep/controllers/sleep.controller.js
// // const { sleepValidator } = require("../validators/sleep.validator");
// const { logSleepRecord, getSleepHistory } = require("../services/sleep.service");

// // Using validator as middleware in the route is recommended (so controller assumes valid payload)
// const addSleepRecord = async (req, res) => {
//   try {
//     // If you prefer in-controller validation: const { error, value } = schema.validate(req.body)
//     const result = await logSleepRecord(req.body);
//     return res.status(201).json({ message: "Sleep record logged successfully", result });
//   } catch (err) {
//     console.error("addSleepRecord error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// const fetchSleepHistory = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const data = await getSleepHistory(userId);
//     return res.status(200).json({ success: true, data });
//   } catch (err) {
//     console.error("fetchSleepHistory error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { addSleepRecord, fetchSleepHistory };
// const { sleepValidator } = require("../validators/sleep.validator");
// const { logSleepRecord, getSleepHistory } = require("../services/sleep.service")
// const addSleepRecord = async (req, res) => {
//   try {
//     const { error, value } = sleepValidator.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const result = await logSleepRecord(value);
//     res.status(201).json({ message: "Sleep record logged successfully", result });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const fetchSleepHistory = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const data = await getSleepHistory(userId);
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { addSleepRecord, fetchSleepHistory };
const SleepRecord = require("../models/sleep.model");
const { logSleepRecord, getSleepHistory } = require("../services/sleep.service");
const { analyzeSleepPattern } = require("../services/sleep.analysis");
const { getSmartTip } = require("../ai/ai.helper");

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

// (Get a single sleep record)
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

    console.log('Update request:', { userId, recordId, updates }); // Debug log

    // Fetch the existing record
    const existing = await SleepRecord.findOne({ _id: recordId, userId });
    if (!existing) {
      console.log('Record not found:', recordId); // Debug log
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    console.log('Existing record:', existing); // Debug log

    // Check if we need to regenerate AI tip
    const fieldsThatAffectTip = ["sleepStart", "sleepEnd", "sleepQuality"];
    let shouldRegenerate = false;
    
    for (const key of fieldsThatAffectTip) {
      if (updates[key] !== undefined && updates[key] !== existing[key]) {
        console.log(`Field changed: ${key}, from: ${existing[key]}, to: ${updates[key]}`); // Debug
        shouldRegenerate = true;
        break;
      }
    }

    console.log('Should regenerate AI tip:', shouldRegenerate); // Debug

    // If relevant fields changed → re-analyze & generate AI tip
    if (shouldRegenerate) {
      const newData = {
        sleepStart: updates.sleepStart || existing.sleepStart,
        sleepEnd: updates.sleepEnd || existing.sleepEnd,
        sleepQuality: updates.sleepQuality || existing.sleepQuality,
      };

      console.log('New data for AI tip:', newData); // Debug

      try {
        // Validate data before calling AI helper
        if (!newData.sleepStart || !newData.sleepEnd) {
          console.warn('Missing sleep times for AI tip generation');
        } else {
          const analysis = analyzeSleepPattern(
            newData.sleepStart,
            newData.sleepEnd,
            newData.sleepQuality || 5
          );
          console.log('Sleep analysis:', analysis); // Debug

          // Use your local AI helper
          const aiResponse = getSmartTip({
            sleepStart: newData.sleepStart,
            sleepEnd: newData.sleepEnd,
            sleepQuality: newData.sleepQuality || 5,
          });
          console.log('AI response:', aiResponse); // Debug

          if (aiResponse && aiResponse.tip) {
            updates.aiTip = aiResponse.tip;
          } else {
            updates.aiTip = "Sleep pattern updated. Keep maintaining good sleep habits!";
          }
        }
      } catch (aiError) {
        console.error('Error generating AI tip:', aiError);
        // Fallback tip if AI generation fails
        updates.aiTip = "Sleep record updated. Remember to maintain consistent sleep schedule!";
      }
    }

    console.log('Final updates to apply:', updates); // Debug

    // Apply updates
    const updated = await SleepRecord.findOneAndUpdate(
      { _id: recordId, userId },
      updates,
      { new: true, runValidators: true } // Added runValidators
    );

    if (!updated) {
      console.error('Update failed - no document returned');
      return res.status(500).json({ success: false, message: "Failed to update record" });
    }

    console.log('Successfully updated record:', updated._id); // Debug

    res.status(200).json({
      success: true,
      message: "Sleep record updated successfully",
      data: updated,
    });

  } catch (err) {
    console.error('Error in updateSleepRecord:', err);
    console.error('Error stack:', err.stack); // Added stack trace
    
    // More specific error messages
    let errorMessage = err.message;
    if (err.name === 'ValidationError') {
      errorMessage = `Validation error: ${Object.values(err.errors).map(e => e.message).join(', ')}`;
    } else if (err.name === 'CastError') {
      errorMessage = `Invalid record ID format`;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
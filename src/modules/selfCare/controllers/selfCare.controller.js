const {
  logSelfCareActivity,
  getAllSelfCareActivities,
} = require("../services/selfCare.service.js");
const { selfCareValidator } = require("../validators/selfCare.validator.js");
const { analyzeSelfCare } = require("../services/selfCare.analysis.js");
const SelfCare = require("../models/selfCare.model.js");
const { getSmartSelfCareTip } = require("../ai/ai.helper.js");



const addSelfCare = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing userId from token." });
    }

    const result = await logSelfCareActivity({ ...req.body, userId });

    res.status(201).json({
      success: true,
      message: "Self-care activity logged successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error adding self-care activity:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error while adding self-care activity",
    });
  }
};

const fetchAllSelfCareActivities = async (req, res) => {
  try {
    const userId = req.userId; // ✅ just assign directly
    const data = await getAllSelfCareActivities(userId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Error fetching self-care activities:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// module.exports = { addSelfCare };
/**
 * 📖 READ: Fetch all self-care activities for a user
 */
const fetchSelfCareActivities = async (req, res) => {
  try {
    const  userId  = req.userId;
    const { activitiesId } = req.params;
    const activities = await SelfCare.findOne({ _id: activitiesId, userId });
    if(!activities)
      return res.status(404).json({ success: false, message: "activity not found" });

    res.status(200).json({ 
      success: true,
      message: "selfcare activity retrieved successfully",
      data: activities,
    });
  } catch (err) {
    console.error("Error fetching self-care activities:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * ✏ UPDATE: Update self-care record and regenerate AI tip if relevant fields change
 */
// const updateSelfCare = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { activitiesId } = req.params;
//     const updates = req.body;

//     // Get existing activity
//     const existing = await SelfCare.findById({_id: activitiesId, userId});
//     if (!existing)
//       return res.status(404).json({ success: false, message: "Activity not found" });

//     // Check if important fields changed
//     const fieldsThatAffectTip = ["activityType", "duration", "moodBefore", "moodAfter"];
//     const shouldRegenerate = fieldsThatAffectTip.some(
//       (key) => updates[key] !== undefined && updates[key] !== existing[key]
//     );

//     if (shouldRegenerate) {
//       const analysis = analyzeSelfCare(
//         updates.duration || existing.duration,
//         updates.moodBefore || existing.moodBefore,
//         updates.moodAfter || existing.moodAfter
//       );

//       // Generate a new smart tip
//       const aiTipData = getSmartSelfCareTip({
//         sleepStart, // dummy placeholder to reuse helper structure
//         sleepEnd,
//         sleepQuality,
//       });

//       updates.aiTip =`🧠 ${aiTipData.tip}\n${analysis.message}`;
//     }

//     // Save updated record
//     const updated = await SelfCare.findByIdAndUpdate(id, updates, { new: true });

//     res.status(200).json({
//       success: true,
//       message: "Self-care activity updated successfully",
//       data: updated,
//     });
//   } catch (err) {
//     console.error("Error updating self-care activity:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
const updateSelfCare = async (req, res) => {
  try {
    const userId = req.userId;
    const { activitiesId } = req.params;
    const updates = req.body;

    // ✅ Check ownership and existence
    const existing = await SelfCare.findOne({ _id: activitiesId, userId });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Activity not found or you don't have permission to update it",
      });
    }

    // ✅ Merge updates with existing record
    const merged = {
      ...existing.toObject(),
      ...updates,
    };

    // ✅ Always run analysis and generate AI tip
    const analysis = analyzeSelfCare(
      merged.duration,
      merged.moodBefore,
      merged.moodAfter
    );

    const aiTipData = getSmartSelfCareTip({
      activityType: merged.activityType,
      duration: merged.duration,
      moodBefore: merged.moodBefore,
      moodAfter: merged.moodAfter,
    });

    merged.aiTip = `🧠 ${aiTipData.tip}\n${analysis.message}`;

    // ✅ Save updated record
    const updated = await SelfCare.findByIdAndUpdate(activitiesId, merged, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Self-care activity updated successfully with fresh AI insight",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating self-care activity:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// const updateSleepRecord = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { recordId } = req.params;
//     const updates = req.body;

//     // Fetch the existing record
//     const existing = await SleepRecord.findOne({ _id: recordId, userId });
//     if (!existing)
//       return res.status(404).json({ success: false, message: "Record not found" });

//     // Identify fields that affect AI logic
//     const fieldsThatAffectTip = ["sleepStart", "sleepEnd", "sleepQuality"];
//     const shouldRegenerate = fieldsThatAffectTip.some(
//       (key) => updates[key] !== undefined && updates[key] !== existing[key]
//     );

//     // If relevant fields changed → re-analyze & generate AI tip
//     if (shouldRegenerate) {
//       const newData = {
//         sleepStart: updates.sleepStart || existing.sleepStart,
//         sleepEnd: updates.sleepEnd || existing.sleepEnd,
//         sleepQuality: updates.sleepQuality || existing.sleepQuality,
//       };

//       const analysis = analyzeSleepPattern(
//         newData.sleepStart,
//         newData.sleepEnd,
//         newData.sleepQuality
//       );

//       // Use your local AI helper
//       const aiResponse = getSmartTip({
//         sleepStart: newData.sleepStart,
//         sleepEnd: newData.sleepEnd,
//         sleepQuality: newData.sleepQuality,
//       });

//       updates.aiTip = aiResponse.tip;
//     }

//     // Apply updates
//     const updated = await SleepRecord.findOneAndUpdate(
//       { _id: recordId, userId },
//       updates,
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Sleep record updated successfully",
//       data: updated,
//     });
//   } catch (err) {
//     console.error("Error in updateSleepRecord:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
/**
 * 🗑 DELETE: Remove a self-care record
 */
const deleteSelfCare = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SelfCare.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Activity not found" });

    res.status(200).json({
      success: true,
      message: "Self-care activity deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting self-care activity:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addSelfCare,
  fetchSelfCareActivities,
  updateSelfCare,
  deleteSelfCare,
  fetchAllSelfCareActivities,
};
// const {
//   logSelfCareActivity,
//   getAllSelfCareActivities,
//   // updateSelfCareActivity,
//   // deleteSelfCareActivity,
// } = require("../services/selfCare.service.js");
// const { selfCareValidator } = require("../validators/selfCare.validator.js");
// const SelfCare = require("../models/selfCare.model.js");

// /**
//  * ✅ CREATE: Add a new self-care activity
//  */
// const addSelfCare = async (req, res) => {
//   try {
//     const { error, value } = selfCareValidator.validate(req.body);
//     if (error)
//       return res.status(400).json({ success: false, message: error.details[0].message });

//     const result = await logSelfCareActivity(value);
//     res.status(201).json({
//       success: true,
//       message: "Self-care activity logged successfully",
//       data: result,
//     });
//   } catch (err) {
//     console.error("Error adding self-care activity:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * 📖 READ: Fetch all self-care activities for a user
//  */
// const fetchSelfCareActivities = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const data = await getAllSelfCareActivities(userId);
//     res.status(200).json({ success: true, data });
//   } catch (err) {
//     console.error("Error fetching self-care activities:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * ✏ UPDATE: Modify an existing self-care record
//  */
// const updateSelfCare = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const updated = await SelfCare.findByIdAndUpdate(id, updates, { new: true });
//     if (!updated)
//       return res.status(404).json({ success: false, message: "Activity not found" });

//     res.status(200).json({
//       success: true,
//       message: "Self-care activity updated successfully",
//       data: updated,
//     });
//   } catch (err) {
//     console.error("Error updating self-care activity:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * 🗑 DELETE: Remove a self-care record
//  */
// const deleteSelfCare = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await SelfCare.findByIdAndDelete(id);
//     if (!deleted)
//       return res.status(404).json({ success: false, message: "Activity not found" });

//     res.status(200).json({
//       success: true,
//       message: "Self-care activity deleted successfully",
//     });
//   } catch (err) {
//     console.error("Error deleting self-care activity:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   addSelfCare,
//   fetchSelfCareActivities,
//   updateSelfCare,
//   deleteSelfCare,
// };
// const { logSelfCareActivity, getAllSelfCareActivities } = require("../services/selfCare.service.js");
// const { selfCareValidator } =require("../validators/selfCare.validator.js");

// const addSelfCare = async (req, res) => {
//   try {
//     const { error, value } = selfCareValidator.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const result = await logSelfCareActivity(value);
//     res.status(201).json({ message: "Self-care activity logged successfully", result });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const fetchSelfCareActivities = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const data = await getAllSelfCareActivities(userId);
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { addSelfCare, fetchSelfCareActivities };



// const { logSelfCareActivity, getSelfCareSummary } = require("../services/selfCare.service");

// const addSelfCareActivity = async (req, res) => {
//   try {
//     const entry = await logSelfCareActivity(req.userData.id, req.body);
//     res.status(201).json({ success: true, data: entry });
//   } catch (err) {
//     console.error("addSelfCareActivity:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const getSelfCareOverview = async (req, res) => {
//   try {
//     const summary = await getSelfCareSummary(req.userData.id);
//     res.json({ success: true, data: summary });
//   } catch (err) {
//     console.error("getSelfCareOverview:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { addSelfCareActivity, getSelfCareOverview };

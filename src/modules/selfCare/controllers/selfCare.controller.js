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

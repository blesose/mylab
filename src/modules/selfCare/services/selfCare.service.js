const SelfCare = require("../models/selfCare.model.js");
const { analyzeSelfCare } = require("./selfCare.analysis.js");
const { getSmartSelfCareTip } = require("../ai/ai.helper.js");

// Logs a self-care activity and attaches AI-generated feedback.
const logSelfCareActivity = async (data) => {
  const { userId, activityType, duration, moodBefore, moodAfter, notes } = data;

  // Analyze mood & duration
  const analysis = analyzeSelfCare(duration, moodBefore, moodAfter);

  // Generate AI recommendation
  const aiData = getSmartSelfCareTip({
    activityType,
    duration,
    moodBefore,
    moodAfter,
  });

  // Save to DB
  const activity = new SelfCare({
    userId,
    activityType,
    duration,
    moodBefore,
    moodAfter,
    notes,
    aiTip: aiData.tip,
  });

  await activity.save();

  return {
    activity,
    analysis,
    aiInsight: {
      summary: aiData.summary,
      tip: aiData.tip,
      score: aiData.score,
      improved: aiData.improved,
    },
  };
};

// Fetch all self-care activities for a given user
const getAllSelfCareActivities = async (userId) => {
  try {
    const activity = await SelfCare.find({ userId }).sort({ date: -1 });
    return { success: true, activity };
  } catch (error) {
    console.error("Error fetching selfcare activities:", error);
    throw new Error("Failed to fetch selfcare activities");
  }
};
  
module.exports = { logSelfCareActivity, getAllSelfCareActivities };

const SelfCare = require("../models/selfCare.model.js");
const { analyzeSelfCare } = require("./selfCare.analysis.js");
const { getSmartSelfCareTip } = require("../ai/ai.helper.js");

const logSelfCareActivity = async (data) => {
  const { userId, activityType, duration, moodBefore, moodAfter, notes } = data;

  const analysis = analyzeSelfCare(duration, moodBefore, moodAfter);

  const aiData = getSmartSelfCareTip({
    activityType,
    duration,
    moodBefore,
    moodAfter,
  });

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


const getAllSelfCareActivities = async (userId) => {
  try {
    const activities = await SelfCare.find({ userId }).sort({ createdAt: -1 });
    return activities; 
  } catch (error) {
    console.error("Error fetching selfcare activities:", error);
    throw new Error("Failed to fetch selfcare activities");
  }
};
  
module.exports = { logSelfCareActivity, getAllSelfCareActivities };

const SelfCare = require("../models/selfCare.model.js");
const { analyzeSelfCare } = require("./selfCare.analysis.js");
const { getSmartSelfCareTip } = require("../ai/ai.helper.js");

/**
 * Logs a self-care activity and attaches AI-generated feedback.
 */
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

/**
 * Fetch all self-care activities for a given user.
 */
// const getAllSelfCareActivities = async (userId) => {
//   return await SelfCare.find({ userId }).sort({ createdAt: -1 });
// };
const getAllSelfCareActivities = async (userId) => {
  try {
    const activity = await SelfCare.find({ userId }).sort({ date: -1 });
    return { success: true, activity };
  } catch (error) {
    console.error("Error fetching selfcare activities:", error);
    throw new Error("Failed to fetch selfcare activities");
  }
};
  // return await SelfCare.find({ userId }).sort({ createdAt: -1 });
// };
// try {
//     const records = await SleepRecord.find({ userId }).sort({ date: -1 });
//     return { success: true, records };
//   } catch (error) {
//     console.error("Error fetching sleep history:", error);
//     throw new Error("Failed to fetch sleep history");
//   }
// };
module.exports = { logSelfCareActivity, getAllSelfCareActivities };
// const SelfCare = require("../models/selfCare.model.js");
// // import { getSmartTip } from "../../../core/ai/localAI.js"; // Integrated local AI
// const { analyzeSelfCare } = require("./selfCare.analysis.js");

// const logSelfCareActivity = async (data) => {
//   const { userId, activityType, duration, moodBefore, moodAfter, notes } = data;

//   const analysis = analyzeSelfCare(duration, moodBefore, moodAfter);
//   const aiTip = await getSmartTip(`Give a helpful self-care recommendation for ${activityType}`);

//   const activity = new SelfCare({ userId, activityType, duration, moodBefore, moodAfter, notes, aiTip });
//   await activity.save();

//   return { activity, analysis };
// };

// const getAllSelfCareActivities = async (userId) => {
//   return await SelfCare.find({ userId }).sort({ createdAt: -1 });
// };

// module.exports = { logSelfCareActivity, getAllSelfCareActivities };

// const SelfCare = require("../models/selfCare.model");
// const { analyzeSelfCareTrends } = require("./selfCare.analysis");
// const { calculateWellnessScore } = require("../utils/selfCare.utils");
// const { generateSmartHealthTip } = require("../../../ai/ai.helper");

// async function logSelfCareActivity(userId, data) {
//   const entry = await SelfCare.create({ userId, ...data });
//   return entry;
// }

// async function getSelfCareSummary(userId) {
//   const activities = await SelfCare.find({ userId }).sort({ createdAt: -1 }).limit(30);
//   const analysis = analyzeSelfCareTrends(activities);
//   const wellnessScore = calculateWellnessScore(activities);

//   const aiTip = await generateSmartHealthTip({
//     category: "Self-Care",
//     userData: { name: "User", gender: "unspecified" },
//     context: `User completed ${analysis.totalActivities} self-care activities this month.`
//   });

//   return { analysis, wellnessScore, aiTip };
// }

// module.exports = { logSelfCareActivity, getSelfCareSummary };

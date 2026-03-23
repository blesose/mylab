const User = require("../../models/user.model");
const Activity = require("../activity/models/activity.model");

async function getUserHealthData(userId) {
  const user = await User.findById(userId);
  const lastActivity = await Activity.findOne({ userId }).sort({ createdAt: -1 });

  return {
    userId,
    name: user.name,
    stressLevel: user.stressLevel || "moderate",
    sleepHours: user.sleepHours || 7,
    exerciseFrequency: lastActivity?.frequency || "irregular",
    mood: user.mood || "neutral",
    focusArea: "mental",
  };
}

module.exports = { getUserHealthData };

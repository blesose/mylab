const User = require("../../user/models/user.model");
const Post = require("../../community/models/post.model");
const Insight = require("../../labInsights/models/insight.model");
const { broadcastQueue } = require("../../../jobs/adminBroadcast.job");

exports.listUsers = async () => {
  const users = await User.find().select("name email role status createdAt");
  return { success: true, count: users.length, users };
};

exports.listPosts = async () => {
  const posts = await Post.find().populate("userId", "name");
  return { success: true, count: posts.length, posts };
};

exports.aggregateInsights = async () => {
  const insights = await Insight.find().sort({ createdAt: -1 }).limit(20);
  const summary = {
    totalReports: insights.length,
    recent: insights[0] || {},
  };
  return { success: true, summary };
};

exports.queueBroadcast = async (title, message) => {
  await broadcastQueue.add("broadcast", { title, message });
  return true;
};

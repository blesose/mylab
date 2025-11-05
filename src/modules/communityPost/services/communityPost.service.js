const CommunityPost = require("../models/communityPost.model");
const { generateCommunityInsight, generateReactionInsight } = require("../ai/ai.helper");
const { analyzeEngagement } = require("./communityPost.analysis");

/**
 * Create a new post
 */
const createPost = async (userId, data) => {
  const aiInsight = await generateCommunityInsight(data.content);
  const post = await CommunityPost.create({ ...data, userId, aiInsight });
  return post;
};

/**
 * Get all posts (latest first)
 */
const getAllPosts = async () => {
  const posts = await CommunityPost.find().sort({ createdAt: -1 });
  return posts;
};

/**
 * Like a post
 */
const likePost = async (postId) => {
  const post = await CommunityPost.findByIdAndUpdate(
    postId,
    { $inc: { likes: 1 } },
    { new: true }
  );
  if (!post) throw new Error("Post not found");
  return post;
};

/**
 * Comment on a post
 */
const commentOnPost = async (postId, userId, text) => {
  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error("Post not found");

  post.comments.push({ userId, text });
  await post.save();
  return post;
};

/**
 * Analyze all posts engagement
 */
const analyzePostEngagement = async () => {
  const posts = await CommunityPost.find();
  return analyzeEngagement(posts);
};

module.exports = { createPost, getAllPosts, likePost, commentOnPost, analyzePostEngagement };

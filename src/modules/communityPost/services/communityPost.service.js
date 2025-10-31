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
// const CommunityPost = require("../models/communityPost.model");
// const { generateCommunityInsight } = require("../ai/communityPost.ai.helper");

// const createPost = async (userId, data) => {
//   const aiInsight = await generateCommunityInsight(data.content);
//   const post = await CommunityPost.create({ ...data, userId, aiInsight });
//   return post;
// };

// const getAllPosts = async () => {
//   return await CommunityPost.find().sort({ createdAt: -1 });
// };

// const likePost = async (postId) => {
//   const updated = await CommunityPost.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
//   if (!updated) throw new Error("Post not found");
//   return updated;
// };

// const commentOnPost = async (postId, userId, text) => {
//   const post = await CommunityPost.findById(postId);
//   if (!post) throw new Error("Post not found");
//   post.comments.push({ userId, text });
//   await post.save();
//   return post;
// };

// module.exports = { createPost, getAllPosts, likePost, commentOnPost };
// const CommunityPost = require("../models/communityPost.model");
// const { analyzeEngagement } = require("./communityPost.analysis");
// const { generateCommunityInsight } = require("../ai/communityPost.ai");
// const commentOnPost = async (postId, userId, text) => {
//   const post = await CommunityPost.findById(postId);
//   if (!post) throw new Error("Post not found");
//   post.comments.push({ userId, text });
//   await post.save();
//   return post;
// };

// const createPost = async (userId, data) => {
//   const aiInsight = await generateCommunityInsight(data.content);
//   const post = await CommunityPost.create({ ...data, userId, aiInsight });
//   return post;
// };

// const getAllPosts = async () => {
//   const posts = await CommunityPost.find().sort({ createdAt: -1 });
//   return posts;
// };

// const likePost = async (postId) => {
//   return await CommunityPost.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
// };

// const analyzePostEngagement = async () => {
//   const posts = await CommunityPost.find();
//   return analyzeEngagement(posts);
// };

// module.exports = { createPost, commentOnPost, likePost, getAllPosts, analyzePostEngagement }
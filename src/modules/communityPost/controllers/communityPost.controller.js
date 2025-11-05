const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  analyzePostEngagement,
} = require("../services/communityPost.service");
const { generateReactionInsight } = require("../ai/ai.helper");
const CommunityPost = require("../models/communityPost.model");
/**
 * Create a post
 */
const createCommunityPost = async (req, res) => {
  try {
    const post = await createPost(req.userId, req.body);
    res.status(201).json({ success: true, message: "Post created successfully", data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all posts
 */
const getCommunityPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getACommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const posts = await CommunityPost.findOne({ _id: postId, userId });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Like a post
 */
const likeCommunityPost = async (req, res) => {
  try {
    const post = await likePost(req.params.id);
    const reactionTip = generateReactionInsight(post.likes, post.comments.length);
    res.status(200).json({ success: true, message: "Post liked", data: post, reactionTip });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Comment on a post
 */
const commentCommunityPost = async (req, res) => {
  try {
    const post = await commentOnPost(req.params.id, req.userId, req.body.text);
    const reactionTip = generateReactionInsight(post.likes, post.comments.length);
    res.status(200).json({ success: true, message: "Comment added", data: post, reactionTip });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Analyze posts engagement
 */
const getPostsAnalysis = async (req, res) => {
  try {
    const analysis = await analyzePostEngagement();
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCommunityPost,
  getCommunityPosts,
  getACommunityPost,
  likeCommunityPost,
  commentCommunityPost,
  getPostsAnalysis,
};

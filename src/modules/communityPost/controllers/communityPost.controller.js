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
// const { createPost, getAllPosts, likePost, commentOnPost } = require("../services/communityPost.service");
// const { generateReactionInsight } = require("../ai/communityPost.ai.helper");

// const createCommunityPost = async (req, res) => {
//   try {
//     const post = await createPost(req.userId, req.body);
//     res.status(201).json({ success: true, message: "Post created successfully", data: post });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const fetchAllPosts = async (req, res) => {
//   try {
//     const posts = await getAllPosts();
//     res.status(200).json({ success: true, data: posts });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const likeCommunityPost = async (req, res) => {
//   try {
//     const post = await likePost(req.params.id);
//     const tip = generateReactionInsight(post.likes, post.comments.length);
//     res.status(200).json({ success: true, data: post, aiTip: tip });
//   } catch (err) {
//     res.status(404).json({ success: false, message: err.message });
//   }
// };

// const commentCommunityPost = async (req, res) => {
//   try {
//     const post = await commentOnPost(req.params.id, req.userId, req.body.text);
//     const tip = generateReactionInsight(post.likes, post.comments.length);
//     res.status(200).json({ success: true, data: post, aiTip: tip });
//   } catch (err) {
//     res.status(404).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   createCommunityPost,
//   fetchAllPosts,
//   likeCommunityPost,
//   commentCommunityPost,
// };
// const {
//   createPost,
//   getAllPosts,
//   likePost,
//   commentOnPost,
// } = require("../services/communityPost.service");
// const { createCommunityNotification } = require("../services/communityNotification.service");

// const likePost = async (req, res) => {
//   try {
//     const updated = await likePost(req.params.id);
//     if (updated && updated.userId.toString() !== req.userData.id) {
//       await createCommunityNotification(
//         updated.userId,
//         "Someone liked your post ❤️",
//         `Your post "${updated.title}" just received a new like!`
//       );
//     }
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to like post" });
//   }
// };

// const commentOnPost = async (req, res) => {
//   try {
//     const updated = await commentOnPost(req.params.id, req.userData.id, req.body.text);
//     if (updated && updated.userId.toString() !== req.userData.id) {
//       await createCommunityNotification(
//         updated.userId,
//         "New comment on your post 💬",
//         `Someone commented: "${req.body.text}" on your post "${updated.title}"`
//       );
//     }
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to add comment" });
//   }
// };
//  module.exports = { likePost, commentOnPost };


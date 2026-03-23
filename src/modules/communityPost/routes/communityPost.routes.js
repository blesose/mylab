
const express = require("express");
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { 
  createCommunityPost, 
  getCommunityPosts, 
  likeCommunityPost, 
  commentCommunityPost, 
  getACommunityPost, 
  getPostsAnalysis,
  deleteCommentFromPost,
  deletePostFromCommunity,
  fixInvalidPosts
} = require("../controllers/communityPost.controller");
const { createPostValidator, commentValidator, validatePostId } = require("../validators/communityPost.validator");

const commmunitypostRouter = express.Router();

// Create a new post
commmunitypostRouter.post("/create-post", authMiddleware, createPostValidator, createCommunityPost);

// Get all posts (visible to all authenticated users)
commmunitypostRouter.get("/get-post", authMiddleware, getCommunityPosts);

// Get a single post by ID
commmunitypostRouter.get("/geta-post/:postId", authMiddleware, validatePostId, getACommunityPost);

// Get analytics/analysis of posts
commmunitypostRouter.get("/analysis-post", authMiddleware, getPostsAnalysis);

// Like a post
commmunitypostRouter.post("/like-post/:id/like", authMiddleware, validatePostId, likeCommunityPost);

// Comment on a post
commmunitypostRouter.post("/comment-post/:id/comment", authMiddleware, validatePostId, commentValidator, commentCommunityPost);

// Delete a comment
commmunitypostRouter.delete("/delete-comment/:postId/:commentId", authMiddleware, deleteCommentFromPost);

// Delete a post
commmunitypostRouter.delete("/delete-post/:postId", authMiddleware, validatePostId, deletePostFromCommunity);

// TEMPORARY: Fix invalid posts (remove after use)
commmunitypostRouter.post("/fix-invalid", authMiddleware, fixInvalidPosts);

module.exports = { commmunitypostRouter };
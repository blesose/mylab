const express = require("express");
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { createCommunityPost, getCommunityPosts, likeCommunityPost, commentCommunityPost, getACommunityPost, getPostsAnalysis } = require("../controllers/communityPost.controller");
const commmunitypostRouter = express.Router();

const { createPostValidator } = require("../validators/communityPost.validator")
commmunitypostRouter.post("/create-post", authMiddleware, createPostValidator, createCommunityPost);
commmunitypostRouter.get("/get-post", authMiddleware, getCommunityPosts);
commmunitypostRouter.get("/geta-post/:postId", authMiddleware, getACommunityPost);
commmunitypostRouter.get("/analysis-post", authMiddleware, getPostsAnalysis);
commmunitypostRouter.post("/like-post/:id/like", authMiddleware, likeCommunityPost);
commmunitypostRouter.post("/comment-post/:id/comment", authMiddleware, commentCommunityPost);

module.exports = { commmunitypostRouter };

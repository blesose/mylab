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

/**
 * @swagger
 * /api/communitypost/community/create-post:
 *   post:
 *     summary: Create a community post
 *     description: Share your health journey, ask questions, or support others
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCommunityPostRequest"
 *           example:
 *             title: "My Journey with Mental Health"
 *             content: "I wanted to share my experience with anxiety and how I learned to manage it through mindfulness and therapy..."
 *             tags: ["anxiety", "mental health", "mindfulness"]
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/CommunityPost"
 *             example:
 *               success: true
 *               message: "Post created successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439031"
 *                 content: "I wanted to share my experience with anxiety..."
 *                 title: "My Journey with Mental Health"
 *                 tags: ["anxiety", "mental health", "mindfulness"]
 *                 aiInsight: "Long-form post with detailed insight"
 *                 createdAt: "2026-07-26T14:30:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Content is required"
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.post("/create-post", authMiddleware, createPostValidator, createCommunityPost);

/**
 * @swagger
 * /api/communitypost/community/get-post:
 *   get:
 *     summary: Get all community posts
 *     description: Retrieve all community posts with user engagement data
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/CommunityPost"
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439031"
 *                   content: "I wanted to share my experience with anxiety..."
 *                   title: "My Journey with Mental Health"
 *                   userId:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     name: "Jane Doe"
 *                     email: "jane@example.com"
 *                   likesCount: 5
 *                   hasLiked: true
 *                   commentsCount: 3
 *                   createdAt: "2026-07-26T14:30:00Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
commmunitypostRouter.get("/get-post", authMiddleware, getCommunityPosts);

/**
 * @swagger
 * /api/communitypost/community/geta-post/{postId}:
 *   get:
 *     summary: Get a single community post
 *     description: Retrieve a specific post by its ID with all details
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Post ID
 *         example: "507f1f77bcf86cd799439031"
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/CommunityPost"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Post not found"
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.get("/geta-post/:postId", authMiddleware, validatePostId, getACommunityPost);

/**
 * @swagger
 * /api/communitypost/community/analysis-post:
 *   get:
 *     summary: Get post engagement analytics
 *     description: Analyze all community posts for engagement metrics
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analysis retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostAnalysis"
 *             example:
 *               success: true
 *               data:
 *                 totalPosts: 15
 *                 totalLikes: 78
 *                 totalComments: 45
 *                 avgLikes: "5.20"
 *                 avgComments: "3.00"
 *                 trend: "High engagement"
 *                 mostEngagedPostId: "507f1f77bcf86cd799439031"
 *                 mostEngagedPostEngagement: 12
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.get("/analysis-post", authMiddleware, getPostsAnalysis);

/**
 * @swagger
 * /api/communitypost/community/like-post/{id}/like:
 *   post:
 *     summary: Like or unlike a post
 *     description: Toggle like on a community post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Post ID
 *         example: "507f1f77bcf86cd799439031"
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 action:
 *                   type: string
 *                   enum: [liked, unliked]
 *                 data:
 *                   $ref: "#/components/schemas/CommunityPost"
 *                 reactionTip:
 *                   type: string
 *             examples:
 *               liked:
 *                 value:
 *                   success: true
 *                   message: "Post liked successfully"
 *                   action: "liked"
 *                   data:
 *                     _id: "507f1f77bcf86cd799439031"
 *                     likesCount: 6
 *                     hasLiked: true
 *                   reactionTip: "Keep engaging with your community"
 *               unliked:
 *                 value:
 *                   success: true
 *                   message: "Post unliked successfully"
 *                   action: "unliked"
 *                   data:
 *                     _id: "507f1f77bcf86cd799439031"
 *                     likesCount: 5
 *                     hasLiked: false
 *                   reactionTip: "You can always like this post again"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Post not found"
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.post("/like-post/:id/like", authMiddleware, validatePostId, likeCommunityPost);

/**
 * @swagger
 * /api/communitypost/community/comment-post/{id}/comment:
 *   post:
 *     summary: Comment on a post
 *     description: Add a comment to a community post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Post ID
 *         example: "507f1f77bcf86cd799439031"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CommentRequest"
 *           example:
 *             text: "This really resonates with me. Thank you for sharing!"
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/CommunityPost"
 *                 reactionTip:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Comment added"
 *               data:
 *                 _id: "507f1f77bcf86cd799439031"
 *                 commentsCount: 3
 *                 hasLiked: false
 *               reactionTip: "High discussion on this post"
 *       400:
 *         description: Comment text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Comment text is required"
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.post("/comment-post/:id/comment", authMiddleware, validatePostId, commentValidator, commentCommunityPost);

/**
 * @swagger
 * /api/communitypost/community/delete-comment/{postId}/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment from a post (comment owner, post owner, or admin only)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Post ID
 *         example: "507f1f77bcf86cd799439031"
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439041"
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/CommunityPost"
 *       403:
 *         description: Permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "You don't have permission to delete this comment"
 *       404:
 *         description: Post or comment not found
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.delete("/delete-comment/:postId/:commentId", authMiddleware, deleteCommentFromPost);

/**
 * @swagger
 * /api/communitypost/community/delete-post/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a community post (post owner or admin only)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Post ID
 *         example: "507f1f77bcf86cd799439031"
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     postId:
 *                       type: string
 *       403:
 *         description: Permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "You don't have permission to delete this post"
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
commmunitypostRouter.delete("/delete-post/:postId", authMiddleware, validatePostId, deletePostFromCommunity);

/**
 * @swagger
 * /api/communitypost/community/fix-invalid:
 *   post:
 *     summary: Fix invalid posts
 *     description: Temporary endpoint to fix invalid post data (Admin only)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts fixed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 fixedCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
commmunitypostRouter.post("/fix-invalid", authMiddleware, fixInvalidPosts);

module.exports = { commmunitypostRouter };
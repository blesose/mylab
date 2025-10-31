const express = require("express");
const postRouter = express.Router();
const validateUser = require("../middleware/auth.middleware");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  reactToPost,
} = require("../controllers/post.controller");

// CREATE a post
postRouter.post("/", validateUser, createPost);

// GET all posts
postRouter.get("/", validateUser, getPosts);

// GET single post by ID
postRouter.get("/:id", validateUser, getPostById);

// UPDATE post (owner only)
postRouter.put("/:id", validateUser, updatePost);

// DELETE post (owner only)
postRouter.delete("/:id", validateUser, deletePost);

// ADD comment to a post
postRouter.post("/:id/comments", validateUser, addComment);

// REACT to a post (like/love)
postRouter.post("/:id/reactions", validateUser, reactToPost);

module.exports = postRouter;

// const express = require("express");
// const router = express.Router();
// const validateUser = require("../middlewares/auth.middleware");
// const {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
//   addComment,
//   reactToPost,
// } = require("../controllers/post.controller");

// // Protect all routes
// router.use(validateUser);

// router.post("/", createPost);
// router.get("/", getPosts);
// router.get("/:id", getPostById);
// router.put("/:id", updatePost);
// router.delete("/:id", deletePost);
// router.post("/:id/comment", addComment);
// router.post("/:id/react", reactToPost);

// module.exports = router;

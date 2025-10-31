const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const ctrl = require("../controllers/post.controller");

router.post("/", validateUser, ctrl.createPost);
router.get("/", validateUser, ctrl.getPosts);
router.get("/:id", validateUser, ctrl.getPostById);
router.put("/:id", validateUser, ctrl.updatePost);
router.delete("/:id", validateUser, ctrl.deletePost);
router.post("/:id/comments", validateUser, ctrl.addComment);
router.post("/:id/reactions", validateUser, ctrl.reactToPost);

module.exports = router;

// const router = require("express").Router();
// const AdminCtrl = require("../controllers/admin.controller");
// const { verifyAdmin } = require("../middlewares/adminAuth");

// router.get("/users", verifyAdmin, AdminCtrl.getAllUsers);
// router.get("/posts", verifyAdmin, AdminCtrl.getAllPosts);
// router.get("/insights", verifyAdmin, AdminCtrl.getInsightsSummary);
// router.post("/broadcast", verifyAdmin, AdminCtrl.sendBroadcast);

// module.exports = router;
// src/routes/admin.routes.js
const express = require("express");
const { adminLogin } = require("../controllers/admin.controller");

const router = express.Router();

router.post("/login", adminLogin);

module.exports = router;


// src/modules/mentalHealth/routes/mentalHealth.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/mentalHealth.controller");
const validate = require("../../../middleware/validate"); // your validate wrapper
const { logEntrySchema } = require("../validators/mentalHealth.validator");
const auth = require("../../../middleware/auth.middleware");

// POST log mood (authenticated)
router.post("/log", auth, controller.logMood);

// GET history (authenticated)
router.get("/history", auth, controller.getHistory);

// GET summary/dashboard (authenticated)
router.get("/summary", auth, controller.getSummary);

module.exports = router;
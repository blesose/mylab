const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const { startPregnancyTracker, getPregnancyStatus } = require("../controllers/pregnancy.controller");

router.post("/start", validateUser, startPregnancyTracker);
router.get("/status", validateUser, getPregnancyStatus);

module.exports = router;

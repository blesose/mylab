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

// const express = require("express");
// const {
//   createEntry,
//   getAllEntries,
//   getSingleEntry,
//   updateEntry,
//   deleteEntry,
//   getUserMentalHealth,
//   getWeeklySummary,
// } = require("../controllers/mentalHealth.controller");

// const router = express.Router();

// // CRUD routes
// router.post("/entry", createEntry);
// router.get("/entries/:userId", getAllEntries);
// router.get("/entry/:entryId", getSingleEntry);
// router.put("/entry/:entryId", updateEntry);
// router.delete("/entry/:entryId", deleteEntry);

// // Analysis & Summary
// router.get("/report/:userId", getUserMentalHealth);
// router.get("/summary", getWeeklySummary);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/mentalHealth.controller");
// const { validate } = require("../../../middleware/validate");
// const { createMentalHealthEntryValidator } = require("../validators/mentalHealth.validator");

// router.post("/entries", validate(createMentalHealthEntryValidator), controller.createEntry);

// module.exports = router;



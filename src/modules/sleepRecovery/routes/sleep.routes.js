const express = require("express");
const sleepRouter = express.Router();
const {
  addSleepRecord,
  fetchSleepHistory,
  fetchSleepRecordById,
  updateSleepRecord,
  deleteSleepRecord,
} = require("../controllers/sleep.controller");
const { authMiddleware } = require("../../../middleware/auth.middleware");

sleepRouter.post("/add-sleep", authMiddleware, addSleepRecord);
sleepRouter.get("/fetch-sleep", authMiddleware, fetchSleepHistory);
sleepRouter.get("/fetch-onesleep/:recordId", authMiddleware, fetchSleepRecordById);
sleepRouter.put("/update-sleep/:recordId", authMiddleware, updateSleepRecord);
sleepRouter.delete("/delete-sleep/:recordId", authMiddleware, deleteSleepRecord);

module.exports = { sleepRouter };
// const express = require("express");
// const sleepRouter = express.Router();
// const {
//   addSleepRecord,
//   fetchSleepHistory,
//   fetchSleepRecordById,
//   updateSleepRecord,
//   deleteSleepRecord,
// } = require("../controllers/sleep.controller");
// const { authMiddleware } = require("../../../middleware/auth.middleware");

// // All routes require authentication
// sleepRouter.post("/", authMiddleware, addSleepRecord);            // Create
// sleepRouter.get("/", authMiddleware, fetchSleepHistory);          // Read all
// sleepRouter.get("/:recordId", authMiddleware, fetchSleepRecordById); // Read one
// sleepRouter.put("/:recordId", authMiddleware, updateSleepRecord); // Update
// sleepRouter.delete("/:recordId", authMiddleware, deleteSleepRecord); // Delete

// module.exports = { sleepRouter };
// // src/modules/sleep/routes/sleep.route.js
// const express = require("express");
// const { addSleepRecord, fetchSleepHistory } = require("../controllers/sleep.controller");
// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { sleepValidator } = require("../validators/sleep.validator");

// const sleepRouter = express.Router();

// // POST /api/sleep/add-sleep  (protected)
// sleepRouter.post("/add-sleep", authMiddleware, sleepValidator, addSleepRecord);

// // GET /api/sleep/fetch-sleep/:userId  (protected)
// sleepRouter.get("/fetch-sleep/:userId", authMiddleware, fetchSleepHistory);

// module.exports = { sleepRouter };  // export the router directly

// const express = require("express");
// const{ addSleepRecord, fetchSleepHistory } = require("../controllers/sleep.controller.js");
// const { authMiddleware } = require("../../../middleware/auth.middleware.js");


// const sleepRouter = express.Router();

// sleepRouter.post("/add-sleep",  authMiddleware, addSleepRecord);
// sleepRouter.get("fetch-sleep/:userId", authMiddleware, fetchSleepHistory);

// module.exports = { sleepRouter };
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

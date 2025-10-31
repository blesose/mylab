const express = require("express");
const {
  createRecordHandler,
  getRecordHandler,
  updateRecordHandler,
  deleteRecordHandler,
  listRecordsHandler,
} = require("../controllers/menHealth.controller");
const { createRecordValidator } = require("../validators/menHealth.validator");
const { authMiddleware } = require("../../../middleware/auth.middleware");

const menhealthRouter = express.Router();

// 🩺 Create new health record (Protected)
menhealthRouter.post(
  "/create-record",
  authMiddleware,
  createRecordValidator,
  createRecordHandler
);

// 📋 List all records for the logged-in user (Protected)
menhealthRouter.get("/list-records", authMiddleware, listRecordsHandler);

// 🔍 Get a single record by ID (Protected)
menhealthRouter.get("/get-record/:recordId", authMiddleware, getRecordHandler);

// ✏️ Update a record by ID (Protected)
menhealthRouter.put(
  "/update-record/:recordId",
  authMiddleware,
  createRecordValidator,
  updateRecordHandler
);

// ❌ Delete a record by ID (Protected)
menhealthRouter.delete("/delete-record/:recordId", authMiddleware, deleteRecordHandler);

module.exports = menhealthRouter;

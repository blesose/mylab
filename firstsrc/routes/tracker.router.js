
const express = require("express");
const EntrytrackerRouter = express.Router();
const validateUser = require("../middleware/auth.middleware");
const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../controllers/trackerEntry.controller");

// CREATE tracker entry
EntrytrackerRouter.post("/", validateUser, createEntry);

// GET all entries
EntrytrackerRouter.get("/", validateUser, getEntries);

// GET single entry
EntrytrackerRouter.get("/:id", validateUser, getEntryById);

// UPDATE entry
EntrytrackerRouter.put("/:id", validateUser, updateEntry);

// DELETE entry
EntrytrackerRouter.delete("/:id", validateUser, deleteEntry);

module.exports = EntrytrackerRouter;
// const express = require("express");
// const EntrytrackerRouter = express.Router();
// const validateUser = require("../middleware/auth.middleware");
// const {
//   createEntry,
//   getEntries,
//   getEntryById,
//   updateEntry,
//   deleteEntry,
// } = require("../controllers/trackerEntry.controller");

// // Protect all routes with JWT middleware
// EntrytrackerRouter.use(validateUser);

// EntrytrackerRouter.post("/create", createEntry);
// EntrytrackerRouter.get("/get", getEntries);
// EntrytrackerRouter.get("/getEnrty/:id", getEntryById);
// EntrytrackerRouter.put("/:id", updateEntry);
// EntrytrackerRouter.delete("/:id", deleteEntry);

// module.exports = EntrytrackerRouter;

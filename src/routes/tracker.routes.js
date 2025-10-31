const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const controller = require("../controllers/tracker.controller");

router.post("/", validateUser, controller.createEntry);
router.get("/", validateUser, controller.getEntries);
router.get("/:id", validateUser, controller.getEntryById);
router.put("/:id", validateUser, controller.updateEntry);
router.delete("/:id", validateUser, controller.deleteEntry);

module.exports = router;

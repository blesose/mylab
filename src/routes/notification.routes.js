const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const ctrl = require("../controllers/notification.controller");

router.get("/", validateUser, ctrl.getNotifications);
router.put("/:id/read", validateUser, ctrl.markAsRead);

module.exports = router;

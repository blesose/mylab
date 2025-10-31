const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const { getProfile, updateProfile, deleteUser } = require("../controllers/user.controller");

router.get("/me", validateUser, getProfile);
router.put("/me", validateUser, updateProfile);
router.delete("/me", validateUser, deleteUser);

module.exports = router;

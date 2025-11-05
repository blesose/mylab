// src/modules/users/routes/user.route.js
const express = require("express");
const userRouter = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers,
} = require("../controllers/user.controller");

const { validate } = require("../../../middleware/validate");
const { signupValidator, loginValidator } = require("../validators/user.validator");
const { authMiddleware } = require("../../../middleware/auth.middleware"); // ✅ fixed import if exported as named

// Auth routes
userRouter.post("/register", validate(signupValidator), register);
userRouter.post("/login", validate(loginValidator), login);

// Protected profile routes
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.get("/all-profile", authMiddleware, getAllUsers);
userRouter.put("/update-profile", authMiddleware, updateProfile);
userRouter.delete("/delete-profile", authMiddleware, deleteUser);

module.exports = userRouter;

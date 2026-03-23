const express = require("express");
const { authMiddleware } = require("../../../middleware/auth.middleware");
const {
  searchFoodsController,
  getFoodByIdController,
  getFoodsByCategoryController,
  createCustomFoodController,
  getUserCustomFoodsController,
  calculatePortionController,
} = require("../controllers/food.controller");

const foodRouter = express.Router();

// Search foods
foodRouter.get("/search", authMiddleware, searchFoodsController);

// Get foods by category
foodRouter.get("/category/:category", authMiddleware, getFoodsByCategoryController);

// Get food by ID
foodRouter.get("/:id", authMiddleware, getFoodByIdController);

// Get user's custom foods
foodRouter.get("/custom/my-foods", authMiddleware, getUserCustomFoodsController);

// Create custom food
foodRouter.post("/custom", authMiddleware, createCustomFoodController);

// Calculate portion nutrition
foodRouter.post("/calculate-portion", authMiddleware, calculatePortionController);

module.exports = { foodRouter };
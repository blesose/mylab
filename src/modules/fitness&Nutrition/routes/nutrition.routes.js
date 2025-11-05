const express = require("express");
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { createNutrition, getAllNutrition,  getANutrition, updateNutrition, deleteNutrition,  } = require("../controllers/nutrition.controller");
;
const nutritionRouter = express.Router();

nutritionRouter.post("/create-nutrition", authMiddleware, createNutrition);
nutritionRouter.get("/getall-nutrition", authMiddleware, getAllNutrition);
nutritionRouter.get("/get-nutrition/:activityId", authMiddleware, getANutrition);
nutritionRouter.put("/update-nutrition/:id", authMiddleware, updateNutrition);
nutritionRouter.delete("/delete-nutrition/:id", authMiddleware, deleteNutrition);

module.exports = { nutritionRouter };


module.exports = { nutritionRouter };

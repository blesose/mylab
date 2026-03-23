const express = require("express");

const { fitnessRouter } = require("./routes/fitness.routes");
const { nutritionRouter } = require("./routes/nutrition.routes");
const { foodRouter } = require("./routes/food.routes");
const fitnessNutritionRouter = express.Router();

fitnessNutritionRouter.use("/fitness", fitnessRouter);
fitnessNutritionRouter.use("/nutrition", nutritionRouter);
fitnessNutritionRouter.use("/foods", foodRouter);

module.exports = { fitnessNutritionRouter };
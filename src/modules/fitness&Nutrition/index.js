const express = require("express");
const { fitnessRouter } = require("./routes/fitness.routes");
const { nutritionRouter } = require("./routes/nutrition.routes");
const fitnessNutritionRouter = express.Router();

fitnessNutritionRouter.use("/fitness", fitnessRouter);
fitnessNutritionRouter.use("/nutrition", nutritionRouter);

module.exports = { fitnessNutritionRouter };

const express = require("express");
const fitnessRouter = express.Router();
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { createFitness, getAllFitness, updateFitness, deleteFitness, getFitness } = require("../controllers/fitness.controller");


fitnessRouter.post("/create-fitness", authMiddleware, createFitness);
fitnessRouter.get("/getall-fitness", authMiddleware, getAllFitness);
fitnessRouter.get("/get-fitness/:activityId", authMiddleware, getFitness);
fitnessRouter.put("/update-fitness/:id", authMiddleware, updateFitness);
fitnessRouter.delete("/delete-fitness/:id", authMiddleware, deleteFitness);

module.exports = { fitnessRouter };

// const express = require("express");
// const router = express.Router();
// const { createFitnessPlan, getPlans } = require("../controllers/fitnessNutrition.controller");

// router.post("/create", createFitnessPlan);
// router.get("/plans", getPlans);

// module.exports = router;

// src/modules/femaleHealth/fitnessNutrition/workers/fitnessNutrition.worker.js
const path = require("path");
const { queue } = require("../jobs/dailyMealPlan.job");

// Keep running this file in a separate process in production:
console.log("🚀 FitnessNutrition worker started, listening for daily meal jobs...");
queue.on("completed", (job) => console.log("Job completed:", job.id));
queue.on("failed", (job, err) => console.error("Job failed:", job.id, err.message));

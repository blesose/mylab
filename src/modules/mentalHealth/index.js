// src/modules/mentalHealth/index.js
const router = require("./routes/mentalHealth.routes");
const { scheduleWeeklySummariesForOptedUsers } = require("./schedulers/mentalHealth.scheduler");

module.exports = { router, scheduleWeeklySummariesForOptedUsers };

// const express = require("express");
// const dotenv = require("dotenv");
// dotenv.config();

// const { mentalHealthQueue } = require("./jobs/mentalHealthSummary.job");
// const mentalHealthRoutes = require("./routes/mentalHealth.routes");
// const { startMentalHealthScheduler } = require("./schedulers/mentalHealth.scheduler");
// const { errorHandler } = require("./middlewares/errorHandler");

// const router = express.Router();

// // Routes
// router.use("/mental-health", mentalHealthRoutes);

// // Queue event logging
// mentalHealthQueue.on("completed", (job, result) => {
//   console.log(`✅ Job ${job.id} completed successfully:`, result);
// });
// mentalHealthQueue.on("failed", (job, err) => {
//   console.error(`❌ Job ${job.id} failed:`, err.message);
// });

// // Start scheduler
// startMentalHealthScheduler();

// // Global error handler
// router.use(errorHandler);

// module.exports = router;



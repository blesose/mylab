
const Queue = require("bull");
require("dotenv").config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// ✅ Define the queue only (no processing logic here)
const mensHealthQueue = new Queue("mensHealthAnalysis", REDIS_URL);

// Optional event listeners for debugging (safe to keep)
mensHealthQueue.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});

mensHealthQueue.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

module.exports = { mensHealthQueue };// const Queue = require("bull");
// require("dotenv").config();

// const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// // ✅ Create a Bull queue for men health analysis
// const mensHealthQueue = new Queue("mensHealthAnalysis", REDIS_URL);

// // Optional: process jobs (you can move this into a separate worker later)
// mensHealthQueue.process("analyzeMenRecord", async (job) => {
//   const { userId, recordId } = job.data;
//   console.log(`Analyzing men health record for user ${userId} (record ${recordId})`);
//   // Do analysis here or call your menHealth.analysis.js
// });

// mensHealthQueue.on("failed", (job, err) => {
//   console.error(`❌ Job ${job.id} failed: ${err.message}`);
// });

// mensHealthQueue.on("completed", (job) => {
//   console.log(`✅ Job ${job.id} completed successfully`);
// });

// module.exports = {
//   mensHealthQueue
// };

// const Queue = require("bull");

// const mensHealthQueue = new Queue("mens-health-queue", process.env.REDIS_URL, {
//   limiter: { max: 10, duration: 1000 },
// });

// mensHealthQueue.on("error", (err) => {
//   console.error("Men’s Health Queue Error:", err.message);
// });

// module.exports = { mensHealthQueue };

// // src/utils/queues.js
// const Queue = require("bull");
// const { redisConfig } = require("../../../config/redis.config"); // assumes you have redis connection config

// // --- Existing queues ---
// const notificationQueue = new Queue("notificationQueue", redisConfig);
// const emailQueue = new Queue("emailQueue", redisConfig);

// // --- New: Men's Health queue ---
// const mensHealthQueue = new Queue("mensHealthQueue", redisConfig);

// // Event handlers (for monitoring)
// mensHealthQueue.on("failed", (job, err) => {
//   console.error("❌ Men's Health job failed:", job.id, err.message);
// });
// mensHealthQueue.on("completed", (job) => {
//   console.log("✅ Men's Health job completed:", job.id);
// });

// module.exports = {
//   notificationQueue,
//   emailQueue,
//   mensHealthQueue,
// };

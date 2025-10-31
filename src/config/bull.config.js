const Queue = require("bull");
require("dotenv").config();

// --- Redis configuration ---
const redisConfig = {
  redis: {
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  },
};

// --- 🩺 Centralized Queues ---
const queues = {
  emailQueue: new Queue("emailQueue", redisConfig),
  notificationQueue: new Queue("notificationQueue", redisConfig),
  menHealthQueue: new Queue("menHealthQueue", redisConfig),
  femaleHealthQueue: new Queue("femaleHealthQueue", redisConfig),
  mentalHealthQueue: new Queue("mentalHealthQueue", redisConfig),
  fitnessQueue: new Queue("fitnessQueue", redisConfig),
  selfCareQueue: new Queue("selfCareQueue", redisConfig),
};

// --- Event Listeners for all queues ---
Object.entries(queues).forEach(([name, queue]) => {
  queue.on("completed", (job) => {
    console.log(`✅ [${name}] Job ${job.id} completed`);
  });

  queue.on("failed", (job, err) => {
    console.error(`❌ [${name}] Job ${job.id} failed:`, err.message);
  });

  queue.on("stalled", (job) => {
    console.warn(`⚠️ [${name}] Job ${job.id} stalled — retrying...`);
  });
});

// --- Helper to get a queue by name ---
const getQueue = (name) => queues[name];

module.exports = {
  queues,
  getQueue,
  redisConfig,
};

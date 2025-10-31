// src/utils/queues.js
const Bull = require("bull");
const dotenv = require("dotenv");
dotenv.config();

// Redis connection (default or custom via .env)
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

// Initialize queues
const emailQueue = new Bull("emailQueue", { redis: redisConfig });

const notificationQueue = new Bull("notificationQueue", { redis: redisConfig });

// Example job: enqueue an email
const addEmailJob = async (data) => {
  await emailQueue.add(data, { attempts: 3, backoff: 5000 });
};

// Example job: enqueue a notification
const addNotificationJob = async (data) => {
  await notificationQueue.add(data, { delay: 1000 });
};

module.exports = {
  emailQueue,
  notificationQueue,
  addEmailJob,
  addNotificationJob,
};


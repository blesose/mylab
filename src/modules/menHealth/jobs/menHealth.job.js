const Queue = require("bull");
require("dotenv").config();

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

const mensHealthQueue = new Queue("mensHealthQueue", { redis: redisConfig });

module.exports = { mensHealthQueue };

const { femaleHealthSummaryJob } = require("../jobs/femaleHealthSummary.job");
const Queue = require("bull");
const { redisConfig } = require("../../config/redis.config");

const femaleHealthQueue = new Queue("femaleHealthQueue", redisConfig);

femaleHealthQueue.process(femaleHealthSummaryJob);

console.log("👩‍⚕️ Female Health Worker active and listening for jobs...");

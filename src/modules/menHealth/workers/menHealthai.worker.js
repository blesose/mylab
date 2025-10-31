const Queue = require("bull");
const { redisConfig } = require("../../config/redis.config");
const { menHealthSummaryJob } = require("../jobs/menHealthSummary.job");

const menHealthQueue = new Queue("menHealthQueue", redisConfig);

menHealthQueue.process(menHealthSummaryJob);

console.log("🧔 MenHealth Worker active and listening for weekly jobs...");

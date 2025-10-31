const Queue = require("bull");
const { generateInsight } = require("../services/labInsights.service");

const insightsQueue = new Queue("insights-job");

insightsQueue.process(async (job) => {
  const { userId, category, data } = job.data;
  return await generateInsight(userId, category, data);
});

function enqueueInsightJob(userId, category, data) {
  insightsQueue.add({ userId, category, data });
}

module.exports = { enqueueInsightJob };

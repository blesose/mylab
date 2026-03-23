const { communityPostQueue } = require("../../../queues/menHealth.queue");
const { analyzePostEngagement } = require("../services/communityPost.service");

communityPostQueue.process(async () => {
  console.log("🔍 Running weekly community post engagement analysis...");
  const result = await analyzePostEngagement();
  console.log("📊 Engagement summary:", result);
});

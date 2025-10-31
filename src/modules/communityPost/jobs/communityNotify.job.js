const { communityNotifyQueue } = require("../../../queues/menHealth.queue");
const { processCommunityNotification } = require("../services/communityNotification.service");

communityNotifyQueue.process(async (job) => {
  await processCommunityNotification(job);
});

console.log("✅ Community Notification Worker running...");



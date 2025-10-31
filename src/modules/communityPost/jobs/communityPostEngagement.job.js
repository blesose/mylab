const { communityPostQueue } = require("../../../queues/menHealth.queue");

exports.schedulePostEngagementJob = async () => {
  await communityPostQueue.add({}, { repeat: { cron: "0 12 * * MON" } }); // Weekly engagement analysis
};

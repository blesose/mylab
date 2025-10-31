const Queue = require("bull");

const reminderQueue = new Queue("cycle-reminders", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Repeatable job: send reminder a few days before next cycle
reminderQueue.process(async (job) => {
  const { userId, nextCycleDate } = job.data;
  console.log(`Sending reminder to user ${userId} for next cycle on ${nextCycleDate}`);
});

const scheduleCycleReminder = (userId, nextCycleDate) => {
  reminderQueue.add(
    { userId, nextCycleDate },
    {
      repeat: { cron: "0 9 * * 0" }, // Every Sunday at 9 AM
    }
  );
};

module.exports = { reminderQueue, scheduleCycleReminder };





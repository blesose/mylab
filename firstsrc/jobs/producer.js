const { notificationQueue } = require("./queues");
const Cycle = require("../models/cycle.schema");
const { computeCycleStats, predictNextPeriod } = require("../utils/cycle.utils");
const Pregnancy = require("../models/pregnancy.schema");

/**
 * scheduleNextPeriodReminder(userId, userEmail, daysBefore = 2)
 * Finds predictions and schedules a job daysBefore the predicted start date
 */
const scheduleNextPeriodReminder = async (userId, userEmail, daysBefore = 2) => {
  // fetch cycles and pregnancy check
  const cycles = await Cycle.find({ user: userId }).sort({ startDate: 1 });
  const activePreg = await Pregnancy.findOne({ user: userId });
  if (activePreg) return; // don't schedule if pregnant

  const { predictedStartDate } = predictNextPeriod(cycles, {});
  if (!predictedStartDate) return;

  // compute job time
  const jobTime = new Date(predictedStartDate);
  jobTime.setDate(jobTime.getDate() - daysBefore);

  // don't schedule in the past
  if (jobTime <= new Date()) return;

  await notificationQueue.add(
    "period-reminder",
    { userId, email: userEmail, predictedStartDate },
    { delay: jobTime.getTime() - Date.now(), attempts: 3, backoff: 60 * 1000 }
  );
};

module.exports = { scheduleNextPeriodReminder };

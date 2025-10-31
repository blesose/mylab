const Cycle = require("../models/cycle.model");
const Pregnancy = require("../models/pregnancy.model");
const { predictNextPeriod } = require("./cycle.utils");
const { notificationQueue } = require("./queues"); // if using Bull; otherwise, simple approach below

// For simplicity we will return predicted start date; you can enqueue a job to send reminder
const scheduleNextPeriodReminder = async (userId, userEmail, daysBefore = 2) => {
  const cycles = await Cycle.find({ user: userId }).sort({ startDate: 1 });
  const activePreg = await Pregnancy.findOne({ userId });
  if (activePreg) return;
  const { predictedStartDate } = predictNextPeriod(cycles, {});
  if (!predictedStartDate) return;
  const jobTime = new Date(predictedStartDate); jobTime.setDate(jobTime.getDate() - daysBefore);
  if (jobTime <= new Date()) return;
  // Example: / you could push a Bull job here; for now we return planned time
  return { userId, userEmail, jobTime, predictedStartDate };
};

module.exports = { scheduleNextPeriodReminder };

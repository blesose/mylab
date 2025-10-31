// src/jobs/mensHealth.job.js
const { mensHealthQueue } = require("../queues/menHealth.queue");
const User = require("../models/user.model");
const HealthRecord = require("../models/mensHealth.model"); // Example model for men's health data

/**
 * This function finds users and enqueues weekly health insight emails.
 * You can call it manually or trigger it with cron (e.g. every Monday at 9am).
 */
async function enqueueMensHealthJobs() {
  console.log("🧠 Enqueuing Men's Health insight jobs...");

  const users = await User.find();
  for (const user of users) {
    const record = await HealthRecord.findOne({ userId: user._id });
    if (!record) continue;

    await mensHealthQueue.add(
      { record, userEmail: user.email },
      {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  }

  console.log(`✅ Enqueued health insights for ${users.length} users`);
}

module.exports = { enqueueMensHealthJobs };

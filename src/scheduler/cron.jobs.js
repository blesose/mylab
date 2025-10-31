// src/scheduler/cron.jobs.js
const cron = require("node-cron");
const { addNotificationJob, addEmailJob } = require("../utils/queues");
const { scheduleNextPeriodReminder } = require("../utils/cycleReminder.utils");
const User = require("../models/user.model");
const { mensHealthQueue } = require("../utils/queues");
const { mentalHealthQueue } = require("../utils/queues");
// Run daily at 7 AM (server time)
cron.schedule("0 7 * * *", async () => {
  console.log("🌅 Running daily MyLab job at 7 AM...");

  try {
    const users = await User.find();

    for (const user of users) {
      // --- 1️⃣ Send a daily health tip ---
      await addNotificationJob({
        type: "healthTip",
        userId: user._id,
        message: "💡 Stay hydrated and take deep breaths today. Self-care is key!",
      });

      // --- 2️⃣ Predict and schedule cycle reminder ---
      const reminder = await scheduleNextPeriodReminder(user._id, user.email);
      if (reminder) {
        await addNotificationJob({
          type: "cycleReminder",
          userId: user._id,
          message: `🩸 Your next period may start on ${reminder.predictedStartDate.toDateString()}.`,
        });
      }

      // --- 3️⃣ Optionally send email tip ---
      await addEmailJob({
        to: user.email,
        subject: "Daily MyLab Health Tip 🌸",
        text: "Stay positive! Every healthy habit adds up 💪",
        html: "<p>Stay positive! Every healthy habit adds up 💪</p>",
      });
    }

    console.log("✅ Daily MyLab jobs queued successfully");
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
});

// Weekly men's health tip — every Monday 7 AM
cron.schedule("0 7 * * 1", async () => {
  await addNotificationJob({
    type: "mensTip",
    message: "💪 Remember to hydrate, rest well, and get at least 30 minutes of activity today.",
  });
});

cron.schedule("0 7 * * 1", async () => {
  console.log("🧠 Running weekly men’s health reminder job...");
  await mensHealthQueue.add({
    record: { exerciseFrequency: "none", sleepHours: 5, stressLevel: 8 }, // sample
    userEmail: "user@mylab.com",
  });
});

cron.schedule("0 8 * * *", async () => {
  const users = await User.find({}); // be careful with large user sets (paginate)
  for (const user of users) {
    await mentalHealthQueue.add("dailyReminder", {
      userId: user._id,
      message: "Time to check in — how are you feeling today?",
      email: user.email
    }, { removeOnComplete: true });
  }
});




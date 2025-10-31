const cron = require("node-cron");
const user = require("../models/user.schema");
const { scheduleNextPeriodReminder } = require("./producer");

// Every day at 00:15
cron.schedule("15 0 * * *", async () => {
  const users = await user.find({ isActive: true }).select("_id email");
  for (const u of users) {
    await scheduleNextPeriodReminder(u._id, u.email, 2);
  }
});
// Every 10 minutes
cron.schedule("*/10 * * * *", () => {
  console.log("⏱ Running every 10 minutes...");
});

// Every Sunday at 6 AM
cron.schedule("0 6 * * 0", () => {
  console.log("🧹 Weekly cleanup running...");
});
cron.schedule("* * * * *", async () => {
  console.log("💌 Testing email reminder...");
  await sendEmail("youremail@gmail.com", "Test Reminder", "This is a test", "<h3>✅ Test email working!</h3>");
});


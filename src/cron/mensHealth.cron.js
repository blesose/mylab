// src/cron/mensHealth.cron.js
const cron = require("node-cron");
const { enqueueMensHealthJobs } = require("../jobs/mensHealth.job");

/**
 * Cron job: Run every Monday at 9:00 AM (server time)
 * Syntax: second (optional) minute hour day-of-month month day-of-week
 * This pattern → 0 9 * * 1 → means: 9:00AM every Monday
 */
const mensHealthWeeklyCron = cron.schedule("0 9 * * 1", async () => {
  console.log("🕘 Running weekly Men's Health cron...");
  try {
    await enqueueMensHealthJobs();
    console.log("✅ Weekly Men's Health jobs enqueued successfully!");
  } catch (err) {
    console.error("❌ Error during Men's Health cron:", err);
  }
});

// Export it so we can start it from the main server
module.exports = { mensHealthWeeklyCron };

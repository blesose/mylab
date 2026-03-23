const cron = require("node-cron");
const { generateAllUsersWeeklyReports } = require("../services/labInsights.service");

// Schedule: Run every Sunday at 2 AM
cron.schedule("0 2 * * 0", async () => {
  console.log(`[${new Date().toISOString()}] 📊 Generating weekly reports for all users...`);
  
  try {
    const result = await generateAllUsersWeeklyReports();
    
    if (result.success) {
      console.log(`✅ Generated ${result.totalGenerated} weekly reports`);
      
      // Optional: Send email notifications to users
      // await sendReportNotifications(result.reports);
    } else {
      console.error("❌ Failed to generate weekly reports:", result.message);
    }
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
});

console.log("📅 Weekly Reports Cron Job Initialized...");
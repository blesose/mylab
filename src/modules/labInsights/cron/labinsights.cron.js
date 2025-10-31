const cron = require("node-cron");
const path = require("path");
const fs = require("fs");
const connectDB = require("../../../../src/config/DBconnection");
const { generateLabInsightsReport } = require("../services/labInsights.service");
require("dotenv").config();

// Connect to MongoDB
connectDB();

// ✅ Utility: Delete old reports (>30 days)
const deleteOldReports = () => {
  // ✅ Point to the actual report folder
  const REPORT_DIR = path.join(__dirname, "../../report/generated");
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

  try {
    // ✅ Create folder if missing
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
      console.log("📁 Created missing report directory:", REPORT_DIR);
      return; // exit early; nothing to delete yet
    }

    const files = fs.readdirSync(REPORT_DIR);

    files.forEach((file) => {
      const filePath = path.join(REPORT_DIR, file);
      const stats = fs.statSync(filePath);

      if (Date.now() - stats.mtimeMs > THIRTY_DAYS) {
        fs.unlinkSync(filePath);
        console.log(`🗑 Deleted old report: ${file}`);
      }
    });
  } catch (err) {
    console.error("❌ Error deleting old reports:", err.message);
  }
};

// 🕒 Schedule: Run every Sunday at midnight
cron.schedule("0 0 * * 0", async () => {
  console.log(`[${new Date().toISOString()}] 🧠 Running LabInsights weekly report...`);

  try {
    const result = await generateLabInsightsReport();
    console.log("✅ LabInsights report generated successfully:", result?.summary || "No summary provided");

    // Run cleanup after report generation
    deleteOldReports();
  } catch (err) {
    console.error("❌ LabInsights cron error:", err.message);
  }
});

console.log("🧠 LabInsights Cron Job Initialized...");





// const cron = require("node-cron");
// const path = require("path");
// const fs = require("fs");
// const connectDB = require("../../../../src/config/DBconnection");
// const { generateLabInsightsReport } = require("../services/labInsights.service");
// require("dotenv").config();

// // Connect to MongoDB
// connectDB();

// // ✅ Unified report directory path
// const REPORT_DIR = path.join(__dirname, "../../report/generated");

// // ✅ Ensure directory exists
// if (!fs.existsSync(REPORT_DIR)) {
//   fs.mkdirSync(REPORT_DIR, { recursive: true });
//   console.log("📁 Created missing report directory automatically.");
// }

// // ✅ Utility: Delete old reports (>30 days)
// const deleteOldReports = () => {
//   const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

//   try {
//     const files = fs.readdirSync(REPORT_DIR);

//     files.forEach((file) => {
//       const filePath = path.join(REPORT_DIR, file);
//       const stats = fs.statSync(filePath);

//       if (Date.now() - stats.mtimeMs > THIRTY_DAYS) {
//         fs.unlinkSync(filePath);
//         console.log(`🗑 Deleted old report: ${file}`);
//       }
//     });
//   } catch (err) {
//     console.error("❌ Error deleting old reports:", err.message);
//   }
// };

// // 🕒 Schedule: Run every Sunday at midnight
// cron.schedule("0 0 * * 0", async () => {
//   console.log(`[${new Date().toISOString()}] 🧠 Running LabInsights weekly report...`);

//   try {
//     const result = await generateLabInsightsReport(REPORT_DIR);
//     console.log("✅ LabInsights report generated successfully:", result?.summary || "No summary provided");

//     // Clean up after generating
//     deleteOldReports();
//   } catch (err) {
//     console.error("❌ LabInsights cron error:", err.message);
//   }
// });

// console.log("🧠 LabInsights Cron Job Initialized...");




// const cron = require("node-cron");
// const path = require("path");
// const fs = require("fs");
// const connectDB = require("../../../../src/config/DBconnection");
// const { generateLabInsightsReport } = require("../services/labInsights.service");
// require("dotenv").config();

// // Connect to MongoDB
// connectDB();

// // ✅ Always resolve report directory correctly
// // (No matter where this file is executed from)
// const REPORT_DIR = path.resolve(__dirname, "../../../../src/modules/report");

// // 📁 Ensure directory exists before anything else
// if (!fs.existsSync(REPORT_DIR)) {
//   fs.mkdirSync(REPORT_DIR, { recursive: true });
//   console.log("📁 Created reports directory automatically at:", REPORT_DIR);
// }

// // ✅ Utility: Delete old reports (>30 days)
// const deleteOldReports = () => {
//   const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

//   try {
//     const files = fs.readdirSync(REPORT_DIR);

//     files.forEach(file => {
//       const filePath = path.join(REPORT_DIR, file);
//       const stats = fs.statSync(filePath);

//       if (Date.now() - stats.mtimeMs > THIRTY_DAYS) {
//         fs.unlinkSync(filePath);
//         console.log(`🗑 Deleted old report: ${file}`);
//       }
//     });
//   } catch (err) {
//     console.error("❌ Error deleting old reports:", err.message);
//   }
// };

// // 🕒 Schedule: Run every Sunday at midnight
// cron.schedule("0 0 * * 0", async () => {
//   console.log(`[${new Date().toISOString()}] 🧠 Running LabInsights weekly report...`);

//   try {
//     const result = await generateLabInsightsReport();
//     console.log("✅ LabInsights report generated successfully:", result?.summary || "No summary provided");

//     // Clean old reports
//     deleteOldReports();

//   } catch (err) {
//     console.error("❌ LabInsights cron error:", err.message);
//   }
// });


















// console.log("🧠 LabInsights Cron Job Initialized...");
// const cron = require("node-cron");
// const path = require("path");
// const fs = require("fs");
// const connectDB = require("../../../../src/config/DBconnection");
// const { generateLabInsightsReport } = require("../services/labInsights.service");
// require("dotenv").config();

// // Connect to MongoDB
// connectDB();

// // ✅ Utility: Delete old reports (>30 days)
// const deleteOldReports = () => {
//   const REPORT_DIR = path.join(__dirname, "../../reports");
//   const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

//   try {
//     if (!fs.existsSync(REPORT_DIR)) return console.log("ℹ No report directory found.");

//     const files = fs.readdirSync(REPORT_DIR);

//     files.forEach(file => {
//       const filePath = path.join(REPORT_DIR, file);
//       const stats = fs.statSync(filePath);

//       if (Date.now() - stats.mtimeMs > THIRTY_DAYS) {
//         fs.unlinkSync(filePath);
//         console.log(`🗑 Deleted old report: ${file}`);
//       }
//     });
//   } catch (err) {
//     console.error("❌ Error deleting old reports:", err.message);
//   }
// };

// // 🕒 Schedule: Run every Sunday at midnight
// cron.schedule("0 0 * * 0", async () => {
//   console.log(`[${new Date().toISOString()}] 🧠 Running LabInsights weekly report...`);

//   try {
//     const result = await generateLabInsightsReport();
//     console.log("✅ LabInsights report generated successfully:", result?.summary || "No summary provided");

//     // Run cleanup after report generation
//     deleteOldReports();

//   } catch (err) {
//     console.error("❌ LabInsights cron error:", err.message);
//   }
// });

// console.log("🧠 LabInsights Cron Job Initialized...");

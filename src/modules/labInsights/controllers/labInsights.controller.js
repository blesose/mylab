const { 
  generateInsight, 
  getUserInsights, 
  generateUserWeeklyReport,  // ADD THIS IMPORT
  getUserWeeklyData          // ADD THIS IMPORT
} = require("../services/labInsights.service");
const { getAIInsight } = require("../ai/ai.helper");
const LabInsights = require("../models/labInsights.model");
const path = require("path");
const fs = require("fs");

const createInsight = async (req, res) => {
  try {
    const { category, data } = req.body;
    const userId = req.userId;
    const insight = await generateInsight(userId, category, data);
    res.status(201).json({ message: "Insight generated", insight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const insights = await getUserInsights(userId);
    res.status(200).json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchAInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const { insightId } = req.params;
    const insights = await LabInsights.findOne({ _id: insightId, userId });
    res.status(200).json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardInsights = async (req, res) => {
  try {
    const userId = req.userId;
    // Use the new function to get real weekly data
    const weeklyData = await getUserWeeklyData(userId);
    
    const insights = await LabInsights.find({ userId }).sort({ createdAt: -1 }).limit(10);
    
    const aiSummary = await getAIInsight(
      `Summarize this user's weekly activity: 
      Sleep: ${weeklyData.summary.totalSleepHours}h with quality ${weeklyData.summary.avgSleepQuality}/10
      Workouts: ${weeklyData.summary.totalWorkouts} sessions
      Self-care: ${weeklyData.summary.totalSelfCare} activities
      Community: ${weeklyData.summary.totalPosts} posts`
    );

    res.json({ 
      weeklySummary: weeklyData.summary,
      recentInsights: insights,
      aiSummary 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: Generate weekly report endpoint
const generateWeeklyReport = async (req, res) => {
  try {
    const userId = req.userId;
    const report = await generateUserWeeklyReport(userId);
    
    if (report.success) {
      res.json({
        success: true,
        message: "Weekly report generated successfully",
        downloadUrl: `/labinsights/lab/weekly-report/download/${report.fileName}`,
        summary: report.summary
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: report.message 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// FIXED: Proper file download with async function
const downloadWeeklyReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { filename } = req.params;
    
    console.log("📥 Download request:", { userId, filename });
    
    // Option 1: Download specific file by filename
    if (filename) {
      const REPORT_DIR = path.join(__dirname, "../../../modules/report/generated");
      const filePath = path.join(REPORT_DIR, filename);
      
      console.log("📁 Looking for file:", filePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: "Report file not found. Please generate a new report first." 
        });
      }
      
      // Set proper headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error("Stream error:", error);
        res.status(500).json({ success: false, message: "Error streaming file" });
      });
      
      return;
    }
    
    // Option 2: No filename provided - generate or find recent report
    console.log("🔄 No filename provided, checking for existing reports...");
    
    const REPORT_DIR = path.join(__dirname, "../../../modules/report/generated");
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    
    // Look for existing user reports
    const userReportPattern = new RegExp(`Weekly_Report_${userId}_`);
    const files = fs.readdirSync(REPORT_DIR).filter(f => 
      f.endsWith('.pdf') && userReportPattern.test(f)
    );
    
    // If user has existing reports, use the latest one
    if (files.length > 0) {
      // Sort by date (newest first)
      files.sort().reverse();
      const latestReport = files[0];
      const filePath = path.join(REPORT_DIR, latestReport);
      
      console.log("📄 Using existing report:", latestReport);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${latestReport}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error("Stream error:", error);
        res.status(500).json({ success: false, message: "Error streaming file" });
      });
      
      return;
    }
    
    // No existing report, generate a new one
    console.log("⚡ No existing report found, generating new weekly report...");
    const report = await generateUserWeeklyReport(userId);
    
    if (!report.success) {
      return res.status(500).json({ 
        success: false, 
        message: report.message || "Failed to generate report" 
      });
    }
    
    // Stream the newly generated report
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
    
    const fileStream = fs.createReadStream(report.filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error("Stream error:", error);
      res.status(500).json({ success: false, message: "Error streaming file" });
    });
    
  } catch (err) {
    console.error("❌ Error in downloadWeeklyReport:", err.message);
    console.error(err.stack);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Internal server error" 
    });
  }
};

module.exports = { 
  createInsight, 
  fetchInsights, 
  fetchAInsights, 
  getDashboardInsights,  
  downloadWeeklyReport,
  generateWeeklyReport
};
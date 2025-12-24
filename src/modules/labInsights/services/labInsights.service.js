// const fs = require("fs");
// const path = require("path");
// const PDFDocument = require("pdfkit");
// const LabInsights = require("../models/labInsights.model");
// const { analyzeData } = require("./labInsights.analysis");

// async function generateInsight(userId, category, data) {
//   const result = await analyzeData(userId, category, data);
//   const insight = new LabInsights(result);
//   await insight.save();
//   return insight;
// }

// async function getUserInsights(userId) {
//   return LabInsights.find({ userId }).sort({ createdAt: -1 });
// }

// async function getRecentInsights(limit = 10) {
//   return LabInsights.find().sort({ createdAt: -1 }).limit(limit);
// }

//   //  Generate a Weekly Lab Insights Report
//   //  Fetches the latest insights from all users
//   //  Saves as a PDF in /reports directory
 

//  const generateLabInsightsReport = async () => {
//   try {
//     const insights = await LabInsights.find();

//     if (!insights.length) {
//       return { success: false, message: "No weekly report found yet" };
//     }

//     // Ensure reports directory exists (in /report/generated)
//     const REPORT_DIR = path.join(__dirname, "../../report/generated");
//     if (!fs.existsSync(REPORT_DIR)) {
//       fs.mkdirSync(REPORT_DIR, { recursive: true });
//       console.log("📁 Created reports directory at:", REPORT_DIR);
//     }

//     // Generate PDF file name and path
//     const timestamp = new Date().toISOString().split("T")[0];
//     const fileName = `LabInsights_Report_${timestamp}.pdf`;
//     const filePath = path.join(REPORT_DIR, fileName);

//     // Create PDF
//     const doc = new PDFDocument();
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // PDF Header
//     doc.fontSize(20).text("🧠 MyLab - Weekly Lab Insights Report", { align: "center" });
//     doc.moveDown();

//     // Summary
//     doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
//     doc.moveDown();
//     doc.text("========================================");
//     doc.moveDown();

//     // Add each insight
//     insights.forEach((insight, i) => {
//       doc.fontSize(14).text(`Insight ${i + 1}:`);
//       doc.fontSize(12).text(`User: ${insight.userId}`);
//       doc.text(`Category: ${insight.category}`);
//       doc.text(`Summary: ${insight.summary}`);
//       doc.text(`Created: ${new Date(insight.createdAt).toLocaleString()}`);
//       doc.moveDown();
//       doc.text("----------------------------------------");
//       doc.moveDown();
//     });

//     // End PDF
//     doc.end();

//     await new Promise((resolve) => writeStream.on("finish", resolve));

//     console.log(`✅ Report saved as ${fileName} in ${REPORT_DIR}`);

//     return { success: true, summary: `Report saved as ${fileName} `};

//   } catch (error) {
//     console.error("❌ Error generating lab insights report:", error.message);
//     return { success: false, message: "Failed to generate report", error: error.message };
//   }
// };

// module.exports = {
//   generateInsight,
//   getUserInsights,
//   getRecentInsights,
//   generateLabInsightsReport,
// };

// labInsights.service.js - UPDATED VERSION
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const LabInsights = require("../models/labInsights.model");
const SleepRecord = require("../../sleepRecovery/models/sleep.model");
const Fitness = require("../../fitness&Nutrition/models/fitness.model");
const Nutrition = require("../../fitness&Nutrition/models/nutrition.model");
const SelfCare = require("../../selfCare/models/selfCare.model");
const CommunityPost = require("../../communityPost/models/communityPost.model");
const User = require("../../users/models/user.schema");
const { analyzeData } = require("./labInsights.analysis");

async function generateInsight(userId, category, data) {
  const result = await analyzeData(userId, category, data);
  const insight = new LabInsights(result);
  await insight.save();
  return insight;
}

async function getUserInsights(userId) {
  return LabInsights.find({ userId }).sort({ createdAt: -1 });
}

// NEW: Fetch user's weekly activity data
async function getUserWeeklyData(userId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const user = await User.findById(userId).select("name email");
  
  // Fetch data from all modules for the past week
  const [
    sleepData,
    fitnessData,
    nutritionData,
    selfCareData,
    communityPosts,
    labInsights
  ] = await Promise.all([
    SleepRecord.find({ 
      userId, 
      createdAt: { $gte: oneWeekAgo } 
    }).sort({ createdAt: -1 }),
    
    Fitness.find({ 
      userId, 
      createdAt: { $gte: oneWeekAgo } 
    }).sort({ createdAt: -1 }),
    
    Nutrition.find({ 
      userId, 
      createdAt: { $gte: oneWeekAgo } 
    }).sort({ createdAt: -1 }),
    
    SelfCare.find({ 
      userId, 
      createdAt: { $gte: oneWeekAgo } 
    }).sort({ createdAt: -1 }),
    
    CommunityPost.find({ 
      userId, 
      createdAt: { $gte: oneWeekAgo } 
    }).sort({ createdAt: -1 }),
    
    LabInsights.find({ 
      userId, 
      createdAt: { $gte: oneWeekAgo } 
    }).sort({ createdAt: -1 })
  ]);
  
  return {
    userInfo: user,
    summary: {
      totalSleepHours: sleepData.reduce((sum, record) => sum + (record.duration || 0), 0),
      totalWorkouts: fitnessData.length,
      totalPosts: communityPosts.length,
      totalSelfCare: selfCareData.length,
      avgSleepQuality: sleepData.length ? 
        (sleepData.reduce((sum, record) => sum + (record.quality || 0), 0) / sleepData.length).toFixed(1) : 0,
      avgCaloriesBurned: fitnessData.length ? 
        (fitnessData.reduce((sum, record) => sum + (record.caloriesBurned || 0), 0) / fitnessData.length).toFixed(0) : 0
    },
    details: {
      sleep: sleepData,
      fitness: fitnessData,
      nutrition: nutritionData,
      selfCare: selfCareData,
      community: communityPosts,
      insights: labInsights
    }
  };
}

// NEW: Generate personalized weekly PDF report
async function generateUserWeeklyReport(userId) {
  try {
    // Fetch user's weekly data
    const weeklyData = await getUserWeeklyData(userId);
    
    // Ensure reports directory exists
    const REPORT_DIR = path.join(__dirname, "../../report/generated");
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    
    // Generate file name with user ID and date
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Weekly_Report_${userId}_${timestamp}.pdf`;
    const filePath = path.join(REPORT_DIR, fileName);
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // PDF Header
    doc.fontSize(24).fillColor('#2E86C1').text('MyLab Weekly Health Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#666').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);
    
    // User Information
    doc.fontSize(16).fillColor('#2C3E50').text('Personal Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('black')
       .text(`Name: ${weeklyData.userInfo?.name || 'User'}`)
       .text(`Email: ${weeklyData.userInfo?.email || 'N/A'}`)
       .text(`Report Period: Last 7 days`);
    doc.moveDown(1);
    
    // Weekly Summary Table
    doc.fontSize(16).fillColor('#2C3E50').text('Weekly Activity Summary', { underline: true });
    doc.moveDown(0.5);
    
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Sleep Hours', `${weeklyData.summary.totalSleepHours}h`],
      ['Average Sleep Quality', `${weeklyData.summary.avgSleepQuality}/10`],
      ['Workout Sessions', weeklyData.summary.totalWorkouts],
      ['Community Posts', weeklyData.summary.totalPosts],
      ['Self-Care Activities', weeklyData.summary.totalSelfCare],
      ['Avg Calories Burned', `${weeklyData.summary.avgCaloriesBurned} cal`]
    ];
    
    // Simple table implementation
    let yPos = doc.y;
    summaryData.forEach((row, i) => {
      doc.font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
         .fontSize(i === 0 ? 12 : 11)
         .fillColor(i === 0 ? '#2C3E50' : 'black');
      
      doc.text(row[0], 50, yPos);
      doc.text(row[1], 250, yPos, { align: 'right', width: 200 });
      yPos += 25;
    });
    
    doc.y = yPos + 20;
    
    // Detailed Sections
    const sections = [
      { title: 'Sleep Analysis', data: weeklyData.details.sleep, key: 'duration' },
      { title: 'Fitness Activities', data: weeklyData.details.fitness, key: 'activityType' },
      { title: 'Self-Care Activities', data: weeklyData.details.selfCare, key: 'activity' },
      { title: 'Community Engagement', data: weeklyData.details.community, key: 'title' }
    ];
    
    sections.forEach(section => {
      if (section.data.length > 0) {
        doc.addPage().fontSize(16).fillColor('#2C3E50').text(section.title, { underline: true });
        doc.moveDown(0.5);
        
        section.data.forEach((item, index) => {
          doc.fontSize(10).fillColor('black')
             .text(`${index + 1}. ${item[section.key] || 'Activity'} - ${new Date(item.createdAt).toLocaleDateString()}`);
          
          // Add additional details if available
          if (item.notes) doc.text(`   Notes: ${item.notes}`).moveDown(0.2);
          if (item.duration) doc.text(`   Duration: ${item.duration} minutes`).moveDown(0.2);
          if (item.caloriesBurned) doc.text(`   Calories: ${item.caloriesBurned}`).moveDown(0.2);
          
          doc.moveDown(0.3);
        });
        doc.moveDown(1);
      }
    });
    
    // AI Insights
    if (weeklyData.details.insights.length > 0) {
      doc.addPage().fontSize(16).fillColor('#2C3E50').text('AI Health Insights', { underline: true });
      doc.moveDown(0.5);
      
      weeklyData.details.insights.forEach((insight, index) => {
        doc.fontSize(12).fillColor('#27AE60').text(`Insight #${index + 1} (${insight.category})`);
        doc.fontSize(10).fillColor('black').text(insight.summary);
        
        if (insight.aiGeneratedTips && insight.aiGeneratedTips.length > 0) {
          insight.aiGeneratedTips.forEach(tip => {
            doc.fontSize(9).fillColor('#7D3C98').text(`• ${tip}`);
          });
        }
        doc.moveDown(0.5);
      });
    }
    
    // Footer
    doc.addPage().fontSize(10).fillColor('#666')
       .text('Generated by MyLab Health Platform', { align: 'center' })
       .text('This report is for personal health tracking purposes only.', { align: 'center' })
       .text('For medical advice, please consult a healthcare professional.', { align: 'center' });
    
    // Finalize PDF
    doc.end();
    
    await new Promise((resolve) => writeStream.on('finish', resolve));
    
    return {
      success: true,
      filePath,
      fileName,
      downloadUrl: `/labinsights/lab/weekly-report/download/${fileName}`,
      summary: weeklyData.summary
    };
    
  } catch (error) {
    console.error('Error generating user weekly report:', error);
    return { success: false, message: error.message };
  }
}

// NEW: Get all users weekly reports (for cron job)
async function generateAllUsersWeeklyReports() {
  try {
    const users = await User.find({}).select('_id');
    const reports = [];
    
    for (const user of users) {
      const report = await generateUserWeeklyReport(user._id);
      if (report.success) {
        reports.push(report);
      }
    }
    
    return {
      success: true,
      totalGenerated: reports.length,
      reports: reports.map(r => ({
        userId: r.userId,
        fileName: r.fileName
      }))
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  generateInsight,
  getUserInsights,
  // getRecentInsights,
  // generateLabInsightsReport,
  getUserWeeklyData,           // NEW
  generateUserWeeklyReport,    // NEW
  generateAllUsersWeeklyReports // NEW
};
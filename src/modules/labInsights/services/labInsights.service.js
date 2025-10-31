
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const LabInsights = require("../models/labInsights.model");
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

async function getRecentInsights(limit = 10) {
  return LabInsights.find().sort({ createdAt: -1 }).limit(limit);
}

/**
 * 🧠 Generate a Weekly Lab Insights Report
 * - Fetches the latest insights from all users
 * - Saves as a PDF in /reports directory
 */
// async function generateLabInsightsReport() {
//   try {
//     const insights = await LabInsights.find().sort({ createdAt: -1 }).limit(50);
//     if (!insights.length) {
//       console.log("⚠ No lab insights found to include in the report.");
//       return { summary: "No insights found." };
//     }

//     // Create /reports directory if missing
//     const REPORT_DIR = path.join(__dirname, "../../../reports");
//     if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

//     const fileName = `LabInsights_Report_${new Date().toISOString().split("T")[0]}.pdf`;
//     const filePath = path.join(REPORT_DIR, fileName);

//     const doc = new PDFDocument({ margin: 50 });
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Header
//     doc.fontSize(18).text("🧠 MyLab - Weekly Lab Insights Report", { align: "center" });
//     doc.moveDown(1);
//     doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}, { align: "center" }`);
//     doc.moveDown(2);

//     // Insights summary
//     insights.forEach((item, i) => {
//       doc.fontSize(13).text(`${i + 1}. Category: ${item.category}`);
//       doc.fontSize(11).text(`User: ${item.userId || "Anonymous"}`);
//       doc.text(`Created: ${new Date(item.createdAt).toLocaleString()}`);
//       doc.text(`Details: ${item.summary || JSON.stringify(item.data || {}, null, 2)}`);
//       doc.moveDown();
//     });

//     doc.end();

//     await new Promise(resolve => writeStream.on("finish", resolve));

//     console.log(`✅ Report saved at: ${filePath}`);
//     return { 
//       success: true, 
//       summary: `Report saved as ${fileName}` 
//     };

//   } catch (err) {
//     console.error("❌ Error generating lab insights report:", err.message);
//     return { success: false, error: err.message };
//   }
// }
 const generateLabInsightsReport = async () => {
  try {
    const insights = await LabInsights.find();

    if (!insights.length) {
      return { success: false, message: "No weekly report found yet" };
    }

    // ✅ Ensure reports directory exists (in /report/generated)
    const REPORT_DIR = path.join(__dirname, "../../report/generated");
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
      console.log("📁 Created reports directory at:", REPORT_DIR);
    }

    // ✅ Generate PDF file name and path
    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `LabInsights_Report_${timestamp}.pdf`;
    const filePath = path.join(REPORT_DIR, fileName);

    // ✅ Create PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // PDF Header
    doc.fontSize(20).text("🧠 MyLab - Weekly Lab Insights Report", { align: "center" });
    doc.moveDown();

    // Summary
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text("========================================");
    doc.moveDown();

    // Add each insight
    insights.forEach((insight, i) => {
      doc.fontSize(14).text(`Insight ${i + 1}:`);
      doc.fontSize(12).text(`User: ${insight.userId}`);
      doc.text(`Category: ${insight.category}`);
      doc.text(`Summary: ${insight.summary}`);
      doc.text(`Created: ${new Date(insight.createdAt).toLocaleString()}`);
      doc.moveDown();
      doc.text("----------------------------------------");
      doc.moveDown();
    });

    // End PDF
    doc.end();

    await new Promise((resolve) => writeStream.on("finish", resolve));

    console.log(`✅ Report saved as ${fileName} in ${REPORT_DIR}`);

    return { success: true, summary: `Report saved as ${fileName} `};

  } catch (error) {
    console.error("❌ Error generating lab insights report:", error.message);
    return { success: false, message: "Failed to generate report", error: error.message };
  }
};

module.exports = {
  generateInsight,
  getUserInsights,
  getRecentInsights,
  generateLabInsightsReport,
};

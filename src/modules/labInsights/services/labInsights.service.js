
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

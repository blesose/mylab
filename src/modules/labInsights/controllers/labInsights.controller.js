const { generateInsight, getUserInsights } = require("../services/labInsights.service");
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
    const insights = await LabInsights.findOne({ _id:insightId, userId });
    res.status(200).json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const insights = await LabInsights.find({ userId }).sort({ createdAt: -1 }).limit(10);

    const chartData = insights.map(i => ({
      category: i.category,
      avgScore: Number(i.summary.match(/Average score: ([\d.]+)/)?.[1] || 0),
      createdAt: i.createdAt,
    }));

    const aiSummary = await getAIInsight(
      `Summarize trends for these insights: ${JSON.stringify(chartData)}`
    );

    res.json({ chartData, aiSummary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const downloadWeeklyReport = async (req, res) => {
//   try {
//     const REPORT_DIR = path.join(__dirname, "../../../reports");
//     const files = fs.readdirSync(REPORT_DIR)
//       .filter(f => f.endsWith(".pdf"))
//       .sort((a, b) => fs.statSync(path.join(REPORT_DIR, b)).mtime - fs.statSync(path.join(REPORT_DIR, a)).mtime);

//     if (!files.length) {
//       return res.status(404).json({ success: false, message: "No weekly report found yet" });
//     }

//     const latestReport = files[0];
//     const filePath = path.join(REPORT_DIR, latestReport);

//     res.download(filePath, latestReport);
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
const downloadWeeklyReport = async (req, res) => {
  try {
    // ✅ Correct path to match where reports are saved
    const REPORT_DIR = path.join(__dirname, "../../../modules/report/generated");

    // ✅ Create folder automatically if missing (avoids ENOENT)
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
      return res.status(404).json({
        success: false,
        message: "No weekly report found yet (report folder just created).",
      });
    }

    // ✅ Get list of all PDF files
    const files = fs
      .readdirSync(REPORT_DIR)
      .filter((f) => f.endsWith(".pdf"))
      .sort(
        (a, b) =>
          fs.statSync(path.join(REPORT_DIR, b)).mtimeMs -
          fs.statSync(path.join(REPORT_DIR, a)).mtimeMs
      );

    if (!files.length) {
      return res
        .status(404)
        .json({ success: false, message: "No weekly report found yet" });
    }

    const latestReport = files[0];
    const filePath = path.join(REPORT_DIR, latestReport);

    console.log("📄 Sending report:", latestReport);
    res.send(filePath, latestReport);
  } catch (err) {
    console.error("❌ Error downloading weekly report:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = { createInsight, fetchInsights, fetchAInsights, getDashboardInsights,  downloadWeeklyReport };

// const { generateInsight, getUserInsights } = require("../services/labInsights.service");
// const { getAIInsight } = require("../utils/aiClient");
// const LabInsights = require("../models/labInsights.model");
// const createInsight = async (req, res) => {
//   try {
//     const { category, data } = req.body;
//     const userId = req.user?.id;
//     const insight = await generateInsight(userId, category, data);
//     res.status(201).json({ message: "Insight generated", insight });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const fetchInsights = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const insights = await getUserInsights(userId);
//     res.status(200).json(insights);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// const getDashboardInsights = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const insights = await LabInsights.find({ userId }).sort({ createdAt: -1 }).limit(10);

//     const chartData = insights.map(i => ({
//       category: i.category,
//       avgScore: Number(i.summary.match(/Average score: ([\d.]+)/)?.[1] || 0),
//       createdAt: i.createdAt,
//     }));

//     // Generate AI summary of overall trends
//     const aiSummary = await getAIInsight(
//       `Analyze this insight data: ${JSON.stringify(chartData)} and summarize user trends in plain language.`
//     );

//     res.json({ chartData, aiSummary });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { createInsight, fetchInsights, getDashboardInsights, }
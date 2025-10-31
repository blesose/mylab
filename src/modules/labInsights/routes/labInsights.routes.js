const express = require("express");
const labinsightRouter = express.Router();
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { createInsight, fetchInsights, getDashboardInsights, downloadWeeklyReport, fetchAInsights } = require("../controllers/labInsights.controller");
const { generateInsight } = require("../services/labInsights.service");
//routes
labinsightRouter.post("/create", authMiddleware, createInsight);
labinsightRouter.get("/all", authMiddleware, fetchInsights);
labinsightRouter.get("/a/:insightId", authMiddleware, fetchAInsights);
labinsightRouter.get("/dashboard", authMiddleware, getDashboardInsights);
labinsightRouter.get("/weekly-report/download", authMiddleware, downloadWeeklyReport);
labinsightRouter.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { userId, category, data } = req.body;
    if (!userId || !category || !data) {
      return res.status(400).json({
        success: false,
        message: "userId, category, and data are required."
      });
    }

    const insight = await generateInsight(userId, category, data);
    res.status(201).json({
      success: true,
      message: "Insight generated successfully",
      insight
    });
  } catch (error) {
    console.error("Error generating insight:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate insight",
      error: error.message
    });
  }
});

labinsightRouter.get("/generate-weekly-report", authMiddleware, async (req, res) => {
  try {
    const { generateLabInsightsReport } = require("../services/labInsights.service");
    const result = await generateLabInsightsReport();
    res.json({
      success: true,
      message: "Manual weekly report generation completed.",
      result
    });
  } catch (err) {
    console.error("Manual weekly report error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate weekly report.",
      error: err.message
    });
  }
});

module.exports = { labinsightRouter };
// 🧪 Temporary route to manually trigger weekly report generation

// const express = require("express");
// const labinsightRouter = express.Router();
// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const { createInsight, fetchInsights, getDashboardInsights, downloadWeeklyReport, fetchAInsights } = require("../controllers/labInsights.controller");

// labinsightRouter.post("/create", authMiddleware, createInsight);
// labinsightRouter.get("/all", authMiddleware, fetchInsights);
// labinsightRouter.get("/a/:insightId", authMiddleware, fetchAInsights);
// labinsightRouter.get("/dashboard", authMiddleware, getDashboardInsights);
// labinsightRouter.get("/weekly-report/download", authMiddleware, downloadWeeklyReport);

// module.exports = { labinsightRouter };
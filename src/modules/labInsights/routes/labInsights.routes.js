const express = require("express");
const labinsightRouter = express.Router();
const { authMiddleware } = require("../../../middleware/auth.middleware");
const {
  createInsight,
  fetchInsights,
  getDashboardInsights,
  downloadWeeklyReport,
  fetchAInsights,
  generateWeeklyReport
} = require("../controllers/labInsights.controller");

/**
 * @swagger
 * /api/labinsights/lab/create:
 *   post:
 *     summary: Create a lab insight
 *     description: Generate AI insights from health data
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateInsightRequest"
 *           example:
 *             category: "fitness"
 *             data: [75, 82, 68, 90, 78]
 *     responses:
 *       201:
 *         description: Insight generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 insight:
 *                   $ref: "#/components/schemas/LabInsight"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
labinsightRouter.post("/create", authMiddleware, createInsight);

/**
 * @swagger
 * /api/labinsights/lab/all:
 *   get:
 *     summary: Get all insights
 *     description: Retrieve all lab insights for the authenticated user
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Insights retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/LabInsight"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
labinsightRouter.get("/all", authMiddleware, fetchInsights);

/**
 * @swagger
 * /api/labinsights/lab/a/{insightId}:
 *   get:
 *     summary: Get a single insight
 *     description: Retrieve a specific lab insight by ID
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: insightId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Insight ID
 *         example: "507f1f77bcf86cd799439601"
 *     responses:
 *       200:
 *         description: Insight retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabInsight"
 *       404:
 *         description: Insight not found
 *       401:
 *         description: Unauthorized
 */
labinsightRouter.get("/a/:insightId", authMiddleware, fetchAInsights);

/**
 * @swagger
 * /api/labinsights/lab/dashboard:
 *   get:
 *     summary: Get dashboard insights
 *     description: Get comprehensive dashboard insights including weekly summary, recent insights, and AI summary
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard insights retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DashboardInsights"
 *             example:
 *               weeklySummary:
 *                 totalSleepHours: 49.5
 *                 avgSleepQuality: 7.2
 *                 totalWorkouts: 4
 *                 totalSelfCare: 7
 *                 totalPosts: 3
 *               recentInsights:
 *                 - _id: "507f1f77bcf86cd799439601"
 *                   category: "fitness"
 *                   summary: "Average score: 78.60 based on 5 records"
 *               aiSummary: ["Stay consistent with your workouts", "Maintain a consistent bedtime"]
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
labinsightRouter.get("/dashboard", authMiddleware, getDashboardInsights);

/**
 * @swagger
 * /api/labinsights/lab/weekly-report/generate:
 *   post:
 *     summary: Generate weekly report
 *     description: Generate a PDF weekly health report
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeeklyReport"
 *             example:
 *               success: true
 *               message: "Weekly report generated successfully"
 *               downloadUrl: "/api/labinsights/lab/weekly-report/download/Weekly_Report_507f1f77bcf86cd799439011_2026-07-26.pdf"
 *               summary:
 *                 totalSleepHours: 49.5
 *                 avgSleepQuality: 7.2
 *                 totalWorkouts: 4
 *                 totalSelfCare: 7
 *                 totalPosts: 3
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
labinsightRouter.post("/weekly-report/generate", authMiddleware, generateWeeklyReport);

/**
 * @swagger
 * /api/labinsights/lab/weekly-report/download:
 *   get:
 *     summary: Download weekly report
 *     description: Download the latest weekly health report PDF
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *         description: Specific report filename (optional)
 *         example: "Weekly_Report_507f1f77bcf86cd799439011_2026-07-26.pdf"
 *     responses:
 *       200:
 *         description: PDF file downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Report file not found. Please generate a new report first."
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
labinsightRouter.get("/weekly-report/download", authMiddleware, downloadWeeklyReport);

/**
 * @swagger
 * /api/labinsights/lab/weekly-report/download/{filename}:
 *   get:
 *     summary: Download weekly report by filename
 *     description: Download a specific weekly health report PDF by filename
 *     tags: [Lab Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Report filename
 *         example: "Weekly_Report_507f1f77bcf86cd799439011_2026-07-26.pdf"
 *     responses:
 *       200:
 *         description: PDF file downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Report file not found. Please generate a new report first."
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
labinsightRouter.get("/weekly-report/download/:filename", authMiddleware, downloadWeeklyReport);

/**
 * @swagger
 * /api/labinsights/lab/test:
 *   get:
 *     summary: Test lab insights endpoint
 *     description: Health check endpoint for lab insights
 *     tags: [Lab Insights]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
labinsightRouter.get("/test", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    message: "LabInsights API v3",
    timestamp: new Date().toISOString()
  });
});

module.exports = { labinsightRouter };
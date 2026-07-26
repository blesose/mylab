const express = require("express");
const { validateCycle } = require("../validators/cycle.validator");
const { createCycle, getCycles } = require("../controllers/cycle.controller");
const cycleRouter = express.Router();

/**
 * @swagger
 * /api/females/cycle/create-cycle:
 *   post:
 *     summary: Create a menstrual cycle entry
 *     description: Log a menstrual cycle with detailed tracking including flow, symptoms, mood, and energy levels
 *     tags: [Women's Health - Cycle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCycleRequest"
 *           example:
 *             userId: "507f1f77bcf86cd799439011"
 *             startDate: "2026-07-15"
 *             endDate: "2026-07-19"
 *             flowLevel: "medium"
 *             symptoms: ["cramps", "headache", "fatigue"]
 *             mood: "neutral"
 *             energyLevel: "medium"
 *             crampsIntensity: "moderate"
 *             flowConsistency: "normal"
 *             notes: "Had mild cramps on day 2"
 *     responses:
 *       201:
 *         description: Cycle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     cycle:
 *                       $ref: "#/components/schemas/Cycle"
 *                     cycleLength:
 *                       type: integer
 *                     nextCycle:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "userId is required"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
cycleRouter.post("/create-cycle", validateCycle, createCycle);

/**
 * @swagger
 * /api/females/cycle/{userId}:
 *   get:
 *     summary: Get cycle history with analysis
 *     description: Retrieve all cycles for a user with detailed AI analysis and predictions
 *     tags: [Women's Health - Cycle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: User ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Cycles retrieved with analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     cycles:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/Cycle"
 *                     analysis:
 *                       $ref: "#/components/schemas/CycleAnalysis"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
cycleRouter.get("/:userId", getCycles);

module.exports = cycleRouter;
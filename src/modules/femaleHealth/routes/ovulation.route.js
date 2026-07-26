const express = require("express");
const { createOvulationEntry, getOvulationHistory } = require("../controllers/ovulation.controller");
const { createOvulationValidator } = require("../validators/ovulation.validator");
const ovulationRouter = express.Router();

/**
 * @swagger
 * /api/females/ovulation/create-ovulation:
 *   post:
 *     summary: Create ovulation tracking entry
 *     description: Track ovulation and fertile window based on cycle data
 *     tags: [Women's Health - Ovulation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateOvulationRequest"
 *           example:
 *             userId: "507f1f77bcf86cd799439011"
 *             cycleStart: "2026-07-15"
 *             cycleLength: 28
 *             notes: "Felt mild cramps during ovulation"
 *     responses:
 *       201:
 *         description: Ovulation entry created successfully
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
 *                     entry:
 *                       $ref: "#/components/schemas/Ovulation"
 *                     prediction:
 *                       type: object
 *                       properties:
 *                         ovulation:
 *                           type: string
 *                           format: date
 *                         fertileStart:
 *                           type: string
 *                           format: date
 *                         fertileEnd:
 *                           type: string
 *                           format: date
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
ovulationRouter.post("/create-ovulation", createOvulationValidator, createOvulationEntry);

/**
 * @swagger
 * /api/females/ovulation/{userId}:
 *   get:
 *     summary: Get ovulation history
 *     description: Retrieve all ovulation entries with analysis
 *     tags: [Women's Health - Ovulation]
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
 *         description: Ovulation history retrieved
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
 *                     entries:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/Ovulation"
 *                     analysis:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
ovulationRouter.get("/:userId", getOvulationHistory);

module.exports = ovulationRouter;
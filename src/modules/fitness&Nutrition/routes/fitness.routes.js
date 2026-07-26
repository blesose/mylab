const express = require("express");
const fitnessRouter = express.Router();
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { createFitness, getAllFitness, updateFitness, deleteFitness, getFitness } = require("../controllers/fitness.controller");

/**
 * @swagger
 * /api/fitnessnutrition/fitness/create-fitness:
 *   post:
 *     summary: Create a fitness activity
 *     description: Log a fitness activity with AI-powered grading and calorie burn estimation
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFitnessRequest"
 *           example:
 *             activityType: "Running"
 *             duration: 30
 *             intensity: "medium"
 *             frequency: 4
 *             goal: "general_health"
 *     responses:
 *       201:
 *         description: Fitness activity logged
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
 *                   $ref: "#/components/schemas/FitnessActivity"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
fitnessRouter.post("/create-fitness", authMiddleware, createFitness);

/**
 * @swagger
 * /api/fitnessnutrition/fitness/getall-fitness:
 *   get:
 *     summary: Get all fitness activities
 *     description: Retrieve all fitness activities with AI analysis and progress tracking
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fitness activities retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/FitnessActivity"
 *                 analysis:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     trend:
 *                       type: string
 *                     avgDuration:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
fitnessRouter.get("/getall-fitness", authMiddleware, getAllFitness);

/**
 * @swagger
 * /api/fitnessnutrition/fitness/get-fitness/{activityId}:
 *   get:
 *     summary: Get a single fitness activity
 *     description: Retrieve a specific fitness activity by ID
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Fitness activity ID
 *         example: "507f1f77bcf86cd799439401"
 *     responses:
 *       200:
 *         description: Activity retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/FitnessActivity"
 *       404:
 *         description: Activity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Activity not found"
 *       401:
 *         description: Unauthorized
 */
fitnessRouter.get("/get-fitness/:activityId", authMiddleware, getFitness);

/**
 * @swagger
 * /api/fitnessnutrition/fitness/update-fitness/{id}:
 *   put:
 *     summary: Update a fitness activity
 *     description: Update a fitness activity with auto-regrading and AI tip regeneration
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Fitness activity ID
 *         example: "507f1f77bcf86cd799439401"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFitnessRequest"
 *     responses:
 *       200:
 *         description: Activity updated
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
 *                   $ref: "#/components/schemas/FitnessActivity"
 *       404:
 *         description: Activity not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
fitnessRouter.put("/update-fitness/:id", authMiddleware, updateFitness);

/**
 * @swagger
 * /api/fitnessnutrition/fitness/delete-fitness/{id}:
 *   delete:
 *     summary: Delete a fitness activity
 *     description: Permanently delete a fitness activity
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Fitness activity ID
 *         example: "507f1f77bcf86cd799439401"
 *     responses:
 *       200:
 *         description: Activity deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               success: true
 *               message: "Deleted successfully"
 *       404:
 *         description: Activity not found
 *       401:
 *         description: Unauthorized
 */
fitnessRouter.delete("/delete-fitness/:id", authMiddleware, deleteFitness);

module.exports = { fitnessRouter };
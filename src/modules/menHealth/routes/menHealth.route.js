const express = require("express");
const {
  createRecordHandler,
  getRecordHandler,
  updateRecordHandler,
  deleteRecordHandler,
  listRecordsHandler,
} = require("../controllers/menHealth.controller");
const { createRecordValidator } = require("../validators/menHealth.validator");
const { authMiddleware } = require("../../../middleware/auth.middleware");

const menhealthRouter = express.Router();

/**
 * @swagger
 * /api/mens/menhealth/create-record:
 *   post:
 *     summary: Create a men's health record
 *     description: Log a men's health tracking record with stress, sleep, workout, and hormone metrics
 *     tags: [Men's Health]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateMenHealthRequest"
 *           example:
 *             stressLevel: 5
 *             sleepHours: 7.5
 *             workoutDays: 4
 *             energyLevel: 7
 *             age: 35
 *             prostateCheck: false
 *             testosteroneLevel: 45
 *             notes: "Feeling generally healthy this week"
 *     responses:
 *       201:
 *         description: Men's health record created
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
 *                   $ref: "#/components/schemas/MenHealthRecord"
 *             example:
 *               success: true
 *               message: "Men health record added successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439101"
 *                 userId: "507f1f77bcf86cd799439011"
 *                 condition: "Active Lifestyle"
 *                 description: "Health check: Stress 5/10, Sleep 7.5hrs, Workout 4 days/week, Energy 7/10"
 *                 aiTip: "Good sleep pattern! Keep maintaining 7-8 hours daily."
 *                 analysis:
 *                   insights:
 *                     - metric: "Average Sleep (hrs)"
 *                       value: "7.2"
 *                     - metric: "Average Stress Level"
 *                       value: "4.8"
 *                   advice: "You're maintaining good balance. Keep it up!"
 *                 createdAt: "2026-07-26T10:00:00Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
menhealthRouter.post(
  "/create-record",
  authMiddleware,
  createRecordValidator,
  createRecordHandler
);

/**
 * @swagger
 * /api/mens/menhealth/list-records:
 *   get:
 *     summary: Get all men's health records
 *     description: Retrieve all men's health records for the authenticated user with pagination
 *     tags: [Men's Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Records retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/MenHealthRecord"
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
menhealthRouter.get("/list-records", authMiddleware, listRecordsHandler);

/**
 * @swagger
 * /api/mens/menhealth/get-record/{recordId}:
 *   get:
 *     summary: Get a single men's health record
 *     description: Retrieve a specific men's health record by ID
 *     tags: [Men's Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Record ID
 *         example: "507f1f77bcf86cd799439101"
 *     responses:
 *       200:
 *         description: Record retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/MenHealthRecord"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Not found"
 *       401:
 *         description: Unauthorized
 */
menhealthRouter.get("/get-record/:recordId", authMiddleware, getRecordHandler);

/**
 * @swagger
 * /api/mens/menhealth/update-record/{recordId}:
 *   put:
 *     summary: Update a men's health record
 *     description: Update an existing men's health record with auto-reanalysis of AI insights
 *     tags: [Men's Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Record ID
 *         example: "507f1f77bcf86cd799439101"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateMenHealthRequest"
 *     responses:
 *       200:
 *         description: Record updated
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
 *                   $ref: "#/components/schemas/MenHealthRecord"
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
menhealthRouter.put(
  "/update-record/:recordId",
  authMiddleware,
  createRecordValidator,
  updateRecordHandler
);

/**
 * @swagger
 * /api/mens/menhealth/delete-record/{recordId}:
 *   delete:
 *     summary: Delete a men's health record
 *     description: Permanently delete a men's health record
 *     tags: [Men's Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Record ID
 *         example: "507f1f77bcf86cd799439101"
 *     responses:
 *       200:
 *         description: Record deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               success: true
 *               message: "Deleted"
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
menhealthRouter.delete("/delete-record/:recordId", authMiddleware, deleteRecordHandler);

module.exports = menhealthRouter;
const express = require("express");
const sleepRouter = express.Router();
const {
  addSleepRecord,
  fetchSleepHistory,
  fetchSleepRecordById,
  updateSleepRecord,
  deleteSleepRecord,
} = require("../controllers/sleep.controller");
const { authMiddleware } = require("../../../middleware/auth.middleware");

/**
 * @swagger
 * /api/shealth/sleeprecovery/add-sleep:
 *   post:
 *     summary: Add a sleep record
 *     description: Log sleep data with start time, end time, and quality rating
 *     tags: [Sleep & Recovery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateSleepRequest"
 *           example:
 *             sleepStart: "22:30"
 *             sleepEnd: "06:30"
 *             sleepQuality: 7
 *             notes: "Slept well, woke up refreshed"
 *     responses:
 *       201:
 *         description: Sleep record logged
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
 *                     record:
 *                       $ref: "#/components/schemas/SleepRecord"
 *                     analysis:
 *                       type: object
 *                     aiResponse:
 *                       type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
sleepRouter.post("/add-sleep", authMiddleware, addSleepRecord);

/**
 * @swagger
 * /api/shealth/sleeprecovery/fetch-sleep:
 *   get:
 *     summary: Get all sleep records
 *     description: Retrieve complete sleep history for the authenticated user
 *     tags: [Sleep & Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sleep history retrieved
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
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/SleepRecord"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
sleepRouter.get("/fetch-sleep", authMiddleware, fetchSleepHistory);

/**
 * @swagger
 * /api/shealth/sleeprecovery/fetch-onesleep/{recordId}:
 *   get:
 *     summary: Get a single sleep record
 *     description: Retrieve a specific sleep record by ID
 *     tags: [Sleep & Recovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Sleep record ID
 *         example: "507f1f77bcf86cd799439201"
 *     responses:
 *       200:
 *         description: Sleep record retrieved
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
 *                   $ref: "#/components/schemas/SleepRecord"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Record not found"
 *       401:
 *         description: Unauthorized
 */
sleepRouter.get("/fetch-onesleep/:recordId", authMiddleware, fetchSleepRecordById);

/**
 * @swagger
 * /api/shealth/sleeprecovery/update-sleep/{recordId}:
 *   put:
 *     summary: Update a sleep record
 *     description: Update an existing sleep record with auto-regeneration of AI tips
 *     tags: [Sleep & Recovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Sleep record ID
 *         example: "507f1f77bcf86cd799439201"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sleepStart:
 *                 type: string
 *                 pattern: ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
 *                 example: "23:00"
 *               sleepEnd:
 *                 type: string
 *                 pattern: ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
 *                 example: "07:00"
 *               sleepQuality:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 8
 *               notes:
 *                 type: string
 *                 example: "Adjusted sleep schedule"
 *     responses:
 *       200:
 *         description: Sleep record updated
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
 *                   $ref: "#/components/schemas/SleepRecord"
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
sleepRouter.put("/update-sleep/:recordId", authMiddleware, updateSleepRecord);

/**
 * @swagger
 * /api/shealth/sleeprecovery/delete-sleep/{recordId}:
 *   delete:
 *     summary: Delete a sleep record
 *     description: Permanently delete a sleep record
 *     tags: [Sleep & Recovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Sleep record ID
 *         example: "507f1f77bcf86cd799439201"
 *     responses:
 *       200:
 *         description: Sleep record deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               success: true
 *               message: "Sleep record deleted successfully"
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
sleepRouter.delete("/delete-sleep/:recordId", authMiddleware, deleteSleepRecord);

module.exports = { sleepRouter };
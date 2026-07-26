const express = require("express");
const {
  addSelfCare,
  fetchSelfCareActivities,
  updateSelfCare,
  deleteSelfCare,
  fetchAllSelfCareActivities,
} = require("../controllers/selfCare.controller.js");
const { authMiddleware } = require("../../../middleware/auth.middleware.js");

const selfcareRouter = express.Router();

/**
 * @swagger
 * /api/selfhealth/selfcare/add-selfcare:
 *   post:
 *     summary: Add a self-care activity
 *     description: Log a self-care activity with mood tracking and AI-generated insights
 *     tags: [Self-Care]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateSelfCareRequest"
 *           example:
 *             activityType: "meditation"
 *             duration: 15
 *             moodBefore: 4
 *             moodAfter: 7
 *             satisfaction: 8
 *             notes: "Felt calmer after meditation"
 *     responses:
 *       201:
 *         description: Self-care activity logged
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
 *                     activity:
 *                       $ref: "#/components/schemas/SelfCareActivity"
 *                     analysis:
 *                       type: object
 *                     aiInsight:
 *                       type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
selfcareRouter.post("/add-selfcare", authMiddleware, addSelfCare);

/**
 * @swagger
 * /api/selfhealth/selfcare/fetch-selfcare:
 *   get:
 *     summary: Get all self-care activities
 *     description: Retrieve all self-care activities for the authenticated user
 *     tags: [Self-Care]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Self-care activities retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/SelfCareActivity"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
selfcareRouter.get("/fetch-selfcare", authMiddleware, fetchAllSelfCareActivities);

/**
 * @swagger
 * /api/selfhealth/selfcare/fetch-aselfcare/{activitiesId}:
 *   get:
 *     summary: Get a single self-care activity
 *     description: Retrieve a specific self-care activity by ID
 *     tags: [Self-Care]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activitiesId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Self-care activity ID
 *         example: "507f1f77bcf86cd799439301"
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
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/SelfCareActivity"
 *       404:
 *         description: Activity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "activity not found"
 *       401:
 *         description: Unauthorized
 */
selfcareRouter.get("/fetch-aselfcare/:activitiesId", authMiddleware, fetchSelfCareActivities);

/**
 * @swagger
 * /api/selfhealth/selfcare/update-selfcare/{activitiesId}:
 *   put:
 *     summary: Update a self-care activity
 *     description: Update an existing self-care activity with auto-reanalysis and AI tip regeneration
 *     tags: [Self-Care]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activitiesId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Self-care activity ID
 *         example: "507f1f77bcf86cd799439301"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activityType:
 *                 type: string
 *                 enum: ["meditation", "journaling", "sleep", "skinCare", "mindfulness", "reading", "exercise", "music", "nature", "social", "hobby", "relaxation", "self_reflection", "other"]
 *                 example: "journaling"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1440
 *                 example: 30
 *               moodBefore:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 3
 *               moodAfter:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 9
 *               satisfaction:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 9
 *               notes:
 *                 type: string
 *                 example: "Journaling helped process emotions"
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
 *                   $ref: "#/components/schemas/SelfCareActivity"
 *       404:
 *         description: Activity not found or permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Activity not found or you don't have permission to update it"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
selfcareRouter.put("/update-selfcare/:activitiesId", authMiddleware, updateSelfCare);

/**
 * @swagger
 * /api/selfhealth/selfcare/delete-selfcare/{id}:
 *   delete:
 *     summary: Delete a self-care activity
 *     description: Permanently delete a self-care activity
 *     tags: [Self-Care]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$
 *         description: Self-care activity ID
 *         example: "507f1f77bcf86cd799439301"
 *     responses:
 *       200:
 *         description: Activity deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               success: true
 *               message: "Self-care activity deleted successfully"
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
selfcareRouter.delete("/delete-selfcare/:id", authMiddleware, deleteSelfCare);

module.exports = { selfcareRouter };
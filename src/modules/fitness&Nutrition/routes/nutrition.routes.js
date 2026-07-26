const express = require("express");
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { createNutrition, getAllNutrition, getANutrition, updateNutrition, deleteNutrition } = require("../controllers/nutrition.controller");

const nutritionRouter = express.Router();

/**
 * @swagger
 * /api/fitnessnutrition/nutrition/create-nutrition:
 *   post:
 *     summary: Create a nutrition entry
 *     description: Log a meal with detailed nutritional information and AI grading
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateNutritionRequest"
 *           example:
 *             meal: "Grilled Chicken Salad"
 *             calories: 450
 *             protein: 25
 *             carbs: 30
 *             fats: 15
 *             fiber: 8
 *             sugar: 5
 *             mealType: "lunch"
 *             portion: "medium"
 *             notes: "Added extra vegetables"
 *     responses:
 *       201:
 *         description: Nutrition entry created
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
 *                   $ref: "#/components/schemas/NutritionEntry"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Please provide: meal"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
nutritionRouter.post("/create-nutrition", authMiddleware, createNutrition);

/**
 * @swagger
 * /api/fitnessnutrition/nutrition/getall-nutrition:
 *   get:
 *     summary: Get all nutrition entries
 *     description: Retrieve all nutrition entries for the authenticated user
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nutrition entries retrieved
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
 *                     $ref: "#/components/schemas/NutritionEntry"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
nutritionRouter.get("/getall-nutrition", authMiddleware, getAllNutrition);

/**
 * @swagger
 * /api/fitnessnutrition/nutrition/get-nutrition/{activityId}:
 *   get:
 *     summary: Get a single nutrition entry
 *     description: Retrieve a specific nutrition entry by ID
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
 *         description: Nutrition entry ID
 *         example: "507f1f77bcf86cd799439501"
 *     responses:
 *       200:
 *         description: Nutrition entry retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/NutritionEntry"
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Meal not found"
 *       401:
 *         description: Unauthorized
 */
nutritionRouter.get("/get-nutrition/:activityId", authMiddleware, getANutrition);

/**
 * @swagger
 * /api/fitnessnutrition/nutrition/update-nutrition/{id}:
 *   put:
 *     summary: Update a nutrition entry
 *     description: Update an existing nutrition entry
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
 *         description: Nutrition entry ID
 *         example: "507f1f77bcf86cd799439501"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateNutritionRequest"
 *     responses:
 *       200:
 *         description: Nutrition entry updated
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
 *                   $ref: "#/components/schemas/NutritionEntry"
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
nutritionRouter.put("/update-nutrition/:id", authMiddleware, updateNutrition);

/**
 * @swagger
 * /api/fitnessnutrition/nutrition/delete-nutrition/{id}:
 *   delete:
 *     summary: Delete a nutrition entry
 *     description: Permanently delete a nutrition entry
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
 *         description: Nutrition entry ID
 *         example: "507f1f77bcf86cd799439501"
 *     responses:
 *       200:
 *         description: Nutrition entry deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               success: true
 *               message: "Meal deleted successfully"
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Unauthorized
 */
nutritionRouter.delete("/delete-nutrition/:id", authMiddleware, deleteNutrition);

module.exports = { nutritionRouter };
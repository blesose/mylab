const express = require("express");
const { authMiddleware } = require("../../../middleware/auth.middleware");
const {
  searchFoodsController,
  getFoodByIdController,
  getFoodsByCategoryController,
  createCustomFoodController,
  getUserCustomFoodsController,
  calculatePortionController,
} = require("../controllers/food.controller");

const foodRouter = express.Router();

/**
 * @swagger
 * /api/fitnessnutrition/foods/search:
 *   get:
 *     summary: Search for foods
 *     description: Search the food database by name
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (minimum 2 characters)
 *         example: "chicken"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Foods found
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
 *                     $ref: "#/components/schemas/FoodItem"
 *                 count:
 *                   type: integer
 *       400:
 *         description: Search query too short
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Search query must be at least 2 characters"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
foodRouter.get("/search", authMiddleware, searchFoodsController);

/**
 * @swagger
 * /api/fitnessnutrition/foods/category/{category}:
 *   get:
 *     summary: Get foods by category
 *     description: Retrieve foods by category from the database
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [fruits, vegetables, proteins, carbs, fats, dairy, meals, snacks, beverages]
 *         description: Food category
 *         example: "proteins"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Foods retrieved
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
 *                     $ref: "#/components/schemas/FoodItem"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
foodRouter.get("/category/:category", authMiddleware, getFoodsByCategoryController);

/**
 * @swagger
 * /api/fitnessnutrition/foods/{id}:
 *   get:
 *     summary: Get a food by ID
 *     description: Retrieve a specific food item by its ID
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
 *         description: Food ID
 *         example: "507f1f77bcf86cd799439601"
 *     responses:
 *       200:
 *         description: Food retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/FoodItem"
 *       404:
 *         description: Food not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Food not found"
 *       401:
 *         description: Unauthorized
 */
foodRouter.get("/:id", authMiddleware, getFoodByIdController);

/**
 * @swagger
 * /api/fitnessnutrition/foods/custom/my-foods:
 *   get:
 *     summary: Get user's custom foods
 *     description: Retrieve all custom foods created by the authenticated user
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Custom foods retrieved
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
 *                     $ref: "#/components/schemas/FoodItem"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
foodRouter.get("/custom/my-foods", authMiddleware, getUserCustomFoodsController);

/**
 * @swagger
 * /api/fitnessnutrition/foods/custom:
 *   post:
 *     summary: Create a custom food
 *     description: Create a custom food entry for the authenticated user
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - calories
 *               - servingSize
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Protein Shake"
 *               category:
 *                 type: string
 *                 enum: [fruits, vegetables, proteins, carbs, fats, dairy, meals, snacks, beverages, custom]
 *                 example: "proteins"
 *               calories:
 *                 type: integer
 *                 example: 250
 *               protein:
 *                 type: number
 *                 example: 30
 *               carbs:
 *                 type: number
 *                 example: 10
 *               fats:
 *                 type: number
 *                 example: 5
 *               fiber:
 *                 type: number
 *                 example: 3
 *               sugar:
 *                 type: number
 *                 example: 8
 *               servingSize:
 *                 type: string
 *                 example: "1 scoop"
 *               servingUnit:
 *                 type: string
 *                 default: "g"
 *                 example: "g"
 *     responses:
 *       201:
 *         description: Custom food created
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
 *                   $ref: "#/components/schemas/FoodItem"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
foodRouter.post("/custom", authMiddleware, createCustomFoodController);

/**
 * @swagger
 * /api/fitnessnutrition/foods/calculate-portion:
 *   post:
 *     summary: Calculate portion nutrition
 *     description: Calculate nutritional values for a custom portion size
 *     tags: [Fitness & Nutrition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *             properties:
 *               foodId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439601"
 *               portionSize:
 *                 type: number
 *                 example: 150
 *                 description: Portion size in grams or specified unit
 *               servingUnit:
 *                 type: string
 *                 example: "g"
 *                 description: Unit of measurement
 *     responses:
 *       200:
 *         description: Portion nutrition calculated
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
 *                     calories:
 *                       type: integer
 *                     protein:
 *                       type: number
 *                     carbs:
 *                       type: number
 *                     fats:
 *                       type: number
 *                     fiber:
 *                       type: number
 *                     sugar:
 *                       type: number
 *                     portionSize:
 *                       type: number
 *                     servingUnit:
 *                       type: string
 *                     foodName:
 *                       type: string
 *                     servingSize:
 *                       type: string
 *       404:
 *         description: Food not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Food not found"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
foodRouter.post("/calculate-portion", authMiddleware, calculatePortionController);

module.exports = { foodRouter };
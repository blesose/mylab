const express = require("express");
const pregnancyRouter = express.Router();
const { createPregnancy, getPregnancy } = require("../controllers/pregnancy.controller");
const createPregnancyValidator = require("../validators/pregnancy.validator");

/**
 * @swagger
 * /api/females/pregnancy/create-pregnancy:
 *   post:
 *     summary: Create pregnancy tracking record
 *     description: Start tracking a pregnancy with due date, symptoms, and weekly insights
 *     tags: [Women's Health - Pregnancy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreatePregnancyRequest"
 *           example:
 *             userId: "507f1f77bcf86cd799439011"
 *             conceptionDate: "2026-07-01"
 *             dueDate: "2027-04-07"
 *             currentWeek: 8
 *             week: 8
 *             notes: "First trimester symptoms are manageable"
 *             symptoms: ["nausea", "fatigue", "breast tenderness"]
 *             emotion: "Happy and excited"
 *             energyLevel: 6
 *     responses:
 *       201:
 *         description: Pregnancy record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 record:
 *                   $ref: "#/components/schemas/Pregnancy"
 *                 tip:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
pregnancyRouter.post("/create-pregnancy", createPregnancyValidator, createPregnancy);

/**
 * @swagger
 * /api/females/pregnancy/{userId}:
 *   get:
 *     summary: Get pregnancy record with insights
 *     description: Retrieve pregnancy record with trimester insights and AI tips
 *     tags: [Women's Health - Pregnancy]
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
 *         description: Pregnancy record retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 record:
 *                   $ref: "#/components/schemas/Pregnancy"
 *                 insights:
 *                   $ref: "#/components/schemas/PregnancyInsights"
 *                 tip:
 *                   type: string
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
 *       500:
 *         description: Server error
 */
pregnancyRouter.get("/:userId", getPregnancy);

module.exports = pregnancyRouter;
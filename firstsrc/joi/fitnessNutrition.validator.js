const Joi = require("joi");

const fitnessNutritionValidator = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId validation
    .messages({
      "any.required": "userId is required",
      "string.pattern.base": "Invalid userId format (must be ObjectId)",
    }),

  workoutTypes: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "workoutTypes must be text",
    "string.min": "workoutTypes must be at least 3 characters",
    "string.max": "workoutTypes cannot exceed 100 characters",
    "any.required": "workoutTypes is required",
  }),

  durationMinutes: Joi.number().min(0).required().messages({
    "number.base": "durationMinutes must be a number",
    "number.min": "durationMinutes cannot be negative",
    "any.required": "durationMinutes is required",
  }),

  caloriesBurned: Joi.number().min(0).optional().messages({
    "number.base": "caloriesBurned must be a number",
    "number.min": "caloriesBurned cannot be negative",
  }),

  mealType: Joi.string()
    .valid("breakfast", "lunch", "dinner", "snack")
    .required()
    .messages({
      "any.only": "mealType must be one of: breakfast, lunch, dinner, snack",
      "any.required": "mealType is required",
    }),

  caloriesConsumed: Joi.number().min(0).required().messages({
    "number.base": "caloriesConsumed must be a number",
    "number.min": "caloriesConsumed cannot be negative",
    "any.required": "caloriesConsumed is required",
  }),
});

module.exports = { fitnessNutritionValidator };

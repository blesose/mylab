const Joi = require("joi");

const mentalHealthValidator = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid userId format (must be ObjectId)",
      "any.required": "userId is required",
    }),

  mood: Joi.string()
    .valid("happy", "sad", "anxious", "stressed", "neutral", "angry", "excited")
    .required()
    .messages({
      "any.only": "Invalid mood selected",
      "any.required": "mood is required",
    }),

  checkInNote: Joi.string().trim().max(500).messages({
    "string.max": "checkInNote cannot exceed 500 characters",
  }),

  category: Joi.string()
    .valid("therapy", "meditation", "daily-checkin", "journal", "tips")
    .required()
    .messages({
      "any.only": "Invalid category selected",
      "any.required": "category is required",
    }),

  severityLevel: Joi.number().integer().min(1).max(10).default(5).messages({
    "number.base": "severityLevel must be a number",
    "number.min": "severityLevel must be at least 1",
    "number.max": "severityLevel cannot exceed 10",
  }),

  tags: Joi.array().items(Joi.string().trim()).default([]),
});

module.exports = { mentalHealthValidator };

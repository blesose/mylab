const Joi = require("joi");

// Validator for creating a comment
const commentValidator = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid userId format (must be ObjectId)",
      "any.required": "userId is required",
    }),

  refType: Joi.string()
    .valid(
      "FemaleHealthTip",
      "MaleHealthTip",
      "MentalHealthTip",
      "FitnessNutrition",
      "HealthLog",
      "SelfCare",
      "LabInsights",
      "Other"
    )
    .required()
    .messages({
      "any.only": "Invalid reference type",
      "any.required": "refType is required",
    }),

  refId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid refId format (must be ObjectId)",
      "any.required": "refId is required",
    }),

  content: Joi.string().trim().min(1).max(500).required().messages({
    "string.base": "content must be text",
    "string.min": "content cannot be empty",
    "string.max": "content cannot exceed 500 characters",
    "any.required": "content is required",
  }),
});

// Validator for adding a reply
const replyValidator = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid userId format (must be ObjectId)",
      "any.required": "userId is required",
    }),

  content: Joi.string().trim().min(1).max(300).required().messages({
    "string.base": "Reply must be text",
    "string.min": "Reply cannot be empty",
    "string.max": "Reply cannot exceed 300 characters",
    "any.required": "Reply is required",
  }),
});

module.exports = { commentValidator, replyValidator };

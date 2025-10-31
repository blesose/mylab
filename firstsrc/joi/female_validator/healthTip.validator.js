const Joi = require("joi");

const healthTipValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
  }),

  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "title must be text",
    "string.min": "title must be at least 3 characters",
    "string.max": "title cannot exceed 100 characters",
    "any.required": "title is required",
  }),

  content: Joi.string().trim().required().messages({
    "string.base": "content must be text",
    "any.required": "content is required",
  }),

  category: Joi.string()
    .valid("menstrual", "pregnancy", "heavy_flow", "general", "mental", "nutrition")
    .required()
    .messages({
      "any.only": "category must be one of: menstrual, pregnancy, general, mental, nutrition",
      "any.required": "category is required",
    }),
});

module.exports = { healthTipValidator };


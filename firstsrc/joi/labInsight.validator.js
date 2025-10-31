const Joi = require("joi");

const labInsightValidator = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid userId format (must be a valid ObjectId)",
      "any.required": "userId is required",
    }),

  insightType: Joi.string()
    .valid("health", "nutrition", "mental", "fitness", "selfCare")
    .required()
    .messages({
      "any.only": "insightType must be one of: health, nutrition, mental, fitness, selfCare",
      "any.required": "insightType is required",
    }),

  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.min": "title must be at least 3 characters",
    "string.max": "title cannot exceed 150 characters",
    "any.required": "title is required",
  }),

  message: Joi.string().trim().min(5).max(1000).required().messages({
    "string.min": "message must be at least 5 characters",
    "string.max": "message cannot exceed 1000 characters",
    "any.required": "message is required",
  }),

  source: Joi.string()
    .valid("system", "coach", "ai_chatbot")
    .default("system")
    .messages({
      "any.only": "source must be one of: system, coach, ai_chatbot",
    }),

  tags: Joi.array()
    .items(Joi.string().trim().max(30))
    .messages({
      "array.base": "tags must be an array of strings",
      "string.max": "Each tag cannot exceed 30 characters",
    }),

  readStatus: Joi.string()
    .valid("unread", "read")
    .default("unread")
    .messages({
      "any.only": "readStatus must be either 'unread' or 'read'",
    }),
});

module.exports = { labInsightValidator };

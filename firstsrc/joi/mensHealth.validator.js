const Joi = require("joi");

const mensHealthValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
    "any.required": "userId is required",
  }),

  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Title must be text",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),

  content: Joi.string().trim().required().messages({
    "string.base": "Content must be text",
    "any.required": "Content is required",
  }),

  category: Joi.string()
    .valid("fitness", "mental", "nutrition", "sexual", "general", "prostate")
    .required()
    .messages({
      "any.only":
        "Category must be one of: fitness, mental, nutrition, sexual, general, prostate",
      "any.required": "Category is required",
    }),

  tags: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Tags must be an array of strings",
  }),
});

module.exports = { mensHealthValidator };
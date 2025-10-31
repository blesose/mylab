const Joi = require("joi");

const selfCareValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
  }),

  activityType: Joi.string()
    .valid(
      "meditation",
      "journaling",
      "yoga",
      "exercise",
      "reading",
      "spa",
      "hobby",
      "sleep",
      "digital_detox",
      "other"
    )
    .required()
    .messages({
      "any.only": "activityType must be one of the predefined values",
      "any.required": "activityType is required",
    }),

  description: Joi.string().trim().max(500).messages({
    "string.max": "description cannot exceed 500 characters",
  }),

  durationMinutes: Joi.number().integer().min(1).max(1440).messages({
    "number.min": "duration must be at least 1 minute",
    "number.max": "duration cannot exceed 1440 minutes (24 hours)",
  }),

  moodBefore: Joi.string().valid(
    "happy",
    "neutral",
    "sad",
    "stressed",
    "anxious",
    "tired"
  ),

  moodAfter: Joi.string().valid(
    "happy",
    "neutral",
    "sad",
    "stressed",
    "anxious",
    "tired"
  ),

  effectivenessRating: Joi.number().integer().min(1).max(5).messages({
    "number.min": "effectiveness rating must be at least 1",
    "number.max": "effectiveness rating cannot exceed 5",
  }),

  reminder: Joi.object({
    enabled: Joi.boolean().default(false),
    time: Joi.date(),
    repeat: Joi.string().valid("none", "daily", "weekly", "monthly").default("none"),
  }),

  tags: Joi.array().items(Joi.string().trim()),

  notes: Joi.string().trim().max(300).messages({
    "string.max": "notes cannot exceed 300 characters",
  }),
});

module.exports = { selfCareValidator };

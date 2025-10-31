const Joi = require("joi");

const notificationValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
    "any.required": "userId is required",
  }),

  type: Joi.string().valid("reminder", "alert", "system").required().messages({
    "any.only": "Notification type must be reminder, alert, or system",
    "any.required": "Notification type is required",
  }),

  message: Joi.string().trim().min(3).max(500).required().messages({
    "string.base": "Message must be text",
    "string.min": "Message must be at least 3 characters",
    "string.max": "Message cannot exceed 500 characters",
    "any.required": "Message is required",
  }),

  scheduledAt: Joi.date().optional().allow(null),

  status: Joi.string().valid("pending", "sent", "failed").optional(),

  read: Joi.boolean().optional(),
});

module.exports = { notificationValidator };

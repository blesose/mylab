const Joi = require("joi");

const pregnancyValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
  }),
  expectedDeliveryDate: Joi.date().required().messages({
    "date.base": "expectedDeliveryDate must be a valid date",
    "any.required": "expectedDeliveryDate is required",
  }),
  trimester: Joi.number().integer().min(1).max(3).required().messages({
    "number.base": "trimester must be a number",
    "number.min": "trimester must be at least 1",
    "number.max": "trimester cannot be more than 3",
    "any.required": "trimester is required",
  }),
  notes: Joi.string().trim().optional(),
});

module.exports = { pregnancyValidator };

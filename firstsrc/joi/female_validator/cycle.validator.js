const Joi = require("joi");

const cycleValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Invalid userId format (must be ObjectId)",
  }),
  cycleStartDate: Joi.date().required().messages({
    "date.base": "cycleStartDate must be a valid date",
    "any.required": "cycleStartDate is required",
  }),
  cycleEndDate: Joi.date().required().messages({
    "date.base": "cycleEndDate must be a valid date",
    "any.required": "cycleEndDate is required",
  }),
  symptoms: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "symptoms must be an array of strings",
  }),
  mood: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
});

module.exports = { cycleValidator };

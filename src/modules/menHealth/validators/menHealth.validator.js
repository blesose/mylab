const Joi = require("joi");

const createRecordValidator = (req, res, next) => {
  const schema = Joi.object({
    exerciseFrequency: Joi.string()
      .valid("none", "rarely", "weekly", "daily")
      .optional(),
    sleepHours: Joi.number().min(0).max(24).optional(),
    stressLevel: Joi.number().min(0).max(10).optional(),
    prostateCheck: Joi.boolean().optional(),
    testosteroneLevel: Joi.number().min(0).optional(),
    sexualHealthConcerns: Joi.string().max(1000).optional().allow(""),
    energyLevel: Joi.number().min(0).max(10).optional(),
    notes: Joi.string().max(2000).optional().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = { createRecordValidator };
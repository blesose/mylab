const Joi = require("joi");

const createRecordValidator = (req, res, next) => {
  const schema = Joi.object({

    stressLevel: Joi.number().min(0).max(10).optional(),
    sleepHours: Joi.number().min(0).max(24).optional(),
    workoutDays: Joi.number().min(0).max(7).optional(),
    energyLevel: Joi.number().min(0).max(10).optional(),
   
    age: Joi.number().min(18).max(100).optional(),
    prostateCheck: Joi.boolean().optional(),
    testosteroneLevel: Joi.number().min(0).max(100).optional(),
    sexualHealthConcerns: Joi.string().max(1000).optional().allow(""),
    notes: Joi.string().max(2000).optional().allow(""),
    condition: Joi.string().optional(),
    description: Joi.string().optional(),
    date: Joi.date().optional().default(Date.now),
    
    exerciseFrequency: Joi.string()
      .valid("none", "rarely", "weekly", "daily")
      .optional(),
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
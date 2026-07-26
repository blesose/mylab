const Joi = require("joi");

const createPregnancyValidator = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    conceptionDate: Joi.date().required(),
     week: Joi.number().min(1).max(42).required(),
     dueDate: Joi.date().required(),
    currentWeek: Joi.number().min(1).max(42).required(),
    notes: Joi.string().allow("").optional(),
    symptoms: Joi.array().items(Joi.string()).default([]),
    emotion: Joi.string().allow("").optional(),
    energyLevel: Joi.number().min(1).max(10).optional(),
    timestamp: Joi.date().default(Date.now),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next(); 
};

module.exports = createPregnancyValidator;
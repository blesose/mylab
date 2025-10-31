const Joi = require("joi");

const createOvulationValidator = (req, res, next) => { 
const schema = Joi.object({
  userId: Joi.string().required(),
  cycleStart: Joi.date().required(),
  cycleLength: Joi.number().min(20).max(40).default(28),
  notes: Joi.string().allow("").optional(),
});

const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = { createOvulationValidator };

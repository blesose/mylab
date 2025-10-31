const Joi = require("joi");

const validateCycle = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notes: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = { validateCycle }

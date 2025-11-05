// src/modules/sleep/validators/sleep.validator.js
const Joi = require("joi");

const sleepValidator = (req, res, next) => {
  const schema = Joi.object({
    // date: Joi.date().required(),
    sleepStart: Joi.string().required(),
    sleepEnd: Joi.string().required(),
    sleepQuality: Joi.number().min(1).max(10),
    notes: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

module.exports = { sleepValidator };

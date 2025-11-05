const Joi = require("joi");

const createPregnancyValidator = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    conceptionDate: Joi.date().required(),
    notes: Joi.string().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next(); // ✅ Important: pass control to controller
};

module.exports = createPregnancyValidator;
const Joi = require("joi");

const fitnessValidator = (req, res, next) => {
const schema = Joi.object({
  activityType: Joi.string().required(),
  duration: Joi.number().min(10).required(),
  intensity: Joi.string().valid("low", "medium", "high").required(),
  frequency: Joi.number().min(1).max(7).required(),
});

const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};
module.exports = { fitnessValidator };

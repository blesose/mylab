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
// const Joi = require("joi");

// const createPlanValidator = Joi.object({
//   goal: Joi.string().valid("weight_loss", "muscle_gain", "maintenance").required(),
//   activityLevel: Joi.string().valid("low", "moderate", "high").required(),
//   dietaryPreference: Joi.string().valid("vegan", "vegetarian", "non_vegetarian").required(),
// });

// module.exports = { createPlanValidator };

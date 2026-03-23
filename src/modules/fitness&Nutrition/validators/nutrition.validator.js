const Joi = require("joi");

const nutritionValidator = (req, res, next) => {
const schema = Joi.object({
  calories: Joi.number().required(),
  protein: Joi.number().required(),
  sugar: Joi.number().required(),
  fiber: Joi.number().required(),
  mealType: Joi.string().valid("breakfast", "lunch", "dinner", "snack").required(),
});

const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};
module.exports = { nutritionValidator };

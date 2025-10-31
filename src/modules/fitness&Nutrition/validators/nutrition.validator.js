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
// // src/modules/femaleHealth/fitnessNutrition/validators/nutrition.validator.js
// const Joi = require("joi");

// const createMealPlanValidator = Joi.object({
//   userId: Joi.string().required(),
//   sex: Joi.string().valid("female","male").required(),
//   weightKg: Joi.number().positive().required(),
//   heightCm: Joi.number().positive().required(),
//   age: Joi.number().integer().min(13).required(),
//   activityLevel: Joi.string().valid("low","moderate","high").default("moderate"),
//   goal: Joi.string().valid("weight_loss","muscle_gain","maintenance").required(),
//   dietaryPreference: Joi.string().valid("vegan","vegetarian","non_vegetarian").default("non_vegetarian"),
//   allergies: Joi.array().items(Joi.string()).optional(),
//   mealsPerDay: Joi.number().min(1).max(6).default(3),
// });

// module.exports = { createMealPlanValidator };

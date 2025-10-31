const Joi = require("joi");

const createInsightValidator = 
Joi.object({
  category: Joi.string()
    .valid("femaleHealth", "sleepRecovery", "menHealth", "fitness", "nutrition", "selfCare", "community")
    .required(),
  data: Joi.array().items(Joi.number()).required()
});

module.exports = { createInsightValidator };
// src/modules/mentalHealth/validators/mentalHealth.validator.js
const Joi = require("joi");

const logEntrySchema = Joi.object({
  userId: Joi.string().required(),
  moodType: Joi.string().valid("happy","sad","stressed","anxious","neutral","calm").required(),
  score: Joi.number().min(0).max(10).optional(),
  notes: Joi.string().max(1000).allow("").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

module.exports = { logEntrySchema };



// const Joi = require("joi");

// const createMentalHealthEntryValidator = Joi.object({
//   moodType: Joi.string()
//     .valid("happy", "sad", "stressed", "anxious", "calm", "neutral")
//     .required(),
//   notes: Joi.string().max(500).allow(""),
// });

// module.exports = { createMentalHealthEntryValidator };

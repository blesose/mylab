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
// src/modules/sleep/validators/sleep.validator.js
// const Joi = require("joi");

// const sleepSchema = Joi.object({
//   // userId: Joi.string().required(),
//   // date: Joi.date().required(),
//   sleepStart: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:mm
//   sleepEnd: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),   // HH:mm
//   sleepQuality: Joi.number().min(1).max(10).optional(),
//   notes: Joi.string().allow("").optional(),
// });

// const sleepValidator = (req, res, next) => {
//   const { error, value } = sleepSchema.validate(req.body, { abortEarly: false });
//   if (error) {
//     return res.status(400).json({ success: false, message: error.details[0].message });
//   }
//   // attach cleaned value if you want
//   req.validatedBody = value;
//   return next();
// };

// module.exports = { sleepValidator };
// const Joi =require("joi");

//  const sleepValidator =  (req, res, next) => {
//  const schema = Joi.object({
//   userId: Joi.string().required(),
//   date: Joi.date().required(),
//   sleepStart: Joi.string().required(),
//   sleepEnd: Joi.string().required(),
//   sleepQuality: Joi.number().min(1).max(10),
//   notes: Joi.string().allow(""),
// });
// const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ success: false, message: error.details[0].message });
//   }
//   next();
// };
// module.exports = { sleepValidator };
// const sleepValidator =  Joi.object({
//   userId: Joi.string().required(),
//   date: Joi.date().required(),
//   sleepStart: Joi.string().required(),
//   sleepEnd: Joi.string().required(),
//   sleepQuality: Joi.number().min(1).max(10),
//   notes: Joi.string().allow(""),
// });


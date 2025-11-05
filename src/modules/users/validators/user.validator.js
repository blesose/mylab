const Joi = require("joi");

const signupValidator = Joi.object({
  name: Joi.string().min(3).max(50).required(), 
  userName: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(11).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female", "other"),
  dob: Joi.date().optional(),
  role: Joi.string().valid("user", "admin").default("user"),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { signupValidator, loginValidator };

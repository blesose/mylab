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

// const Joi = require("joi");

// // Signup Validator
// const signupValidator = Joi.object({
//   name: Joi.string().trim().min(3).max(50).required().messages({
//     "string.base": "Name must be text",
//     "string.empty": "Name is required",
//     "string.min": "Name must be at least 3 characters",
//     "string.max": "Name cannot exceed 50 characters",
//     "any.required": "Name is required",
//   }),

//   email: Joi.string().trim().lowercase().email().required().messages({
//     "string.email": "Must be a valid email address",
//     "string.empty": "Email is required",
//     "any.required": "Email is required",
//   }),

//   password: Joi.string()
//     .min(8)
//     .max(100)
//     .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
//     .required()
//     .messages({
//       "string.min": "Password must be at least 8 characters",
//       "string.pattern.base": "Password must include at least one letter, one number, and one special character",
//       "any.required": "Password is required",
//     }),

//   gender: Joi.string().valid("female", "male", "other").required().messages({
//     "any.only": "Gender must be 'female', 'male', or 'other'",
//     "any.required": "Gender is required",
//   }),

//   dob: Joi.date().less("now").required().messages({
//     "date.base": "Date of birth must be a valid date",
//     "date.less": "Date of birth must be in the past",
//     "any.required": "Date of birth is required",
//   }),

//   role: Joi.string().valid("user", "admin", "coach").default("user"),
// });

// // Login Validator
// const loginValidator = Joi.object({
//   email: Joi.string().trim().lowercase().email().required().messages({
//     "string.email": "Must be a valid email address",
//     "string.empty": "Email is required",
//     "any.required": "Email is required",
//   }),

//   password: Joi.string().required().messages({
//     "string.empty": "Password is required",
//     "any.required": "Password is required",
//   }),
// });

// module.exports = { signupValidator, loginValidator };

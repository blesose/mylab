const express = require("express");
const { signupValidator, loginValidator } = require("../joi/user.validator");   // Joi schema
const { register, loginUser } = require("../controllers/user.controller"); // Controller
const { validate } = require("../middleware/validate"); // ✅ Correct middleware

const userRouter = express.Router();

// Register route
userRouter.post("/reg", validate(signupValidator), register);
userRouter.post("/login", validate(loginValidator), loginUser);

// Test route
userRouter.get("/", (req, res) => {
  res.json({
    data: true,
    message: "Welcome to MyLab userRouter 🚀"
  });
});

module.exports = userRouter;

// const express = require("express");
// // const { validate } = require("uuid");
// const { signupValidator } = require("../joi/user.validator");
// const { register } = require("../controllers/user.controller");
// const { validate } = require("../models/user.schema");
// // const {register, updateProfile, loginUser, getProfile, deleteUser }= require("../controllers/user.controller");
// // const signupValidator = require

// const userRouter = express.Router();

// // userRouter.route("/reg").post (validate(signupValidator, register));
// // userRouter.post("/reg", validate(addUserValidator), register);
// userRouter.post("/register", validate(signupValidator), register)
// userRouter.get("/", (req, res) => {
//     res.json({
//         data: true,
//         message: "welcome to MyLab userRouter"
//     })
// });
  
// module.exports = userRouter;
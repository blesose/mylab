const express = require("express");
const pregnancyRouter = express.Router();
const { createPregnancy, getPregnancy } = require("../controllers/pregnancy.controller");
const createPregnancyValidator = require("../validators/pregnancy.validator");

pregnancyRouter.post("/create-pregnancy", createPregnancyValidator, createPregnancy);
pregnancyRouter.get("/:userId", getPregnancy);

module.exports = pregnancyRouter;

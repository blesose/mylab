const express = require("express");
const pregnancyRouter = express.Router();
const { createPregnancy, getPregnancy } = require("../controllers/pregnancy.controller");
const createPregnancyValidator = require("../validators/pregnancy.validator");

// @route   POST /api/femaleHealth/pregnancy
// @desc    Create new pregnancy record
// @access  Private
pregnancyRouter.post("/create-pregnancy", createPregnancyValidator, createPregnancy);

// @route   GET /api/femaleHealth/pregnancy/:userId
// @desc    Get pregnancy record + insights
// @access  Private
pregnancyRouter.get("/:userId", getPregnancy);

module.exports = pregnancyRouter;

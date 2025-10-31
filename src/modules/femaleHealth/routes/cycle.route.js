const express = require("express");
const { validateCycle } = require("../validators/cycle.validator");
const { createCycle, getCycles } = require("../controllers/cycle.controller");
const cycleRouter = express.Router();


cycleRouter.post("/create-cycle", validateCycle, createCycle);
cycleRouter.get("/:userId", getCycles);

module.exports = cycleRouter;


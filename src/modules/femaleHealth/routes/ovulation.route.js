const express = require("express");

const { createOvulationEntry, getOvulationHistory } = require("../controllers/ovulation.controller");
const { createOvulationValidator } = require("../validators/ovulation.validator");
const ovulationRouter = express.Router();

ovulationRouter.post("/create-ovulation", createOvulationValidator, createOvulationEntry);
ovulationRouter.get("/:userId", getOvulationHistory);

module.exports = ovulationRouter;
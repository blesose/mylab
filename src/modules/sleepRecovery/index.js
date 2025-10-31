const express = require("express");
const { sleepRouter } = require("./routes/sleep.routes");

const SleepIndexRouter = express.Router();

SleepIndexRouter.use("/sleeprecovery", sleepRouter);

module.exports = { SleepIndexRouter }

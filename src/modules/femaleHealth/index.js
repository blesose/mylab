const express = require("express");
const cycleRouter = require("./routes/cycle.route");
const ovulationRouter = require("./routes/ovulation.route");
const pregnancyRouter = require("./routes/pregnancy.route");
const femaleRouter = express.Router();

// const cycleRouter = require("./routes/cycle.route");
// const ovulationRouter = require("./routes/ovulation.route");
// const pregnancyRouter = require("./routes/pregnancy.route");

femaleRouter.use("/cycle", cycleRouter);
femaleRouter.use("/ovulation", ovulationRouter);
femaleRouter.use("/pregnancy", pregnancyRouter);

module.exports = femaleRouter;

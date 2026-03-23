const express = require("express");
const { labinsightRouter } = require("./routes/labInsights.routes");
const labinsightsIndexRouter = express.Router();

labinsightsIndexRouter.use("/lab", labinsightRouter);
module.exports = { labinsightsIndexRouter };

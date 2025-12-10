const express = require("express");
const { selfcareRouter } = require("./routes/selfCare.routes");
const selfCareIndexRouter = express.Router();

selfCareIndexRouter.use("/selfcare", selfcareRouter);

module.exports = { selfCareIndexRouter };
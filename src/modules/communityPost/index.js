const express = require("express");
const { commmunitypostRouter } = require("./routes/communityPost.routes");

const communityPostIndexRouter = express.Router();

communityPostIndexRouter.use("/community", commmunitypostRouter);

module.exports = { communityPostIndexRouter };

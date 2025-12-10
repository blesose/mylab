const express = require("express");

const menhealthRouter = require("./routes/menHealth.route");

const mensHealthRouter = express.Router();
mensHealthRouter.use("/menhealth",menhealthRouter);

module.exports = { mensHealthRouter }

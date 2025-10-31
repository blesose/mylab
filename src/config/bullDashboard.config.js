/**
 * 🧠 MyLab Bull Board Dashboard
 * Visual monitor for Bull queues
 */

const express = require("express");
const { router, setQueues, BullAdapter } = require("bull-board");
const basicAuth = require("express-basic-auth");
const { queues } = require("./bull.config");

const dashboardRouter = express.Router();

// Convert all active queues to Bull Board adapters
const adapters = Object.values(queues).map((q) => new BullAdapter(q));
setQueues(adapters);

// Optional: Secure dashboard with username/password
dashboardRouter.use(
  basicAuth({
    users: { admin: process.env.BULLBOARD_USER || "admin" },
    challenge: true,
    realm: "MyLab Bull Board",
  })
);

// Mount Bull Board dashboard
dashboardRouter.use("/bull-board", router);

module.exports = { dashboardRouter };

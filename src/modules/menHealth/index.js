// src/modules/menHealth/index.js
const express = require("express");
const menhealthRouter = require("./routes/menHealth.route");
// const { menHealthQueue } = require("./queues/menHealth.queue");
// const { startMenHealthScheduler } = require("./schedulers/menHealth.scheduler");

const mensHealthRouter = express.Router();

// Load routes
mensHealthRouter.use("/menhealth",menhealthRouter);

// Start background scheduler
// startMenHealthScheduler();

// Queue monitoring
// menHealthQueue.on("completed", (job) => {
//   console.log(`✅ menHealth job completed: ${job.name} [${job.id}]`);
// });

// menHealthQueue.on("failed", (job, err) => {
//   console.error(`❌ menHealth job failed: ${job.name} [${job.id}] – ${err.message}`);
// });

module.exports = { mensHealthRouter }

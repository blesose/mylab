// src/modules/mentalHealth/index.js
const router = require("./routes/mentalHealth.routes");
const { scheduleWeeklySummariesForOptedUsers } = require("./schedulers/mentalHealth.scheduler");

module.exports = { router, scheduleWeeklySummariesForOptedUsers };

const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // date: { type: Date, required: true },
  sleepStart: { type: String, required: true }, // "22:30"
  sleepEnd: { type: String, required: true },   // "06:30"
  sleepQuality: { type: Number, min: 1, max: 10, default: 5 },
  notes: { type: String },
  aiTip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("SleepRecord", sleepSchema);

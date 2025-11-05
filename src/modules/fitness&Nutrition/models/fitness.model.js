const mongoose = require("mongoose");

const fitnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityType: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  frequency: { type: Number, default: 3 },
  grade: { type: String },
  aiTip: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fitness", fitnessSchema);

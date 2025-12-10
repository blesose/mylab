const mongoose = require("mongoose");

const selfCareSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityType: {
    type: String,
    enum: ["meditation", "journaling", "sleep", "skinCare", "mindfulness", "other"],
    required: true,
  },
  duration: { type: Number, required: true }, // in minutes
  moodBefore: { type: String, enum: ["happy", "neutral", "sad", "stressed", "tired"], default: "neutral" },
  moodAfter: { type: String, enum: ["happy", "neutral", "sad", "stressed"], default: "neutral" },
  notes: { type: String },
  aiTip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("SelfCare", selfCareSchema);
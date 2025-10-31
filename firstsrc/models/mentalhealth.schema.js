const mongoose = require("mongoose");

const mentalHealthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    mood: {
      type: String,
      enum: ["happy", "sad", "anxious", "stressed", "neutral", "angry", "excited"],
      required: true,
    },
    checkInNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ["therapy", "meditation", "daily-checkin", "journal", "tips"],
      required: true,
    },
    severityLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5, // 1 = very low, 10 = very high
    },
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentalHealth", mentalHealthSchema);

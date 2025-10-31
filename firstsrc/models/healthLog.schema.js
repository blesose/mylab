const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    logType: {
      type: String,
      enum: [
        "femaleHealth",
        "mensHealth",
        "mentalHealth",
        "selfCare",
        "fitnessNutrition",
      ],
      required: true,
    },
    mood: {
      type: String,
      enum: ["happy", "neutral", "sad", "stressed", "anxious", "energetic"],
      default: "neutral",
    },
    details: {
      type: mongoose.Schema.Types.Mixed, 
      required: true,
      // This allows flexible JSON object:
      // Example for femaleHealth: { cycleStartDate, cycleEndDate, symptoms }
      // Example for fitness: { workoutTypes, durationMinutes, caloriesBurned }
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthLog", healthLogSchema);

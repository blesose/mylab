const mongoose = require("mongoose");

const fitnessNutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutTypes: {
      type: String,
      trim: true,
      required: true,
    },

    durationMinutes: {
      type: Number,
      min: 0,
      required: true,
    },

    caloriesBurned: {
      type: Number,
      min: 0,
      default: 0,
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },

    caloriesConsumed: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const FitnessNutrition = mongoose.model(
  "FitnessNutrition",
  fitnessNutritionSchema
);

module.exports = FitnessNutrition;

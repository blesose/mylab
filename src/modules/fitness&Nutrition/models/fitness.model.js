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
// const mongoose = require("mongoose");

// const fitnessNutritionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   goal: { type: String, enum: ["weight_loss", "muscle_gain", "maintenance"], required: true },
//   activityLevel: { type: String, enum: ["low", "moderate", "high"], default: "moderate" },
//   dietaryPreference: { type: String, enum: ["vegan", "vegetarian", "non_vegetarian"], default: "non_vegetarian" },
//   caloriesTarget: { type: Number },
//   dailyMeals: [{ type: String }],
//   exercisePlan: [{ type: String }],
//   aiTip: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("FitnessNutrition", fitnessNutritionSchema);

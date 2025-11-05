// src/models/nutrition.model.js
const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  sugar: { type: Number, required: true },
  fiber: { type: Number, required: true },
  mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
  grade: { type: String },
  aiTip: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Nutrition", nutritionSchema);

const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meal: { type: String, required: true, trim: true },
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, default: 0, min: 0 },
  carbs: { type: Number, default: 0, min: 0 },
  fats: { type: Number, default: 0, min: 0 },
  fiber: { type: Number, default: 0, min: 0 },
  sugar: { type: Number, default: 0, min: 0 },
  mealType: { 
    type: String, 
    enum: ["breakfast", "lunch", "dinner", "snack"], 
    required: true 
  },
  portion: { 
    type: String, 
    enum: ["small", "medium", "large"],
    default: "medium"
  },
  notes: { type: String, default: "", trim: true },
  grade: { type: String },
  aiTip: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Add index for faster queries
nutritionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Nutrition", nutritionSchema);
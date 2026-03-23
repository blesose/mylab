const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { 
    type: String, 
    enum: ["fruits", "vegetables", "proteins", "carbs", "fats", "dairy", "meals", "snacks", "beverages", "custom"],
    default: "custom"
  },
  calories: { type: Number, required: true }, // per serving
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  servingSize: { type: String, required: true }, // e.g., "100g", "1 medium", "1 slice"
  servingUnit: { type: String, default: "g" },
  isCommon: { type: Boolean, default: true },
  isCustom: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for custom foods
  image: { type: String }, // optional food image URL
  createdAt: { type: Date, default: Date.now },
});

// Index for search
foodSchema.index({ name: "text" });

module.exports = mongoose.model("Food", foodSchema);
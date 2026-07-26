const mongoose = require("mongoose");
const fitnessSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  activityType: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true,
    min: 10
  },
  intensity: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  frequency: { 
    type: Number, 
    default: 3,
    min: 1,
    max: 7
  },
  goal: { 
    type: String,
    enum: ["weight_loss", "muscle_gain", "endurance", "flexibility", "general_health"],
    required: true
  },
  grade: { 
    type: String,
    enum: ["A", "B", "C", "D", "F"]
  },
  aiTip: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Fitness", fitnessSchema);
const mongoose = require("mongoose");
const cycleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notes: { type: String, default: "" },
    
    // Add these new fields
    flowLevel: { 
      type: String, 
      enum: ['light', 'medium', 'heavy'],
      default: 'medium' 
    },
    symptoms: [{ 
      type: String 
    }],
    mood: { 
      type: String,
      enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad', 'anxious', 'irritable'],
      default: 'neutral'
    },
    energyLevel: {
      type: String,
      enum: ['very-high', 'high', 'medium', 'low', 'very-low'],
      default: 'medium'
    },
    crampsIntensity: {
      type: String,
      enum: ['none', 'mild', 'moderate', 'severe', 'debilitating'],
      default: 'none'
    },
    flowConsistency: {
      type: String,
      enum: ['normal', 'clotty', 'watery', 'spotting'],
      default: 'normal'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cycle", cycleSchema);
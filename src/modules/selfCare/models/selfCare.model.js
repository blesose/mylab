const mongoose = require("mongoose");
const selfCareSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  activityType: {
    type: String,
    enum: [
      "meditation", 
      "journaling", 
      "sleep", 
      "skinCare", 
      "mindfulness", 
      "other",
      // Add your frontend values
      "reading",
      "exercise", 
      "music",
      "nature",
      "social",
      "hobby",
      "relaxation",
      "self_reflection"
    ],
    required: true,
  },
  
  activity: {  // Add this field to store the activity name
    type: String,
    required: false, // Optional if you want to keep it
  },
  
  duration: { 
    type: Number, 
    required: true,
    min: 1,
    max: 1440 // 24 hours in minutes
  },
  
  // Change mood fields to accept numbers 1-10
  moodBefore: { 
    type: Number, 
    min: 1, 
    max: 10, 
    default: 5 
  },
  
  moodAfter: { 
    type: Number, 
    min: 1, 
    max: 10, 
    default: 5 
  },
  
  satisfaction: { // Add this field if your frontend uses it
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  
  notes: { 
    type: String 
  },
  
  aiTip: { 
    type: String 
  },
  
}, { timestamps: true });

module.exports = mongoose.model("SelfCare", selfCareSchema);
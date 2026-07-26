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
  
  activity: {  
    type: String,
    required: false, 
  },
  
  duration: { 
    type: Number, 
    required: true,
    min: 1,
    max: 1440 
  },
  
 
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
  
  satisfaction: { 
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
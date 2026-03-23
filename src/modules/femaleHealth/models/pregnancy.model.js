const mongoose = require("mongoose");

const pregnancySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conceptionDate: { type: Date, required: true },
  week: { type: Number, min: 1, max: 42 },
  notes: String,
  symptoms: [String],
  emotion: String,
  energyLevel: Number,
  dueDate: { type: Date, required: true },
  currentWeek: { type: Number, required: true },
   
}, 
{ timestamps: true });

module.exports = mongoose.model("Pregnancy", pregnancySchema);

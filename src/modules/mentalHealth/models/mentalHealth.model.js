// src/modules/mentalHealth/models/mentalHealth.model.js
const mongoose = require("mongoose");

const mentalHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  moodType: { type: String, enum: ["happy","sad","stressed","anxious","neutral","calm"], required: true },
  score: { type: Number, min: 0, max: 10 }, // optional numeric mood score
  notes: { type: String },
  tags: [String],
  aiInsight: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("MentalHealth", mentalHealthSchema);
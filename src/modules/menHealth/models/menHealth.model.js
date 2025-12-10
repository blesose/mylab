const mongoose = require("mongoose");
const menHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  condition: String,
  description: String,
  date: Date,
  aiTip: String,
  analysis: {
    insights: [
      {
        metric: String,
        value: String
      }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model("MenHealth", menHealthSchema);

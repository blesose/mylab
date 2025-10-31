// const mongoose = require("mongoose");

// const menHealthSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     stressLevel: Number,
//     sleepHours: Number,
//     workoutDays: Number,
//     age: Number,
//     name: String,
//     prostateCheck: Boolean,
//     date: { type: Date, default: Date.now },

//     analysis: {
//       insights: [String],
//       aiTip: String,
//       analyzedAt: Date,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("MenHealth", menHealthSchema);
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

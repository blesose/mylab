const mongoose = require("mongoose");

const LabInsightsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: [
      "femaleHealth",
      "sleepRecovery",
      "menHealth",
      "fitness",
      "nutrition",
      "selfCare",
      "community",
      "blood-test",
    ],
    required: true
  },
  summary: { type: String },
  aiGeneratedTips: { type: [String] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LabInsights", LabInsightsSchema);


// const mongoose = require("mongoose");
// const LabInsightsSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   category: {
//     type: String,
//     enum: [
//       "femaleHealth",
//       "sleepRecovery",
//       "menHealth",
//       "fitness",
//       "nutrition",
//       "selfCare",
//       "community"
//     ],
//     required: true
//   },
//   summary: { type: String },
//   aiGeneratedTips: { type: [String] },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("LabInsights", LabInsightsSchema);
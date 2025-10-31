const mongoose = require("mongoose");

const trackerEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["femaleHealth", "maleHealth", "fitness", "nutrition", "selfCare"],
      required: true,
    },
    title: { type: String, required: true },
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    meta: { type: Object, default: {} }, // extra info like calories, cycle day, mood
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackerEntry", trackerEntrySchema);

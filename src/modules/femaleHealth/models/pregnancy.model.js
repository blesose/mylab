const mongoose = require("mongoose");

const pregnancySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conceptionDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  currentWeek: { type: Number, required: true },
  notes: { type: String },
  reminders: [{ type: Date }],
}, { timestamps: true });

module.exports = mongoose.model("Pregnancy", pregnancySchema);

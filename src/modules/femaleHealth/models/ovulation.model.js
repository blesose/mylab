const mongoose = require("mongoose");

const ovulationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cycleStart: { type: Date, required: true },
  cycleLength: { type: Number, required: true, default: 28 },
  ovulationDate: { type: Date },
  fertileWindowStart: { type: Date },
  fertileWindowEnd: { type: Date },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Ovulation", ovulationSchema);

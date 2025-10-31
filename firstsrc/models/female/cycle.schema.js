// const mongoose = require("mongoose");

// const cycleSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     cycleStartDate: { type: Date, required: true },
//     cycleEndDate: { type: Date, required: true },
//     symptoms: { type: [String], default: [] },
//     mood: { type: String, trim: true },
//     notes: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cycle", cycleSchema);
// const mongoose = require("mongoose");

// const cycleSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   flow: { type: String, enum: ["light", "medium", "heavy"], default: "medium" },
//   symptoms: [{ type: String }],
//   notes: { type: String, maxlength: 300 },
// }, { timestamps: true });

// module.exports = mongoose.model("Cycle", cycleSchema);

const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    // The first day of the period
    startDate: { type: Date, required: true },

    // The last day of the period (optional for ongoing periods)
    endDate: { type: Date },

    // User reported flow for this period
    flow: { type: String, enum: ["light", "medium", "heavy"], default: "medium" },

    // Any symptoms logged for this cycle
    symptoms: [{ type: String }],

    // Notes for the cycle
    notes: { type: String, maxlength: 500 },

    // Computed period length (days) - optional, can be derived if endDate exists
    periodLength: { type: Number },

    // Optional metadata (e.g., pregnancy test result, contraception)
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// Pre-save hook to compute periodLength if endDate present
cycleSchema.pre("save", function (next) {
  if (this.endDate && this.startDate) {
    const diff = Math.ceil((new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    this.periodLength = diff;
  }
  next();
});

module.exports = mongoose.model("Cycle", cycleSchema);

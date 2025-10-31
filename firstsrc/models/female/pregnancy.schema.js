// const mongoose = require("mongoose");

// const pregnancySchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     expectedDueDate: { type: Date, required: true },
//     trimester: { type: Number, enum: [1, 2, 3], required: true },
//     symptoms: { type: [String], default: [] },
//     notes: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Pregnancy", pregnancySchema);
const mongoose = require("mongoose");

const pregnancySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    startDate: {
      type: Date,
      required: true, // typically first day of last menstrual period
    },

    dueDate: {
      type: Date,
      required: true,
    },

    currentWeek: {
      type: Number,
      default: 1,
    },

    trimester: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },

    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Helper function — auto-update week and trimester
pregnancySchema.methods.updateProgress = function () {
  const today = new Date();
  const start = new Date(this.startDate);
  const diffInWeeks = Math.floor((today - start) / (7 * 24 * 60 * 60 * 1000));
  this.currentWeek = diffInWeeks > 0 ? diffInWeeks : 1;

  if (this.currentWeek <= 13) this.trimester = 1;
  else if (this.currentWeek <= 27) this.trimester = 2;
  else this.trimester = 3;
};

module.exports = mongoose.model("Pregnancy", pregnancySchema);

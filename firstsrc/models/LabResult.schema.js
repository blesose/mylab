const mongoose = require("mongoose");

const labResultSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
       ref: "user", 
       required: true 
      },
    testName: { 
      type: String, 
      required: true 
    },
    result: { 
      type: String, 
      required: true 
    },
    unit: { 
      type: String 
    },
    normalRange: { 
      type: String 
    },
    dateTaken: { 
      type: Date, 
      default: Date.now 
    },
    notes: { 
      type: String, 
      default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabResult", labResultSchema);

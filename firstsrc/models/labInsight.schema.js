const mongoose = require("mongoose");

const labInsightsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // faster queries per user
    },

    insightType: {
      type: String,
      enum: ["health", "nutrition", "mental", "fitness", "selfCare"],
      required: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    source: {
      type: String,
      enum: ["system", "coach", "ai_chatbot"],
      default: "system",
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    readStatus: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabInsight", labInsightsSchema);

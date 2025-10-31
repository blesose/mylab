const mongoose = require("mongoose");

const selfCareSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activityType: {
      type: String,
      enum: [
        "meditation",
        "journaling",
        "yoga",
        "exercise",
        "reading",
        "spa",
        "hobby",
        "sleep",
        "digital_detox",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    durationMinutes: {
      type: Number,
      min: 1,
      max: 1440, // max 24 hours
    },

    moodBefore: {
      type: String,
      enum: ["happy", "neutral", "sad", "stressed", "anxious", "tired"],
    },

    moodAfter: {
      type: String,
      enum: ["happy", "neutral", "sad", "stressed", "anxious", "tired"],
    },

    effectivenessRating: {
      type: Number,
      min: 1,
      max: 5, // star rating 1–5
    },

    reminder: {
      enabled: { type: Boolean, default: false },
      time: { type: Date },
      repeat: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none",
      },
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SelfCare", selfCareSchema);

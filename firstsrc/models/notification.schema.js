const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["reminder", "alert", "system"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      default: null, // for reminders
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for querying upcoming notifications (e.g., reminders)
notificationSchema.index({ scheduledAt: 1, status: 1 });

module.exports = mongoose.model("Notification", notificationSchema);

const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // author of the post
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    media: [
      {
        url: { type: String },
        type: { type: String, enum: ["image", "video", "audio"], default: "image" },
      },
    ],

    tags: {
      type: [String], // e.g. ["fitness", "nutrition", "mental health"]
      default: [],
    },

    visibility: {
      type: String,
      enum: ["public", "private", "followers"],
      default: "public",
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Index for faster searches
communityPostSchema.index({ title: "text", content: "text", tags: 1 });

module.exports = mongoose.model("CommunityPost", communityPostSchema);

const mongoose = require("mongoose");

const mensHealthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      enum: [
        "fitness",
        "mental",
        "nutrition",
        "sexual",
        "general",
        "prostate",
      ],
      required: [true, "Category is required"],
    },
    tags: {
      type: [String], // optional keywords for search/analytics
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MensHealth = mongoose.model("MensHealth", mensHealthSchema);

module.exports = MensHealth;


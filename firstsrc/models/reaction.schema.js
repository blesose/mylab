const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Either reacting to a post or a comment
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      default: null,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    type: {
      type: String,
      enum: ["like", "love", "insightful", "support", "celebrate"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reactions by the same user on the same target
reactionSchema.index(
  { userId: 1, postId: 1, commentId: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model("Reaction", reactionSchema);


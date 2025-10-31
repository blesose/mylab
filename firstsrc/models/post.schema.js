const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true },
    comment: { 
      type: String, 
      required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    media: { 
      type: [String], 
      default: [] 
    }, 
    reactions: {
      like: [
        { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "user" 
        }
      ],
      love: [
        { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User" 
        }
      ],
      // extendable
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);

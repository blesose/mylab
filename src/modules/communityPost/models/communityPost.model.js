const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommunityPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: [CommentSchema],
    aiInsight: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
// const mongoose = require("mongoose");
// // const mongoose = require("mongoose");

// const NotificationSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     title: String,
//     message: String,
//     type: { type: String, default: "general" },
//     read: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Notification", NotificationSchema);

// const CommunityPostSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     title: { type: String, required: true, trim: true },
//     content: { type: String, required: true },
//     tags: [String],
//     likes: { type: Number, default: 0 },
//     comments: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         text: String,
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
//     aiInsight: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("CommunityPost", CommunityPostSchema);

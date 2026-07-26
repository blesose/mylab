const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user",
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid userId format'
    }
  },
  text: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const CommunityPostSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user",
      required: true,
      validate: {
        validator: function(v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: 'Invalid userId format'
      }
    },
    title: { 
      type: String, 
      trim: true,
      maxlength: 200
    },
    content: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000
    },
    tags: [{ 
      type: String,
      trim: true 
    }],
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user",
      validate: {
        validator: function(v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: 'Invalid like userId format'
      }
    }],
    comments: [CommentSchema],
    aiInsight: { 
      type: String,
      trim: true
    },
  },
  { 
    timestamps: true
  }
);

CommunityPostSchema.pre('save', function(next) {
  if (this.likes && typeof this.likes === 'number') {
    this.likes = [];
  }
  if (this.likes && !Array.isArray(this.likes)) {
    this.likes = [];
  }
  next();
});

CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ userId: 1 });
CommunityPostSchema.index({ 'likes': 1 });

CommunityPostSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

CommunityPostSchema.virtual('engagementScore').get(function() {
  return (this.likes?.length || 0) + (this.comments?.length || 0);
});

CommunityPostSchema.set('toJSON', { virtuals: true });
CommunityPostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
const mongoose = require("mongoose");
const CommunityPost = require("../models/communityPost.model");
const { generateCommunityInsight } = require("../ai/ai.helper");
const { analyzeEngagement } = require("./communityPost.analysis");

/**
 * Create a new post
 */
const createPost = async (userId, data) => {
  try {
    const aiInsight = await generateCommunityInsight(data.content);
    const post = await CommunityPost.create({ ...data, userId, aiInsight });
    
    // Populate user data before returning
    await post.populate('userId', 'name email userName');
    
    // Format post
    const formattedPost = {
      _id: post._id,
      content: post.content,
      title: post.title,
      tags: post.tags,
      userId: post.userId ? {
        _id: post.userId._id,
        name: post.userId.name || post.userId.userName || 'Anonymous',
        email: post.userId.email
      } : null,
      likes: [],
      comments: [],
      aiInsight: post.aiInsight,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: 0,
      commentsCount: 0
    };
    
    return formattedPost;
  } catch (error) {
    console.error('❌ Error in createPost service:', error);
    throw error;
  }
};

/**
 * Get all posts (latest first) - VISIBLE TO ALL USERS
 */
const getAllPosts = async () => {
  try {
    console.log('📡 Fetching all posts from database...');
    
    // Get posts with population directly
    const posts = await CommunityPost.find()
      .populate('userId', 'name email userName')
      .populate('comments.userId', 'name email userName')
      .populate('likes', 'name email userName')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`📊 Found ${posts.length} posts`);
    
    // Transform posts to ensure correct data structure
    const transformedPosts = posts.map(post => {
      // Ensure likes is always an array and clean it
      let likesArray = [];
      if (Array.isArray(post.likes)) {
        likesArray = post.likes.filter(like => 
          like && typeof like === 'object' && like._id
        );
      }
      
      // Ensure comments are properly formatted
      const commentsArray = Array.isArray(post.comments) ? post.comments.map(comment => ({
        _id: comment._id,
        text: comment.text,
        userId: comment.userId ? {
          _id: comment.userId._id,
          name: comment.userId.name || comment.userId.userName || 'Anonymous',
          email: comment.userId.email
        } : null,
        createdAt: comment.createdAt
      })) : [];
      
      return {
        _id: post._id,
        content: post.content,
        title: post.title || '',
        tags: post.tags || [],
        userId: post.userId ? {
          _id: post.userId._id,
          name: post.userId.name || post.userId.userName || 'Anonymous',
          email: post.userId.email,
          userName: post.userId.userName
        } : null,
        likes: likesArray,
        comments: commentsArray,
        aiInsight: post.aiInsight || '',
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likesCount: likesArray.length,
        commentsCount: commentsArray.length
      };
    });
    
    console.log(`✅ Returning ${transformedPosts.length} posts`);
    return transformedPosts;
    
  } catch (error) {
    console.error('❌ Error in getAllPosts service:', error.message);
    
    // Fallback: return posts without population
    try {
      const fallbackPosts = await CommunityPost.find().sort({ createdAt: -1 }).lean();
      return fallbackPosts.map(post => ({
        ...post,
        likes: [],
        likesCount: 0,
        comments: post.comments || [],
        commentsCount: post.comments?.length || 0,
        userId: post.userId ? { _id: post.userId, name: 'User', email: '' } : null
      }));
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
      return [];
    }
  }
};


/**
 * Delete a post (only by post owner or admin)
 */
const deletePost = async (postId, userId, userRole) => {
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");

    // Check permissions: post owner OR admin can delete
    const isPostOwner = post.userId.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isPostOwner && !isAdmin) {
      throw new Error("You don't have permission to delete this post");
    }

    // Delete the post
    await CommunityPost.findByIdAndDelete(postId);

    return { success: true, postId };
  } catch (error) {
    console.error('❌ Error in deletePost service:', error);
    throw error;
  }
};
/**
 * Like/Unlike a post (toggle)
 */
const toggleLikePost = async (postId, userId) => {
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");
    
    // Ensure likes is an array
    if (!Array.isArray(post.likes)) {
      console.log(`⚠️ Fixing post ${postId}: converting likes from ${typeof post.likes} to array`);
      post.likes = [];
      await post.save();
    }

    // Check if user already liked the post
    const userIdStr = userId.toString();
    const likeIndex = post.likes.findIndex(
      (likeUserId) => likeUserId && likeUserId.toString() === userIdStr
    );

    let action;
    if (likeIndex > -1) {
      // User already liked - UNLIKE
      post.likes.splice(likeIndex, 1);
      action = 'unliked';
      console.log(`👎 User ${userId} unliked post ${postId}`);
    } else {
      // User hasn't liked - LIKE
      post.likes.push(userId);
      action = 'liked';
      console.log(`👍 User ${userId} liked post ${postId}`);
    }

    await post.save();
    
    // Populate and return
    await post.populate('userId', 'name email userName');
    await post.populate('comments.userId', 'name email userName');
    await post.populate('likes', 'name email userName');
    
    // Format the post for return
    const formattedPost = {
      _id: post._id,
      content: post.content,
      title: post.title,
      tags: post.tags,
      userId: post.userId ? {
        _id: post.userId._id,
        name: post.userId.name || post.userId.userName || 'Anonymous',
        email: post.userId.email
      } : null,
      likes: post.likes || [],
      comments: (post.comments || []).map(comment => ({
        _id: comment._id,
        text: comment.text,
        userId: comment.userId ? {
          _id: comment.userId._id,
          name: comment.userId.name || comment.userId.userName || 'Anonymous',
          email: comment.userId.email
        } : null,
        createdAt: comment.createdAt
      })),
      aiInsight: post.aiInsight,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0
    };
    
    return { post: formattedPost, action };
  } catch (error) {
    console.error('❌ Error in toggleLikePost service:', error);
    throw error;
  }
};

/**
 * Check if user has liked a post
 */
const hasUserLikedPost = async (postId, userId) => {
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return false;
    
    if (!Array.isArray(post.likes)) {
      return false;
    }
    
    return post.likes.some(
      (likeUserId) => likeUserId && likeUserId.toString() === userId.toString()
    );
  } catch (error) {
    console.error('❌ Error in hasUserLikedPost service:', error);
    return false;
  }
};

/**
 * Comment on a post
 */
const commentOnPost = async (postId, userId, text) => {
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");

    post.comments.push({ userId, text });
    await post.save();
    
    // Populate and return updated post
    await post.populate('userId', 'name email userName');
    await post.populate('comments.userId', 'name email userName');
    await post.populate('likes', 'name email userName');
    
    // Format the post for return
    const formattedPost = {
      _id: post._id,
      content: post.content,
      title: post.title,
      tags: post.tags,
      userId: post.userId ? {
        _id: post.userId._id,
        name: post.userId.name || post.userId.userName || 'Anonymous',
        email: post.userId.email
      } : null,
      likes: post.likes || [],
      comments: (post.comments || []).map(comment => ({
        _id: comment._id,
        text: comment.text,
        userId: comment.userId ? {
          _id: comment.userId._id,
          name: comment.userId.name || comment.userId.userName || 'Anonymous',
          email: comment.userId.email
        } : null,
        createdAt: comment.createdAt
      })),
      aiInsight: post.aiInsight,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0
    };
    
    return formattedPost;
  } catch (error) {
    console.error('❌ Error in commentOnPost service:', error);
    throw error;
  }
};

/**
 * Delete a comment from a post
 */
const deleteComment = async (postId, commentId, userId, userRole) => {
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error("Post not found");

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) throw new Error("Comment not found");

    // Check permissions: comment owner OR post owner OR admin can delete
    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isPostOwner = post.userId.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      throw new Error("You don't have permission to delete this comment");
    }

    // Remove the comment
    comment.deleteOne();
    await post.save();

    // Populate and return updated post
    await post.populate('userId', 'name email userName');
    await post.populate('comments.userId', 'name email userName');
    await post.populate('likes', 'name email userName');

    // Format the post for return
    const formattedPost = {
      _id: post._id,
      content: post.content,
      title: post.title,
      tags: post.tags,
      userId: post.userId ? {
        _id: post.userId._id,
        name: post.userId.name || post.userId.userName || 'Anonymous',
        email: post.userId.email
      } : null,
      likes: post.likes || [],
      comments: (post.comments || []).map(comment => ({
        _id: comment._id,
        text: comment.text,
        userId: comment.userId ? {
          _id: comment.userId._id,
          name: comment.userId.name || comment.userId.userName || 'Anonymous',
          email: comment.userId.email
        } : null,
        createdAt: comment.createdAt
      })),
      aiInsight: post.aiInsight,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0
    };

    return formattedPost;
  } catch (error) {
    console.error('❌ Error in deleteComment service:', error);
    throw error;
  }
};

/**
 * Analyze all posts engagement
 */
const analyzePostEngagement = async () => {
  try {
    const posts = await CommunityPost.find();
    return analyzeEngagement(posts);
  } catch (error) {
    console.error('❌ Error in analyzePostEngagement service:', error);
    throw error;
  }
};

module.exports = { 
  createPost, 
  getAllPosts,
  deletePost,
  toggleLikePost, 
  hasUserLikedPost,
  commentOnPost, 
  analyzePostEngagement,
  deleteComment,
};
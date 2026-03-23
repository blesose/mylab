const {
  createPost,
  getAllPosts,
  toggleLikePost,
  commentOnPost,
  analyzePostEngagement,
  deleteComment,
  deletePost
} = require("../services/communityPost.service");
const { generateReactionInsight } = require("../ai/ai.helper");
const CommunityPost = require("../models/communityPost.model");

/**
 * Create a post
 */
const createCommunityPost = async (req, res) => {
  try {
    console.log('📝 Creating post for user:', req.userId);
    console.log('📝 Post data:', req.body);
    
    const post = await createPost(req.userId, req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Post created successfully", 
      data: post 
    });
  } catch (err) {
    console.error('❌ Error in createCommunityPost:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all posts - VISIBLE TO ALL USERS
 */
const getCommunityPosts = async (req, res) => {
  try {
    console.log('📡 getCommunityPosts called by user:', req.userId);
    
    const posts = await getAllPosts();
    
    // Add hasLiked flag and ensure all fields are properly formatted
    const postsWithLikeStatus = posts.map(post => {
      // Check if current user liked this post
      const hasLiked = post.likes?.some(
        like => like && like._id && like._id.toString() === req.userId.toString()
      ) || false;
      
      return {
        ...post,
        hasLiked: hasLiked
      };
    });
    
    console.log('✅ Sending response with', postsWithLikeStatus.length, 'posts');
    res.status(200).json({ 
      success: true, 
      data: postsWithLikeStatus 
    });
  } catch (err) {
    console.error('❌ Error in getCommunityPosts controller:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts',
      error: err.message 
    });
  }
};

/**
 * Get a single community post by ID
 */
const getACommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log('📡 Fetching single post:', postId);
    
    const post = await CommunityPost.findById(postId)
      .populate('userId', 'name email userName')
      .populate('comments.userId', 'name email userName')
      .populate('likes', 'name email userName');
    
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    // Format the post
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
      commentsCount: post.comments?.length || 0,
      hasLiked: post.likes?.some(
        like => like._id?.toString() === req.userId.toString()
      ) || false
    };
    
    res.status(200).json({ success: true, data: formattedPost });
  } catch (err) {
    console.error('❌ Error in getACommunityPost:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Like/Unlike a post (toggle)
 */
const likeCommunityPost = async (req, res) => {
  try {
    console.log('❤️ Toggling like for post:', req.params.id, 'by user:', req.userId);
    
    const { post, action } = await toggleLikePost(req.params.id, req.userId);
    
    const message = action === 'liked' 
      ? "Post liked successfully" 
      : "Post unliked successfully";
    
    const reactionTip = action === 'liked'
      ? generateReactionInsight(post.likesCount || 0, post.commentsCount || 0)
      : "You can always like this post again! 💙";
    
    // Ensure the response includes hasLiked
    const responseData = {
      ...post,
      hasLiked: action === 'liked',
      likesCount: post.likesCount || post.likes?.length || 0
    };
    
    res.status(200).json({ 
      success: true, 
      message, 
      action,
      data: responseData,
      reactionTip 
    });
  } catch (err) {
    console.error('❌ Error in likeCommunityPost:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Comment on a post
 */
const commentCommunityPost = async (req, res) => {
  try {
    const { text } = req.body;
    
    console.log('💬 Adding comment to post:', req.params.id);
    console.log('💬 Comment text:', text);
    console.log('💬 User ID:', req.userId);
    
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }
    
    const post = await commentOnPost(req.params.id, req.userId, text);
    
    const reactionTip = generateReactionInsight(
      post.likesCount || 0, 
      post.commentsCount || 0
    );
    
    // Ensure the response includes hasLiked
    const responseData = {
      ...post,
      hasLiked: post.likes?.some(
        like => like && like._id && like._id.toString() === req.userId.toString()
      ) || false
    };
    
    res.status(200).json({ 
      success: true, 
      message: "Comment added", 
      data: responseData,
      reactionTip 
    });
  } catch (err) {
    console.error('❌ Error in commentCommunityPost:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Delete a comment from a post
 */
const deleteCommentFromPost = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole || 'user'; // Default to 'user' if not set

    console.log('🗑️ Deleting comment:', commentId, 'from post:', postId, 'by user:', userId);

    const updatedPost = await deleteComment(postId, commentId, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: updatedPost
    });
  } catch (err) {
    console.error('❌ Error in deleteCommentFromPost:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Analyze posts engagement
 */
const getPostsAnalysis = async (req, res) => {
  try {
    const analysis = await analyzePostEngagement();
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    console.error('❌ Error in getPostsAnalysis:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete a post (only by post owner or admin)
 */
const deletePostFromCommunity = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole || 'user';

    console.log('🗑️ Deleting post:', postId, 'by user:', userId);

    const result = await deletePost(postId, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: result
    });
  } catch (err) {
    console.error('❌ Error in deletePostFromCommunity:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * TEMPORARY: Fix posts with invalid likes format
 */
const fixInvalidPosts = async (req, res) => {
  try {
    console.log('🔧 Running temporary fix for invalid posts...');
    
    const posts = await CommunityPost.find();
    let fixedCount = 0;
    
    for (const post of posts) {
      let needsSave = false;
      
      if (typeof post.likes === 'number') {
        console.log(`Fixing post ${post._id}: likes was ${post.likes}`);
        post.likes = [];
        needsSave = true;
        fixedCount++;
      }
      
      if (Array.isArray(post.likes)) {
        const hasNumbers = post.likes.some(like => typeof like === 'number');
        if (hasNumbers) {
          console.log(`Fixing post ${post._id}: removing numbers from likes`);
          post.likes = post.likes.filter(like => typeof like !== 'number');
          needsSave = true;
          fixedCount++;
        }
      }
      
      if (Array.isArray(post.comments)) {
        const validComments = post.comments.filter(comment => {
          if (!comment || !comment.userId) return false;
          if (typeof comment.userId === 'number') return false;
          if (typeof comment.userId === 'string' && !isNaN(comment.userId) && comment.userId.match(/^\d+$/)) return false;
          return true;
        });
        
        if (validComments.length !== post.comments.length) {
          post.comments = validComments;
          needsSave = true;
          console.log(`Fixing post ${post._id}: removed ${post.comments.length - validComments.length} invalid comments`);
        }
      }
      
      if (needsSave) {
        await post.save();
      }
    }
    
    res.json({
      success: true,
      message: `Fixed ${fixedCount} posts`,
      fixedCount
    });
    
  } catch (error) {
    console.error('Error fixing posts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createCommunityPost,
  getCommunityPosts,
  getACommunityPost,
  deletePostFromCommunity,
  likeCommunityPost,
  commentCommunityPost,
  deleteCommentFromPost,
  getPostsAnalysis,
  fixInvalidPosts
};
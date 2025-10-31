const postschema = require("../models/post.schema");

const sanitizePost = (post) => {
  const { __v, ...data } = post.toObject();
  return data;
};

const createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    // const user = req.userData.userId;
    // if(!content || !media || !user) {
     if(!content || !media) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      })
    }
    const post = await postschema({
      // user: req.userData.userId
      user: req.user.id,
      content,
      media
    });
    await post.save()
    return res.status(200).json({
      success: true,
      data: sanitizePost(post),
      message: "post created successfully"
    });
  } catch(error) {
    console.error("POST error:", error.message + error.stack)
    return res.status(500).json({
      success: false,
      message: "post not seen:" + error.message
    });
  };
};

const getAllPosts = async(req, res) => {
  try {
    const posts = await postschema.find();
    if (!posts.length) {
      return res.status(401).json({
        success: false,
        message: "posts not found"
      });
    };
    return res.status(201).json({
      success: true,
      message: "All posts found"
    });
  } catch(error) {
    return res.status(501).json({
      success: false,
      message: "server error:" + error.message
    });
  };
};

const getAllPostsLatestFirst = async(req, res) => {
  try {
    const posts = await postschema.find().populate("user", "name profilePicture").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: posts.map(sanitizePost),
      message: "All post from the latest found"
    });
  } catch(error) {
    return res.status(502).json({
     success: false,
     message: "server error"
    });
  }
};

const getAPost = async(req, res) => {
  try {
    
  } catch(error) {}
}
// // GET single post
// const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate("user", "name profilePicture");
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });

//     res.status(200).json({ success: true, data: sanitizePost(post) });
//   } catch (error) {
//     console.error("Get Post Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// const Post = require("../models/post.model");

// // Helper: sanitize post output
// const sanitizePost = (post) => {
//   const { __v, ...data } = post.toObject();
//   return data;
// };

// // CREATE a post
// const createPost = async (req, res) => {
//   try {
//     const { content, media } = req.body;

//     const post = await Post.create({
//       user: req.user.id, // Logged-in user
//       content,
//       media,
//     });

//     res.status(201).json({ success: true, message: "Post created", data: sanitizePost(post) });
//   } catch (error) {
//     console.error("Create Post Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // GET all posts (with latest first)
// const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().populate("user", "name profilePicture").sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: posts.map(sanitizePost) });
//   } catch (error) {
//     console.error("Get Posts Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // GET single post
// const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate("user", "name profilePicture");
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });

//     res.status(200).json({ success: true, data: sanitizePost(post) });
//   } catch (error) {
//     console.error("Get Post Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // UPDATE a post (only owner)
// const updatePost = async (req, res) => {
//   try {
//     const { content, media } = req.body;

//     const post = await Post.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { content, media },
//       { new: true, runValidators: true }
//     );

//     if (!post) return res.status(404).json({ success: false, message: "Post not found or unauthorized" });

//     res.status(200).json({ success: true, message: "Post updated", data: sanitizePost(post) });
//   } catch (error) {
//     console.error("Update Post Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // DELETE a post (only owner)
// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.id });
//     if (!post) return res.status(404).json({ success: false, message: "Post not found or unauthorized" });

//     res.status(200).json({ success: true, message: "Post deleted" });
//   } catch (error) {
//     console.error("Delete Post Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ADD comment
// const addComment = async (req, res) => {
//   try {
//     const { comment } = req.body;

//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });

//     post.comments.push({ user: req.user.id, comment });
//     await post.save();

//     res.status(201).json({ success: true, message: "Comment added", data: sanitizePost(post) });
//   } catch (error) {
//     console.error("Add Comment Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // REACT to post (like/love)
// const reactToPost = async (req, res) => {
//   try {
//     const { reactionType } = req.body; // "like" or "love"

//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });

//     if (!["like", "love"].includes(reactionType)) {
//       return res.status(400).json({ success: false, message: "Invalid reaction type" });
//     }

//     // toggle reaction
//     const userIndex = post.reactions[reactionType].indexOf(req.user.id);
//     if (userIndex === -1) {
//       post.reactions[reactionType].push(req.user.id);
//     } else {
//       post.reactions[reactionType].splice(userIndex, 1);
//     }

//     await post.save();

//     res.status(200).json({ success: true, message: "Reaction updated", data: sanitizePost(post) });
//   } catch (error) {
//     console.error("React Post Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { createPost, getPosts, getPostById, updatePost, deletePost, addComment, reactToPost };

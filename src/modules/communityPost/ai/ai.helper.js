
  // Generate AI insight for community posts based on content
  // @param {string} content - The post content
  // @returns {Promise<string>} - AI generated insight
 
async function generateCommunityInsight(content) {
  try {
    const contentLength = content.length;
    const lowercaseContent = content.toLowerCase();
    
    // Emotional/wellness keywords
    const wellnessKeywords = ['stress', 'anxiety', 'happy', 'grateful', 'blessed', 'struggle', 'growth'];
    const helpKeywords = ['help', 'advice', 'suggest', 'recommend', 'need support'];
    const achievementKeywords = ['achieved', 'completed', 'success', 'proud', 'milestone'];
    
    let insight = "";
    
    // Generate insights based on content analysis
    if (wellnessKeywords.some(keyword => lowercaseContent.includes(keyword))) {
      insight = "Your emotional wellness matters! Thanks for sharing your journey with the community. 🌱";
    } 
    else if (helpKeywords.some(keyword => lowercaseContent.includes(keyword))) {
      insight = "Seeking support is a sign of strength! The community is here to help you. 🤝";
    }
    else if (achievementKeywords.some(keyword => lowercaseContent.includes(keyword))) {
      insight = "Congratulations on your achievement! Your progress inspires others. 🎉";
    }
    else if (contentLength > 300) {
      insight = "Detailed and thoughtful post! This shows great self-reflection. 📝";
    }
    else if (contentLength < 50) {
      insight = "Short but powerful! Sometimes less is more. ✨";
    }
    else {
      insight = "Thank you for contributing to our community! Your voice matters. 🌟";
    }
    
    const emojis = ['💪', '🧠', '❤️', '🌱', '✨', '🌟', '💫', '🦋'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return `${insight} ${randomEmoji}`;
  } catch (error) {
    console.error('Error generating community insight:', error);
    return "Thanks for sharing with our community! 🌟";
  }
}


  // Generate reaction insight based on likes and comments count
  // @param {number} likes - Number of likes on the post
  // @param {number} comments - Number of comments on the post
  // @returns {string} - Reaction insight/tip

function generateReactionInsight(likes, comments) {
  try {
    const totalEngagement = (likes || 0) + (comments || 0);
    
    if (totalEngagement === 0) {
      const tips = [
        "Be the first to engage with this post! 💬",
        "Start a conversation - share your thoughts! 💭",
        "Show some love to this community member! ❤️",
        "Every engagement makes our community stronger! 🌱"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    else if (likes > 50) {
      const tips = [
        "🔥 This post is trending in the community!",
        "⭐ Amazing engagement! Your post is inspiring others.",
        "🚀 Going viral! Keep up the great content!",
        "💫 This post is making waves in our community!"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    else if (comments > 20) {
      const tips = [
        "💬 Great discussion happening here!",
        "🗣️ The community is actively engaged in conversation!",
        "🤝 Your post sparked meaningful dialogue!",
        "💭 So many perspectives being shared here!"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    else if (likes > 20) {
      const tips = [
        "❤️ Your post is resonating with many community members!",
        "⭐ Strong engagement! Keep sharing your journey.",
        "🌟 Your story is touching hearts!",
        "Your post is inspiring others to engage!"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    else if (comments > 10) {
      const tips = [
        "💬 Your post is generating meaningful conversations!",
        "🗣️ People love discussing your thoughts!",
        "🤝 Your post is building community connections!",
        "💭 Great to see such active discussion!"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    else if (totalEngagement > 0) {
      const tips = [
        "👍 Your engagement helps build a stronger community!",
        "💚 Every like and comment matters - keep participating!",
        "🌟 Your interaction makes a difference!",
        "🤗 Your engagement is appreciated by the community!"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    else {
      return "Your engagement helps our community grow! 🌱";
    }
  } catch (error) {
    console.error('Error generating reaction insight:', error);
    return "Thanks for engaging with our community! 💚";
  }
}


  // Generate analysis insight for post statistics
  // @param {Object} analysisData - Post analysis data
  // @returns {string} - Analysis insight
 
function generateAnalysisInsight(analysisData) {
  try {
    const { totalPosts, totalLikes, totalComments, avgLikes, avgComments } = analysisData;
    
    if (totalPosts === 0) {
      return "No posts yet. Be the first to share your journey!";
    }
    
    if (avgLikes > 10) {
      return `High engagement! Average ${Math.round(avgLikes)} likes per post.`;
    } else if (avgComments > 5) {
      return `Active discussions! Average ${Math.round(avgComments)} comments per post.`;
    } else if (totalPosts > 10) {
      return `Growing community with ${totalPosts} posts! Keep sharing!`;
    } else {
      return `Building community engagement one post at a time!`;
    }
  } catch (error) {
    console.error('Error generating analysis insight:', error);
    return "Community engagement is growing! 📊";
  }
}

module.exports = { 
  generateCommunityInsight, 
  generateReactionInsight,
  generateAnalysisInsight 
};
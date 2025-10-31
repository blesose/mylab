/**
 * Generate AI insight for post content
 */
async function generateCommunityInsight(content) {
  // Here we simulate AI processing
  if (content.length > 200) return "Long-form post with detailed insight 📝";
  if (content.toLowerCase().includes("help")) return "Post may need community advice 🤝";
  return "General post insight 🌟";
}

/**
 * Generate reaction tip based on likes/comments
 */
function generateReactionInsight(likes, comments) {
  if (likes > 50) return "Post is trending! 🚀";
  if (comments > 20) return "High discussion on this post 💬";
  return "Keep engaging with your community 🤗";
}

module.exports = { generateCommunityInsight, generateReactionInsight };
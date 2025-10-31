/**
 * Analyze engagement for posts
 */
function analyzeEngagement(posts) {
  if (!posts || posts.length === 0) return { message: "No posts yet" };

  const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  const avgLikes = totalLikes / posts.length;
  const avgComments = totalComments / posts.length;

  return {
    totalPosts: posts.length,
    totalLikes,
    totalComments,
    avgLikes: avgLikes.toFixed(2),
    avgComments: avgComments.toFixed(2),
    trend: avgLikes > 10 ? "High engagement" : "Moderate engagement",
  };
}

module.exports = { analyzeEngagement };
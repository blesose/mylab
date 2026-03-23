function analyzeEngagement(posts) {
  if (!posts || posts.length === 0) return { message: "No posts yet" };

  // Calculate totals - likes is now an array
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);

  const avgLikes = totalLikes / posts.length;
  const avgComments = totalComments / posts.length;

  // Find most engaged post
  const mostEngagedPost = posts.reduce((max, post) => {
    const engagement = (post.likes?.length || 0) + (post.comments?.length || 0);
    const maxEngagement = (max.likes?.length || 0) + (max.comments?.length || 0);
    return engagement > maxEngagement ? post : max;
  }, posts[0]);

  return {
    totalPosts: posts.length,
    totalLikes,
    totalComments,
    avgLikes: avgLikes.toFixed(2),
    avgComments: avgComments.toFixed(2),
    trend: avgLikes > 5 ? "High engagement" : "Moderate engagement",
    mostEngagedPostId: mostEngagedPost._id,
    mostEngagedPostEngagement: (mostEngagedPost.likes?.length || 0) + (mostEngagedPost.comments?.length || 0)
  };
}

module.exports = { analyzeEngagement };
const { getAIInsight } = require("../ai/ai.helper");
async function analyzeData(userId, category, data) {
  // Validate that data is actually provided
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error(`No ${category} data provided for analysis`);
  }
  
  // Calculate REAL statistics from actual data
  const average = data.length
    ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)
    : 0;

  // Get AI insights based on REAL data
  const aiTips = await getAIInsight(
    `Analyze this ${category} data for user ${userId}: ${JSON.stringify(data)}. 
     Data points: ${data.length}, Average: ${average}.
     Provide 2-3 personalized tips for better results.`
  );

  return {
    userId,
    category,
    summary: `Average score: ${average} based on ${data.length} real records.`,
    aiGeneratedTips: aiTips
  };
}

module.exports = { analyzeData };
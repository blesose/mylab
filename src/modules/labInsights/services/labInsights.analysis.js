const { getAIInsight } = require("../ai/ai.helper");

async function analyzeData(userId, category, rawData) {
  const average = rawData.length
    ? rawData.reduce((a, b) => a + b, 0) / rawData.length
    : 0;

  const aiTips = await getAIInsight(
   `Analyze this ${category} data:${JSON.stringify(rawData)}. Give personalized tips for better results.
  `);

  return {
    userId,
    category,
    summary: `Average score: ${average.toFixed(2)} based on ${rawData.length} records.`,
    aiGeneratedTips: aiTips
  };
}

module.exports = { analyzeData };
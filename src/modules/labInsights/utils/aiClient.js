const axios = require("axios");

async function getAIInsight(prompt) {
  try {
    // Connect to your local AI module endpoint
    const { data } = await axios.post("http://localhost:9000/api/ai/generate-tip", { prompt });
    return data.tips || ["No tips available"];
  } catch (err) {
    console.error("AI Insight generation failed:", err.message);
    return ["Error generating AI insight"];
  }
}

module.exports = { getAIInsight };

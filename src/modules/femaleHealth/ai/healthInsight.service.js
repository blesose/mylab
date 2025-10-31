const axios = require("axios");

async function generateHealthInsight(userData, moduleType) {
  try {
    const prompt = `
You are an empathetic women's health assistant. 
Given this data:
Cycle regularity: ${userData.cycleRegularity}
Mood pattern: ${userData.moodPattern}
Symptoms: ${userData.symptoms.join(", ")}
Module: ${moduleType}

Provide one personalized, encouraging health tip (2–3 sentences).
Avoid medical jargon.
`;

    // Example: OpenAI endpoint (pseudo-production)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const tip = response.data.choices?.[0]?.message?.content?.trim() || "Remember to stay balanced and listen to your body this week.";

    return tip;
  } catch (error) {
    console.error("AI insight error:", error.message);
    return "Stay consistent and take care of yourself this week.";
  }
}

module.exports = { generateHealthInsight };

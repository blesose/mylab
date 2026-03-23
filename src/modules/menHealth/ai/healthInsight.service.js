const axios = require("axios");

async function generateMenHealthInsight(userData, focusArea = "mental") {
  try {
    const prompt = `
You are a compassionate men's health assistant.
User details:
- Stress Level: ${userData.stressLevel}
- Sleep Hours: ${userData.sleepHours}
- Exercise Frequency: ${userData.exerciseFrequency}
- Focus Area: ${focusArea}
- Mood: ${userData.mood}

Generate one short, encouraging health insight (2–3 sentences).
Focus on motivation, wellness, and mental balance — no medical advice.
`;

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

    return response.data.choices?.[0]?.message?.content?.trim() ||
      "Remember to take small breaks, move your body, and stay positive today.";
  } catch (error) {
    console.error("AI Men Health Insight Error:", error.message);
    return "Focus on progress, not perfection. Keep taking care of yourself.";
  }
}

module.exports = { generateMenHealthInsight };

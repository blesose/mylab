import { localAIResponse } from "../../../ai/localAI.engine.js";

export async function generateSelfCareAdvice(userName, trendData) {
  const prompt = `
  User: ${userName}
  Mood trend: ${trendData}
  Give a short, empathetic self-care suggestion.
  Format: 💡 Suggestion: <tip>
  `;

  const response = await localAIResponse(prompt);
  return response;
}

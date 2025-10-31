// src/modules/femaleHealth/fitnessNutrition/services/nutrition.ai.service.js
const axios = require("axios");
const { parseAIResponse } = require("../utils/nutrition.utils");

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const HF_API_KEY = process.env.HF_API_KEY || "";

async function callOpenAI(prompt, options = {}) {
  if (!OPENAI_KEY) throw new Error("OPENAI_API_KEY missing");
  const body = {
    model: options.model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options.maxTokens || 350,
    temperature: options.temperature ?? 0.7,
  };
  const res = await axios.post("https://api.openai.com/v1/chat/completions", body, {
    headers: { Authorization: `Bearer ${OPENAI_KEY}` },
    timeout: 15000,
  });
  const text = res.data.choices?.[0]?.message?.content || "";
  return parseAIResponse(text);
}

async function callHuggingFace(prompt, options = {}) {
  if (!HF_API_KEY) throw new Error("HF API key missing");
  const res = await axios.post(
    "https://api-inference.huggingface.co/models/gpt2", // replace with an actual HF model if available
    { inputs: prompt },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` }, timeout: 15000 }
  );
  const text = res.data?.generated_text || res.data?.[0]?.generated_text || "";
  return parseAIResponse(text);
}

/**
 * generateMealPlanAI
 * - Tries OpenAI first, falls back to HF if available, else returns a simple local plan
 */
async function generateMealPlanAI(context) {
  const prompt = buildMealPlanPrompt(context);
  try {
    return await callOpenAI(prompt);
  } catch (err) {
    console.warn("OpenAI failed, trying HuggingFace:", err.message);
    try {
      return await callHuggingFace(prompt);
    } catch (err2) {
      console.error("HF failed:", err2.message);
      // final fallback: simple heuristic plan
      return { text: generateFallbackPlanText(context) };
    }
  }
}

/* Helpers */
function buildMealPlanPrompt(ctx) {
  // ctx: { calories, proteinG, fatG, carbsG, dietaryPreference, allergies, mealsPerDay, goal, activityLevel }
  return `
You are a helpful nutrition coach. Generate a ${ctx.mealsPerDay || 3}-meal daily plan that matches the following constraints:
- Total calories: ${ctx.calories} kcal
- Protein: ~${ctx.proteinG} g, Fat: ~${ctx.fatG} g, Carbs: ~${ctx.carbsG} g
- Dietary preference: ${ctx.dietaryPreference || "no preference"}
- Allergies / avoid: ${ctx.allergies?.join(", ") || "none"}
- Goal: ${ctx.goal}
Return the result as JSON with keys: meals (array of { name, ingredients, calories, protein, fat, carbs }), total (calories, protein, fat, carbs) and a one-line tip.
If you cannot provide JSON, still include a JSON block at the end.
`;
}

function generateFallbackPlanText(ctx) {
  return `Fallback plan: ${ctx.mealsPerDay || 3} meals totaling ${ctx.calories} kcal. Targets (P/F/C): ${ctx.proteinG}/${ctx.fatG}/${ctx.carbsG}. Example: Breakfast - oats + yogurt; Lunch - grilled protein + veg + rice; Dinner - salad + protein.`;
}

module.exports = { generateMealPlanAI };

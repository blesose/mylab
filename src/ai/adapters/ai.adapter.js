const { generateLocalResponse } = require('../local/ai.local');

async function generateAIResponse(prompt, options = {}) {
  const mode = process.env.AI_MODE || 'local'; // can later switch to 'openai' or 'hf'

  if (mode === 'local') {
    return await generateLocalResponse(prompt);
  }

  // fallback for future integrations
  if (mode === 'openai') {
    const { generateOpenAIResponse } = require('./openai.adapter');
    return await generateOpenAIResponse(prompt);
  }

  if (mode === 'hf') {
    const { generateHFResponse } = require('./hf.adapter');
    return await generateHFResponse(prompt);
  }

  throw new Error(`Unknown AI mode: ${mode}`);
}

module.exports = { generateAIResponse };

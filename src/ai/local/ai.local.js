const { GPT4All } = require('gpt4all');
const path = require('path');

let gptInstance = null;

async function initLocalAI() {
  if (!gptInstance) {
    const modelPath = path.join(__dirname, 'models');
    gptInstance = new GPT4All('mistral-7b-openorca.Q4_0.gguf', {
      modelPath,
      verbose: true,
    });
    await gptInstance.init();
  }
  return gptInstance;
}

async function generateLocalResponse(prompt) {
  const gpt = await initLocalAI();
  const response = await gpt.prompt(prompt);
  return response.trim();
}

module.exports = { generateLocalResponse };

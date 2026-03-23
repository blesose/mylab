exports.generateAIFriendlyMessage = async (eventType, postTitle) => {
  const prompt = `
  Write a friendly short notification for event: ${eventType} on post "${postTitle}".
  Example style: "🎉 Someone just engaged with your post — keep sharing your thoughts!"
  `;
  return await localAIResponse(prompt);
};

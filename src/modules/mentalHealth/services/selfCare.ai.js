import { generateSelfCareAdvice } from "../modules/selfCare/service/selfCare.ai.js";
import { localAIResponse } from "../ai/localAI.engine.js";

// Mock the localAIResponse module
jest.mock("../ai/localAI.engine.js", () => ({
  localAIResponse: jest.fn(),
}));

describe("Self-Care AI Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call localAIResponse with a formatted prompt", async () => {
    localAIResponse.mockResolvedValue("💡 Suggestion: Take a short walk outside.");

    const userName = "Jane";
    const trendData = "User has been sad for 3 days.";
    await generateSelfCareAdvice(userName, trendData);

    expect(localAIResponse).toHaveBeenCalledTimes(1);
    const prompt = localAIResponse.mock.calls[0][0];

    // verify prompt structure
    expect(prompt).toMatch(/User: Jane/);
    expect(prompt).toMatch(/Mood trend: User has been sad for 3 days/);
    expect(prompt).toMatch(/Give a short, empathetic self-care suggestion/);
  });

  it("should return the AI-generated suggestion", async () => {
    const mockResponse = "💡 Suggestion: Try breathing exercises.";
    localAIResponse.mockResolvedValue(mockResponse);

    const result = await generateSelfCareAdvice("Jane", "feeling anxious");
    expect(result).toBe(mockResponse);
  });

  it("should handle errors gracefully", async () => {
    localAIResponse.mockRejectedValue(new Error("AI engine timeout"));

    await expect(
      generateSelfCareAdvice("Jane", "negative mood trend")
    ).rejects.toThrow("AI engine timeout");
  });
});


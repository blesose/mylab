async function getAIInsight(prompt) {
  console.log("🔍 AI prompt received:", prompt);

  if (prompt.includes("fitness")) {
    return ["Stay consistent with your workouts", "Track your hydration daily"];
  } else if (prompt.includes("femaleHealth")) {
    return ["Monitor your cycle regularly", "Maintain a balanced diet"];
  } else if (prompt.includes("sleep")) {
    return ["Avoid screens 1 hour before bed", "Try consistent sleep schedules"];
  }

  return ["Maintain consistency and track your progress weekly."];
}

module.exports = { getAIInsight };
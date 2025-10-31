async function getAIInsight(prompt) {
  // Local lightweight AI simulation
  console.log("🔍 AI prompt received:", prompt);

  // Simple pattern-based insight generation
  if (prompt.includes("fitness")) {
    return ["Stay consistent with your workouts", "Track your hydration daily"];
  } else if (prompt.includes("femaleHealth")) {
    return ["Monitor your cycle regularly", "Maintain a balanced diet"];
  } else if (prompt.includes("sleep")) {
    return ["Avoid screens 1 hour before bed", "Try consistent sleep schedules"];
  }

  // Default insight
  return ["Maintain consistency and track your progress weekly."];
}

module.exports = { getAIInsight };
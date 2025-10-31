function getAIInsight(prompt) {
  // Local AI mockup for production-ready fallback
  if (!prompt) return ["No prompt provided."];

  if (prompt.includes("sleep")) {
    return [
      "Maintain a consistent bedtime.",
      "Avoid caffeine before sleep.",
      "Reduce screen time before bed.",
    ];
  }
  if (prompt.includes("nutrition")) {
    return [
      "Eat balanced meals with proteins, carbs, and vitamins.",
      "Stay hydrated throughout the day.",
      "Include fruits and vegetables in your diet.",
    ];
  }
  if (prompt.includes("fitness")) {
    return [
      "Track progress weekly.",
      "Warm up before workouts.",
      "Ensure proper rest between sessions.",
    ];
  }
  return [
    "Stay consistent.",
    "Review your data weekly.",
    "Maintain positive lifestyle habits.",
  ];
}

/** Trend summarization */
function summarizeReports(reports) {
  if (!Array.isArray(reports) || reports.length === 0)
    return "No historical data available.";

  let improving = 0,
    stable = 0,
    declining = 0;

  reports.forEach((r) => {
    const score = extractScore(r);
    if (score > 70) improving++;
    else if (score >= 50) stable++;
    else declining++;
  });

  if (improving > stable && improving > declining)
    return "💪 Overall improvement observed. Keep it up!";
  if (declining > improving)
    return "⚠ Decline detected. Review your routines.";
  return "📊 Performance stable.";
}

function extractScore(report) {
  const match = report.summary.match(/Average score: ([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

function detectTrend(reports) {
  if (!reports.length) return "No data available.";
  const scores = reports.map(extractScore);
  const diff = scores[0] - scores[scores.length - 1];
  if (diff > 10) return `📈 Improved by ${diff.toFixed(1)} points!`;
  if (diff < -10) return`📉 Dropped by ${Math.abs(diff).toFixed(1)} points.`;
  return "⚖ Stable performance trend.";
}

module.exports = { getAIInsight, summarizeReports, detectTrend };
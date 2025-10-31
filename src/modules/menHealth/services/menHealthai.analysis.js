function analyzeStressPattern(entries) {
  const avg = entries.reduce((a, b) => a + b.stressLevel, 0) / entries.length;
  if (avg > 7) return "High stress trend detected";
  if (avg > 4) return "Moderate stress trend";
  return "Healthy stress balance";
}

module.exports = { analyzeStressPattern };

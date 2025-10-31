function aggregateUserScores(records) {
  // Extract numeric fields for averaging
  const scores = records.map(r => r.moodScore || r.energyLevel || 0);
  return scores.filter(Boolean);
}

module.exports = { aggregateUserScores };

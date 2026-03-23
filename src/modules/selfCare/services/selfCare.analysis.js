const analyzeSelfCare = (duration, moodBefore, moodAfter) => {

  // Helper to convert mood to number for comparison
  const moodToNumber = (mood) => {
    if (typeof mood === 'number') return mood;
    const mapping = {
      'happy': 9,
      'neutral': 5,
      'sad': 3,
      'stressed': 2,
      'tired': 4
    };
    return mapping[mood] || 5;
  };

  const beforeNum = moodToNumber(moodBefore);
  const afterNum = moodToNumber(moodAfter);
  
  const improvement = afterNum > beforeNum;
  const significantImprovement = (afterNum - beforeNum) >= 2;
  const decline = afterNum < beforeNum;

  let message;
  if (significantImprovement) {
    message = "Excellent mood improvement! This activity works well for you.";
  } else if (improvement) {
    message = "Your mood improved after this activity. Keep it up!";
  } else if (decline) {
    message = "Your mood decreased. Consider adjusting duration or trying a different activity.";
  } else {
    message = "Mood stayed consistent. Try increasing duration or frequency for better results.";
  }

  return {
    improvement,
    significantImprovement,
    decline,
    message,
    moodChange: afterNum - beforeNum,
    score: improvement ? duration * 1.2 : duration * 0.8,
  };
};

module.exports = { analyzeSelfCare };
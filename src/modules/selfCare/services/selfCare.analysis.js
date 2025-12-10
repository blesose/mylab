const analyzeSelfCare = (duration, moodBefore, moodAfter) => {
  const improvement = moodBefore !== moodAfter;
  const message = improvement
    ? "Your mood improved after this activity. Keep it up!"
    : "Try increasing your duration or changing the activity for better effect.";

  return {
    improvement,
    message,
    score: improvement ? duration * 1.2 : duration * 0.8,
  };
};

module.exports = { analyzeSelfCare };
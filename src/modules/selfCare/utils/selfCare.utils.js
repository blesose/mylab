export const suggestNextActivity = (mood) => {
  const suggestions = {
    happy: "Keep your routine steady — journaling or stretching helps maintain positivity.",
    neutral: "Try a short meditation or gratitude exercise to lift your mood.",
    sad: "Go for a walk or write down your thoughts — physical movement helps.",
    stressed: "Practice deep breathing or mindfulness for at least 10 minutes.",
  };
  return suggestions[mood] || "Do something that makes you feel calm and relaxed.";
};
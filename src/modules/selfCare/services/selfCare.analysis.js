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
// function analyzeSelfCareTrends(activities) {
//   const total = activities.length;
//   const byType = {};
//   for (let act of activities) {
//     byType[act.activityType] = (byType[act.activityType] || 0) + 1;
//   }

//   const mostFrequent = Object.keys(byType).reduce(
//     (a, b) => (byType[a] > byType[b] ? a : b),
//     Object.keys(byType)[0] || "none"
//   );

//   return {
//     totalActivities: total,
//     mostFrequent,
//     diversityScore: Object.keys(byType).length,
//   };
// }


// module.exports = { analyzeSelfCareTrends };


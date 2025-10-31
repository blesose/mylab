const getWeeklyTip = (week, gender="female") => {
  const tips = [
    "Stay hydrated and eat iron-rich foods like spinach and beans.",
    "Gentle exercises like walking or prenatal yoga can improve circulation.",
    "Remember to rest — your body is working overtime to grow your baby!",
    "Avoid skipping meals; aim for small frequent nutritious snacks.",
    "Schedule your next antenatal visit and track fetal movements.",
    "Stay positive — mental calmness supports healthy pregnancy outcomes.",
    "Monitor any new symptoms and discuss changes with your healthcare provider.",
    "Focus on calcium and vitamin D for stronger bones and baby development.",
    "Use pregnancy-safe skincare and avoid harsh chemicals.",
    "Start preparing a birth plan and list of baby essentials.",
  ];
  const index = week % tips.length;
  let moodTip = "";
  if (week < 4) moodTip = "You’re in your early stage! Focus on rest and hydration.";
  else if (week < 12) moodTip = "First trimester—expect some nausea; eat lightly and stay calm.";
  else if (week < 28) moodTip = "Second trimester—energy boost! Start gentle workouts.";
  else moodTip = "Third trimester—prepare your mind and space for your baby.";
  const closing = gender === "female" ? "🌸 Keep nurturing yourself — you’re doing great." : "🤝 Keep supporting your partner’s health journey.";
  return `${moodTip} ${tips[index]} ${closing}`;
};

module.exports = { getWeeklyTip }
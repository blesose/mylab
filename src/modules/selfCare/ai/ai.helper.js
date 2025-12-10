   // SelfCare AI Helper
  // --------------------------------------------------
 // Generates intelligent, human-like self-care insights and
// practical tips based on user mood, activity, and duration.
// This is a local/offline simulation suitable for production,
// but can later be extended to real AI APIs.
 

const { randomUUID } = require("crypto");

// Basic local intelligence for pattern analysis
const analyzeMoodShift = (moodBefore, moodAfter, duration) => {
  const improved =
    (moodBefore === "sad" || moodBefore === "stressed") &&
    (moodAfter === "neutral" || moodAfter === "happy");

  const sameMood = moodBefore === moodAfter;

  let summary;
  if (improved) {
    summary = "You showed a positive mood shift — this activity seems effective!";
  } else if (sameMood) {
    summary =
      "No noticeable mood change detected. Try longer sessions or switching activities.";
  } else {
    summary =
      "Your mood dipped after the activity — consider trying a calmer routine or resting more.";
  }

  const score = improved ? duration * 1.2 : sameMood ? duration * 0.9 : duration * 0.7;

  return { improved, summary, score };
};

// Generate a smart self-care tip using local rule-based AI
const getSmartSelfCareTip = ({ activityType, duration, moodBefore, moodAfter }) => {
  const activityTips = {
    meditation: [
      "Try guided meditation apps or background ambient sounds to deepen relaxation.",
      "Consistency matters more than duration — even 10 minutes daily helps.",
      "Focus on breathing and let thoughts pass gently without judgment.",
    ],
    journaling: [
      "Write freely — don’t edit as you go. Let emotions flow naturally.",
      "Try gratitude journaling to improve mood consistency over time.",
      "If you're stuck, start by writing what you’re thankful for today.",
    ],
    sleep: [
      "Keep a consistent bedtime and avoid screens 30 minutes before sleep.",
      "Try stretching lightly before bed for a smoother transition to rest.",
      "Dim your lights an hour before bedtime to signal your body it’s time to sleep.",
    ],
    skinCare: [
      "Drink plenty of water and use products suitable for your skin type.",
      "Simplify your routine — cleanse, moisturize, protect. Quality over quantity.",
      "Consistency in skincare often beats expensive products.",
    ],
    mindfulness: [
      "Practice grounding — focus on your breath and sensations in the moment.",
      "Take a mindful walk without your phone and observe your surroundings.",
      "Use short 2-minute breathing breaks throughout your day.",
    ],
    other: [
      "Remember: self-care isn’t selfish — it’s essential for your mental balance.",
      "Small, consistent actions often lead to big long-term improvements.",
      "Take time to disconnect and do something creative or enjoyable.",
    ],
  };

  const pool = activityTips[activityType] || activityTips.other;
  const randomTip = pool[Math.floor(Math.random() * pool.length)];

  const analysis = analyzeMoodShift(moodBefore, moodAfter, duration);

  return {
    id: randomUUID(),
    type: activityType,
    duration,
    improved: analysis.improved,
    summary: analysis.summary,
    tip: randomTip,
    score: analysis.score,
    timestamp: new Date(),
  };
};

module.exports = { getSmartSelfCareTip };
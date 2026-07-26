
const { randomUUID } = require("crypto");

// Helper function to normalize mood values (handles both string and number)
const normalizeMood = (moodValue) => {
  if (typeof moodValue === 'number') {
    // Convert number (1-10) to string mood
    if (moodValue >= 9) return 'happy';
    if (moodValue >= 7) return 'happy';
    if (moodValue >= 5) return 'neutral';
    if (moodValue >= 3) return 'sad';
    return 'stressed';
  }
  
  if (typeof moodValue === 'string') {
    // Ensure string is lowercase and matches expected values
    const lowerMood = moodValue.toLowerCase();
    const validMoods = ['happy', 'neutral', 'sad', 'stressed', 'tired'];
    return validMoods.includes(lowerMood) ? lowerMood : 'neutral';
  }
  
  return 'neutral'; 
};

// Basic local intelligence for pattern analysis
const analyzeMoodShift = (moodBefore, moodAfter, duration) => {
  // Normalize mood values first
  const beforeNormalized = normalizeMood(moodBefore);
  const afterNormalized = normalizeMood(moodAfter);
  
  const improved =
    (beforeNormalized === "sad" || beforeNormalized === "stressed" || beforeNormalized === "tired") &&
    (afterNormalized === "neutral" || afterNormalized === "happy");

  const sameMood = beforeNormalized === afterNormalized;

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

  return { 
    improved, 
    summary, 
    score,
    moodBefore: beforeNormalized,
    moodAfter: afterNormalized
  };
};

// Generate a smart self-care tip using local rule-based AI
const getSmartSelfCareTip = ({ activityType, duration, moodBefore, moodAfter }) => {
  // Normalize activity type (handle new activity types)
  const normalizedActivityType = normalizeActivityType(activityType);
  
  const activityTips = {
    meditation: [
      "Try guided meditation apps or background ambient sounds to deepen relaxation.",
      "Consistency matters more than duration — even 10 minutes daily helps.",
      "Focus on breathing and let thoughts pass gently without judgment.",
    ],
    journaling: [
      "Write freely — don't edit as you go. Let emotions flow naturally.",
      "Try gratitude journaling to improve mood consistency over time.",
      "If you're stuck, start by writing what you're thankful for today.",
    ],
    sleep: [
      "Keep a consistent bedtime and avoid screens 30 minutes before sleep.",
      "Try stretching lightly before bed for a smoother transition to rest.",
      "Dim your lights an hour before bedtime to signal your body it's time to sleep.",
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
    reading: [
      "Reading before bed can help you unwind and improve sleep quality.",
      "Try different genres to see what resonates with your current mood.",
      "Set a reading goal, but don't pressure yourself — enjoy the journey.",
    ],
    exercise: [
      "Mix cardio and strength training for both mental and physical benefits.",
      "Even a 20-minute walk can significantly boost your mood and energy.",
      "Listen to your body — rest when needed to prevent burnout.",
    ],
    music: [
      "Create different playlists for different moods — energizing, calming, focusing.",
      "Try learning an instrument as a long-term mindfulness activity.",
      "Music therapy can be powerful — let yourself feel the emotions in songs.",
    ],
    nature: [
      "Spending time in nature reduces stress and improves mental clarity.",
      "Try 'forest bathing' — slow, mindful walking in natural surroundings.",
      "Even looking at pictures of nature or having plants indoors can help.",
    ],
    social: [
      "Quality social connections are vital for mental health — prioritize meaningful interactions.",
      "Don't compare your social life to others — focus on relationships that feel authentic.",
      "Even short check-ins with loved ones can boost mood significantly.",
    ],
    hobby: [
      "Creative hobbies activate different parts of your brain and reduce stress.",
      "Don't worry about being perfect — the process matters more than the result.",
      "Try rotating through different hobbies to keep things fresh and engaging.",
    ],
    relaxation: [
      "Progressive muscle relaxation can help release physical tension.",
      "Warm baths with Epsom salts can soothe both body and mind.",
      "Schedule regular relaxation time — it's as important as work time.",
    ],
    self_reflection: [
      "Regular self-reflection helps you understand your needs and boundaries.",
      "Ask yourself: 'What do I need right now?' and listen to the answer.",
      "Reflection without judgment is key — observe, don't criticize.",
    ],
    other: [
      "Remember: self-care isn't selfish — it's essential for your mental balance.",
      "Small, consistent actions often lead to big long-term improvements.",
      "Take time to disconnect and do something creative or enjoyable.",
    ],
  };

  const pool = activityTips[normalizedActivityType] || activityTips.other;
  const randomTip = pool[Math.floor(Math.random() * pool.length)];

  const analysis = analyzeMoodShift(moodBefore, moodAfter, duration);

  return {
    id: randomUUID(),
    type: normalizedActivityType,
    duration,
    improved: analysis.improved,
    summary: analysis.summary,
    tip: randomTip,
    score: analysis.score,
    moodBefore: analysis.moodBefore,
    moodAfter: analysis.moodAfter,
    timestamp: new Date(),
  };
};

// Helper to normalize activity types (maps frontend types to backend)
const normalizeActivityType = (activityType) => {
  const mapping = {
    // Frontend -> Backend mapping
    'meditation': 'meditation',
    'reading': 'reading',
    'exercise': 'exercise',
    'music': 'music',
    'nature': 'nature',
    'journaling': 'journaling',
    'social': 'social',
    'hobby': 'hobby',
    'relaxation': 'relaxation',
    'self_reflection': 'self_reflection',
    'skinCare': 'skinCare',
    'mindfulness': 'mindfulness',
    'sleep': 'sleep',
  };
  
  return mapping[activityType] || 'other';
};

// Additional helper for more detailed mood analysis
const getDetailedMoodAnalysis = (moodBefore, moodAfter, activityType) => {
  const before = normalizeMood(moodBefore);
  const after = normalizeMood(moodAfter);
  
  const moodInsights = {
    'happy->happy': 'Maintaining happiness is a skill — keep doing what works!',
    'neutral->happy': 'Great job elevating your mood!',
    'sad->happy': 'Impressive mood turnaround!',
    'stressed->happy': 'Excellent stress management!',
    'tired->happy': 'You found energy and joy!',
    'happy->neutral': 'Consider what caused the dip to maintain happiness.',
    'neutral->neutral': 'Try adding something new to your routine.',
    'sad->sad': 'Consider professional support or trying different activities.',
    'stressed->stressed': 'Deep relaxation techniques might help.',
    'tired->tired': 'Focus on rest and recovery activities.',
  };
  
  const key = `${before}->${after}`;
  return moodInsights[key] || 'Every self-care effort counts toward your wellbeing.';
};

// Export all functions
module.exports = { 
  getSmartSelfCareTip,
  normalizeMood,
  normalizeActivityType,
  getDetailedMoodAnalysis
};
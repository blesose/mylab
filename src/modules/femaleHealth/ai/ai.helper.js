function generateSmartHealthTip({ category, userData = {}, context }) {
  const notes = (userData.notes || "").toLowerCase();

  if (category === "Pregnancy") {
    const week = userData.currentWeek || 1;
    if (week <= 12) return "Focus on prenatal vitamins, hydration, and rest. Avoid stress — your baby’s organs are forming.";
    if (week <= 26) return "Eat iron-rich foods, stay active, and begin light exercises. Keep track of baby movements.";
    if (week <= 40) return "Prepare for delivery: pack a hospital bag, attend antenatal sessions, and rest frequently.";
    return "Maintain regular medical checkups and follow your doctor’s guidance.";
  }

  if (category === "Cycle") {
    if (notes.includes("pain") || notes.includes("cramp"))
      return "Apply a warm compress, drink water, and try light stretching. If pain persists, consult your doctor.";
    if (notes.includes("heavy"))
      return "You noted heavy flow — increase your iron intake, stay hydrated, and rest when needed.";
    if (notes.includes("light"))
      return "Your flow seems light. This can happen due to stress or hormonal shifts — track it for consistency.";
    if (notes.includes("irregular"))
      return "Cycle irregularity detected. Keep tracking for 2–3 months and seek medical advice if it continues.";

    return "Track your cycle regularly and eat iron-rich foods to replace blood loss during menstruation.";
  }

  if (category === "Ovulation") {
    return "You’re in your fertile window — maintain a healthy diet, manage stress, and consider tracking basal body temperature for better accuracy.";
  }

  return "Listen to your body and maintain healthy habits daily.";
}

module.exports = { generateSmartHealthTip };


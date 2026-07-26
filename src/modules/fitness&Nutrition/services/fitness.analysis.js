function analyzeFitnessProgress(records) {
  if (!records.length)
    return { message: "No activity data yet.", trend: "N/A", avgDuration: 0 };

  const avgDuration = records.reduce((s, r) => s + r.duration, 0) / records.length;
  const highIntensityCount = records.filter(r => r.intensity === "high").length;
  const highRatio = highIntensityCount / records.length;

  const trend = highRatio > 0.6 ? "High intensity trend" : "Moderate consistency";
  const message =
    highRatio > 0.6
      ? "You’ve maintained a strong routine!"
      : "Your effort is steady — consider raising intensity.";

  return { message, trend, avgDuration: Math.round(avgDuration) };
}

module.exports = { analyzeFitnessProgress };

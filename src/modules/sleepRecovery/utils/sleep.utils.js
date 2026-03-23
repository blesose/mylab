export const recommendSleepTime = (wakeUpTime) => {
  // Return optimal bedtime (about 7.5 hrs earlier)
  const [h, m] = wakeUpTime.split(":").map(Number);
  let bedtimeHour = h - 7;
  if (bedtimeHour < 0) bedtimeHour += 24;

  return `${bedtimeHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

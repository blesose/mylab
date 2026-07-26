export const recommendSleepTime = (wakeUpTime) => {
  const [h, m] = wakeUpTime.split(":").map(Number);
  let bedtimeHour = h - 7;
  if (bedtimeHour < 0) bedtimeHour += 24;

  return `${bedtimeHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

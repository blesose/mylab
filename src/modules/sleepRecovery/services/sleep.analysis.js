const { differenceInHours, differenceInMinutes, parse } = require("date-fns");

const analyzeSleepPattern = (sleepStart, sleepEnd, sleepQuality) => {
  const start = parse(sleepStart, "HH:mm", new Date());
  const end = parse(sleepEnd, "HH:mm", new Date());
  let hoursSlept = differenceInMinutes(end, start) / 60;

  if (hoursSlept < 0) hoursSlept += 24; // Adjust for midnight crossover

  const category =
    hoursSlept < 5 ? "Insufficient" :
    hoursSlept < 7 ? "Moderate" : "Optimal";

  const message =
    sleepQuality < 5
      ? "Your sleep quality is low — avoid screens and caffeine before bed."
      : "Good sleep quality! Keep your routine consistent.";

  return { hoursSlept, category, message };
};

module.exports = { analyzeSleepPattern }
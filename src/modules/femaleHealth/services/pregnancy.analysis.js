const { determineTrimester } = require("../utils/calculatePregnancy");

const generatePregnancyInsights = (week) => {
  const trimester = determineTrimester(week);

  let message;
  if (week < 13) message = "Your baby is developing organs and heartbeat.";
  else if (week < 27) message = "Baby is growing rapidly and movements may begin.";
  else message = "Baby is gaining weight and preparing for birth.";

  return { trimester, message };
};

module.exports = { generatePregnancyInsights };

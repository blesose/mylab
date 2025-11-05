/**
 * Calculate the number of days between two dates
 */
const calculatePeriodLength = (start, end) => {
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
// function calculateNextCycle(startDate, cycleLength = 28) {
//   const nextCycle = new Date(startDate);
//   nextCycle.setDate(nextCycle.getDate() + cycleLength);
//   return nextCycle;
// }
function calculateNextCycle(startDate, cycleLength = 28) {
  if (!startDate) throw new Error("startDate is required for cycle calculation");

  const start = new Date(startDate);
  if (isNaN(start)) throw new Error("Invalid startDate format");

  const nextCycle = new Date(start);
  nextCycle.setDate(nextCycle.getDate() + (cycleLength || 28));
  return nextCycle.toISOString();
}


module.exports = { calculateNextCycle, calculatePeriodLength };



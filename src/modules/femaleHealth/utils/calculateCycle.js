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
// function calculateNextCycle(startDate, cycleLength) {
//   const start = new Date(startDate);
//   const nextCycleStart = new Date(start);
//   nextCycleStart.setDate(start.getDate() + cycleLength);
//   return nextCycleStart.toISOString().split("T")[0]; // returns yyyy-mm-dd
// }
// const startDate = "2025-10-01";
// const cycleLength = 28;
// console.log(calculateNextCycle(startDate, cycleLength));


/**
 * Predict next cycle start date
 */
// const calculateNextCycle = (start, cycleLength = 28) => {
//   const next = new Date(start);
//   next.setDate(next.getDate() + cycleLength);
//   return next;
// };

module.exports = { calculateNextCycle, calculatePeriodLength };



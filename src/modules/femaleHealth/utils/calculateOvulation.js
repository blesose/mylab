/**
 * Ovulation typically occurs 14 days before next period.
 * Fertile window: 5 days before ovulation + ovulation day itself.
 */

const calculateOvulation = (cycleStart, cycleLength = 28) => {
  const start = new Date(cycleStart);
  const ovulation = new Date(start);
  ovulation.setDate(start.getDate() + (cycleLength - 14));

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(ovulation.getDate() - 5);

  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(ovulation.getDate() + 1);

  return { ovulation, fertileStart, fertileEnd };
};

module.exports = { calculateOvulation };

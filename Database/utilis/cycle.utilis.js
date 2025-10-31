// cycle.utils.js
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * daysBetween(a, b) - inclusive days between two dates
 */
const daysBetween = (a, b) => {
  const start = new Date(a);
  const end = new Date(b);
  return Math.round((end - start) / MS_PER_DAY);
};

/**
 * average(values) - returns average or null
 */
const average = (values) => {
  if (!values || values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
};

/**
 * computeCycleStats(cycles)
 * - cycles: array of Cycle docs sorted by startDate ascending (old -> new)
 * returns: { avgCycleLength, avgPeriodLength, cycleLengths: [...], periodLengths: [...] }
 */
const computeCycleStats = (cycles) => {
  if (!cycles || cycles.length < 2) {
    const periodLens = cycles.map((c) => c.periodLength).filter(Boolean);
    return { avgCycleLength: null, avgPeriodLength: periodLens.length ? average(periodLens) : null, cycleLengths: [], periodLengths: periodLens };
  }

  const cycleLengths = [];
  const periodLengths = [];

  for (let i = 1; i < cycles.length; i++) {
    const prev = cycles[i - 1];
    const curr = cycles[i];
    const diff = daysBetween(prev.startDate, curr.startDate);
    cycleLengths.push(diff);
  }

  cycles.forEach((c) => {
    if (c.periodLength) periodLengths.push(c.periodLength);
    else if (c.endDate) {
      const diff = daysBetween(c.startDate, c.endDate) + 1;
      periodLengths.push(diff);
    }
  });

  return {
    avgCycleLength: cycleLengths.length ? Math.round(average(cycleLengths)) : null,
    avgPeriodLength: periodLengths.length ? Math.round(average(periodLengths)) : null,
    cycleLengths,
    periodLengths,
  };
};

/**
 * predictNextPeriod(lastCycles, options)
 * - lastCycles: array of cycles (most recent last) or at least the latest cycle
 * - options: { defaultCycleLength: number, defaultPeriodLength: number }
 * Returns: { predictedStartDate, predictedEndDate, usedCycleLength, usedPeriodLength }
 */
const predictNextPeriod = (lastCycles = [], options = {}) => {
  const defaultCycleLength = options.defaultCycleLength || 28;
  const defaultPeriodLength = options.defaultPeriodLength || 5;

  // compute average from historical cycles if available
  const stats = computeCycleStats(lastCycles);
  const usedCycleLength = stats.avgCycleLength || defaultCycleLength;
  const usedPeriodLength = stats.avgPeriodLength || defaultPeriodLength;

  // latest cycle is the most recent by startDate
  const latest = lastCycles.length ? lastCycles[lastCycles.length - 1] : null;
  const baseStart = latest ? new Date(latest.startDate) : new Date();

  const predictedStart = new Date(baseStart);
  predictedStart.setDate(predictedStart.getDate() + usedCycleLength);

  const predictedEnd = new Date(predictedStart);
  predictedEnd.setDate(predictedEnd.getDate() + usedPeriodLength - 1);

  return {
    predictedStartDate: predictedStart,
    predictedEndDate: predictedEnd,
    usedCycleLength,
    usedPeriodLength,
  };
};

/**
 * predictOvulationWindow(predictedStartDate, cycleLength)
 * - Ovulation typically occurs ~14 days before next period start (assuming luteal phase ~14 days)
 * - Fertile window ~ 5 days before ovulation + day of ovulation
 *
 * Returns: { ovulationDate, fertileWindowStart, fertileWindowEnd }
 */
const predictOvulationWindow = (predictedStartDate, cycleLength = 28, lutealPhase = 14) => {
  // ovulationDate = predictedStartDate - lutealPhase days
  const ovulationDate = new Date(predictedStartDate);
  ovulationDate.setDate(ovulationDate.getDate() - lutealPhase);

  // fertile window: 5 days before ovulation to ovulation day
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);

  return { ovulationDate, fertileWindowStart: fertileStart, fertileWindowEnd: fertileEnd };
};

module.exports = { daysBetween, computeCycleStats, predictNextPeriod, predictOvulationWindow };

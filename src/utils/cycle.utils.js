const MS_PER_DAY = 24*60*60*1000;

const daysBetween = (a,b) => Math.round((new Date(b) - new Date(a))/MS_PER_DAY);

const average = (arr) => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : null;

const computeCycleStats = (cycles) => {
  if (!cycles || cycles.length < 2) {
    const periodLens = cycles.map(c => c.periodLength).filter(Boolean);
    return { avgCycleLength: null, avgPeriodLength: periodLens.length ? Math.round(average(periodLens)) : null, cycleLengths: [], periodLengths: periodLens };
  }
  const cycleLengths = [];
  const periodLengths = [];
  for (let i=1;i<cycles.length;i++) {
    cycleLengths.push(daysBetween(cycles[i-1].startDate, cycles[i].startDate));
  }
  cycles.forEach(c => {
    if (c.periodLength) periodLengths.push(c.periodLength);
    else if (c.endDate) periodLengths.push(daysBetween(c.startDate, c.endDate) + 1);
  });
  return { avgCycleLength: cycleLengths.length ? Math.round(average(cycleLengths)) : null, avgPeriodLength: periodLengths.length ? Math.round(average(periodLengths)) : null, cycleLengths, periodLengths };
};

const predictNextPeriod = (lastCycles = [], options = {}) => {
  const defaultCycleLength = options.defaultCycleLength || 28;
  const defaultPeriodLength = options.defaultPeriodLength || 5;
  const stats = computeCycleStats(lastCycles);
  const usedCycleLength = stats.avgCycleLength || defaultCycleLength;
  const usedPeriodLength = stats.avgPeriodLength || defaultPeriodLength;
  const latest = lastCycles.length ? lastCycles[lastCycles.length-1] : null;
  const baseStart = latest ? new Date(latest.startDate) : new Date();
  const predictedStart = new Date(baseStart); predictedStart.setDate(predictedStart.getDate() + usedCycleLength);
  const predictedEnd = new Date(predictedStart); predictedEnd.setDate(predictedEnd.getDate() + usedPeriodLength - 1);
  return { predictedStartDate: predictedStart, predictedEndDate: predictedEnd, usedCycleLength, usedPeriodLength };
};

const predictOvulationWindow = (predictedStartDate, cycleLength = 28, lutealPhase = 14) => {
  const ovulationDate = new Date(predictedStartDate); ovulationDate.setDate(ovulationDate.getDate() - lutealPhase);
  const fertileStart = new Date(ovulationDate); fertileStart.setDate(fertileStart.getDate() - 5);
  const fertileEnd = new Date(ovulationDate);
  return { ovulationDate, fertileWindowStart: fertileStart, fertileWindowEnd: fertileEnd };
};

module.exports = { computeCycleStats, predictNextPeriod, predictOvulationWindow, daysBetween, average };

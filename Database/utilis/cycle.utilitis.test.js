const { computeCycleStats, predictNextPeriod, predictOvulationWindow } = require("../cycle.utils");

describe("cycle.utils", () => {
  test("computeCycleStats returns nulls for empty input", () => {
    const stats = computeCycleStats([]);
    expect(stats.avgCycleLength).toBeNull();
    expect(stats.avgPeriodLength).toBeNull();
  });

  test("computeCycleStats computes cycle lengths", () => {
    const cycles = [
      { startDate: new Date("2025-01-01"), periodLength: 5 },
      { startDate: new Date("2025-01-29"), periodLength: 4 },
      { startDate: new Date("2025-02-26"), periodLength: 5 },
    ];
    const stats = computeCycleStats(cycles);
    // cycle lengths: 28, 28 -> avg 28
    expect(stats.avgCycleLength).toBe(28);
    expect(stats.avgPeriodLength).toBe(5); // average of [5,4,5] is 4.666 -> rounded to 5
    expect(stats.cycleLengths.length).toBe(2);
  });

  test("predictNextPeriod uses average to predict", () => {
    const cycles = [
      { startDate: new Date("2025-01-01"), periodLength: 5 },
      { startDate: new Date("2025-01-29"), periodLength: 4 },
    ];
    const { predictedStartDate, usedCycleLength } = predictNextPeriod(cycles, {});
    // last startDate 2025-01-29 + avg(28) => predicted around 2025-02-26
    const expected = new Date("2025-02-26");
    expect(usedCycleLength).toBe(28);
    expect(predictedStartDate.toDateString()).toBe(expected.toDateString());
  });

  test("predictOvulationWindow returns ovulation and fertile window", () => {
    const predictedStart = new Date("2025-03-01");
    const { ovulationDate, fertileWindowStart, fertileWindowEnd } = predictOvulationWindow(predictedStart, 28, 14);
    expect(ovulationDate.toDateString()).toBe(new Date("2025-02-15").toDateString());
    expect(fertileWindowStart.toDateString()).toBe(new Date("2025-02-10").toDateString());
  });
});

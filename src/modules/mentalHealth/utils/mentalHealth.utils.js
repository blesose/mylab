exports.formatSummary = (data) => ({
  week: new Date().toISOString().slice(0, 10),
  averageMood: data.averageMood,
  averageStress: data.averageStress,
  highlights: data.highlights || [],
});
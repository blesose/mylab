const calculateDueDate = (conceptionDate) => {
  const d = new Date(conceptionDate);
  d.setDate(d.getDate() + 280); // 40 weeks
  return d;
};

const calculateCurrentWeek = (conceptionDate) => {
  const diff = Date.now() - new Date(conceptionDate).getTime();
  return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)));
};

const determineTrimester = (week) => {
  if (week <= 13) return "First Trimester";
  if (week <= 27) return "Second Trimester";
  return "Third Trimester";
};

module.exports = { calculateDueDate, calculateCurrentWeek, determineTrimester };

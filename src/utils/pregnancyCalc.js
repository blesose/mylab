const calculateDueDate = (startDate) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + 280);
  return d;
};

const calculateWeek = (startDate) => {
  const diff = Date.now() - new Date(startDate).getTime();
  return Math.max(1, Math.floor(diff / (7*24*60*60*1000)));
};

module.exports = { calculateDueDate, calculateWeek }
/**
 * Truncate text to a specified length
 */
const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

/**
 * Format date to a readable string
 */
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

module.exports = { truncateText, formatDate };
// const truncateText = (text, length = 100) => {
//   return text.length > length ? text.substring(0, length) + "..." : text;
// };

// module.exports = { truncateText };
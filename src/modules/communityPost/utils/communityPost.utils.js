const truncateText = (text, length = 100) => {

  return text.length > length ? text.substring(0, length) + "..." : text;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

module.exports = { truncateText, formatDate };

const Pregnancy = require("../models/pregnancy.schema");

const userHasActivePregnancy = async (userId) => {
  // For now "active" means any pregnancy record exists. Expand to status flags later.
  const preg = await Pregnancy.findOne({ user: userId });
  return !!preg;
};

module.exports = { userHasActivePregnancy };

const Pregnancy = require("../models/pregnancy.model");
const { calculateDueDate, calculateCurrentWeek } = require("../utils/calculatePregnancy");
const { generateSmartHealthTip } = require("../ai/ai.helper");

const createPregnancyRecord = async (data) => {
  const { userId, conceptionDate, notes } = data;

  const dueDate = calculateDueDate(conceptionDate);
  const currentWeek = calculateCurrentWeek(conceptionDate);

  const record = await Pregnancy.create({
    userId,
    conceptionDate,
    dueDate,
    currentWeek,
    notes,
  });

  return record;
};

const getPregnancyByUser = async (userId) => {
  return await Pregnancy.findOne({ userId });
};

const updatePregnancyWeek = async (userId) => {
  const record = await Pregnancy.findOne({ userId });
  if (!record) return null;

  record.currentWeek = calculateCurrentWeek(record.conceptionDate);
  await record.save();
  return record;
};

async function getPregnancyTip(userData) {
  const tip = generateSmartHealthTip({
    category: "Pregnancy",
    userData,
    context: "Give trimester-appropriate wellness and self-care guidance.",
  });
  return tip;
}

module.exports = {
  createPregnancyRecord,
  getPregnancyByUser,
  updatePregnancyWeek,
  getPregnancyTip,
};

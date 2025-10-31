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

// ✅ FIXED: added `await` before generateSmartHealthTip
// async function getPregnancyTip(userData) {
//   const tip = await generateSmartHealthTip({
//     category: "Pregnancy",
//     userData,
//     context: "Give trimester-appropriate wellness and self-care guidance.",
//   });
//   return tip;
// }
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

// const Pregnancy = require("../models/pregnancy.model");
// const { calculateDueDate, calculateCurrentWeek } = require("../utils/calculatePregnancy");

// const createPregnancyRecord = async (data) => {
//   const { userId, conceptionDate, notes } = data;

//   const dueDate = calculateDueDate(conceptionDate);
//   const currentWeek = calculateCurrentWeek(conceptionDate);

//   const record = await Pregnancy.create({
//     userId,
//     conceptionDate,
//     dueDate,
//     currentWeek,
//     notes,
//   });

//   return record;
// };

// const getPregnancyByUser = async (userId) => {
//   return await Pregnancy.findOne({ userId });
// };

// const updatePregnancyWeek = async (userId) => {
//   const record = await Pregnancy.findOne({ userId });
//   if (!record) return null;

//   record.currentWeek = calculateCurrentWeek(record.conceptionDate);
//   await record.save();
//   return record;
// };

// // const { generateSmartHealthTip } = require("../../../ai/ai.helper");
// const { generateSmartHealthTip } = require("../ai/ai.helper");

// // async function getPregnancyTip(userData) {
// //   return await generateSmartHealthTip({
// //     category: "Pregnancy",
// //     userData,
// //     context: "Give trimester-appropriate wellness and self-care guidance.",
// //   });
// // }
// async function getPregnancyTip(userData) {
//   const tip = generateSmartHealthTip({
//     category: "Pregnancy",
//     userData,
//     context: "Give trimester-appropriate wellness and self-care guidance.",
//   });
//   return tip;
// }


// // module.exports = { getPregnancyTip };

// module.exports = { createPregnancyRecord, getPregnancyByUser, updatePregnancyWeek, getPregnancyTip };

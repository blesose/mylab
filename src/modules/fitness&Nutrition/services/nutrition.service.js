// src/services/nutrition.service.js
const Nutrition = require("../models/nutrition.model");

async function createNutritionEntry(data) {
  return await Nutrition.create(data);
}

async function getUserNutritionEntries(userId) {
  return await Nutrition.find({ userId }).sort({ createdAt: -1 });
}

async function updateNutritionEntry(id, updates) {
  return await Nutrition.findByIdAndUpdate(id, updates, { new: true });
}
// async function updateNutritionEntry(id, updates) {
//   // Ensure 'new: true' to return the updated document
//   return await Nutrition.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
// }
async function deleteNutritionEntry(id) {
  return await Nutrition.findByIdAndDelete(id);
}

module.exports = {
  createNutritionEntry,
  getUserNutritionEntries,
  updateNutritionEntry,
  deleteNutritionEntry,
};
// // src/modules/femaleHealth/fitnessNutrition/services/nutrition.service.js

// const Nutrition = require("../models/nutrition.model");
// const { calculateMacros } = require("../utils/nutrition.utils");
// const { gradeNutrition, getNutritionTip } = require("../ai/ai.nutrition.helper");

// /**
//  * Create a new nutrition entry
//  * Adds grade and AI tip automatically
//  */
// async function createNutritionEntry(data) {
//   // Calculate macros if calories provided
//   const macros = data.calories ? calculateMacros(data.calories) : {};

//   // Generate grade
//   const grade = gradeNutrition(data);

//   // Generate AI tip
//   const aiTipData = await getNutritionTip({ ...data, grade });

//   const entry = await Nutrition.create({
//     ...data,
//     grade,
//     aiTip: aiTipData.tip,
//     macros, // optional: store macro breakdown in DB if needed
//   });

//   return entry;
// }

// /**
//  * Get all nutrition entries for a specific user
//  */
// async function getUserNutritionEntries(userId) {
//   return Nutrition.find({ userId }).sort({ createdAt: -1 });
// }

// /**
//  * Update a nutrition entry by ID
//  */
// async function updateNutritionEntry(id, updates) {
//   if (updates.calories) {
//     updates.macros = calculateMacros(updates.calories);
//   }

//   // Re-grade and generate AI tip if key fields are updated
//   if (updates.calories || updates.protein || updates.sugar || updates.fiber) {
//     const grade = gradeNutrition(updates);
//     const aiTipData = await getNutritionTip({ ...updates, grade });
//     updates.grade = grade;
//     updates.aiTip = aiTipData.tip;
//   }

//   return Nutrition.findByIdAndUpdate(id, updates, { new: true });
// }

// /**
//  * Delete a nutrition entry by ID
//  */
// async function deleteNutritionEntry(id) {
//   return Nutrition.findByIdAndDelete(id);
// }

// module.exports = {
//   createNutritionEntry,
//   getUserNutritionEntries,
//   updateNutritionEntry,
//   deleteNutritionEntry,
// };
// const Nutrition = require("../models/nutrition.model");

// async function createNutritionEntry(data) {
//   return await Nutrition.create(data);
// }

// async function getUserNutritionEntries(userId) {
//   return await Nutrition.find({ userId }).sort({ createdAt: -1 });
// }

// async function updateNutritionEntry(id, updates) {
//   return await Nutrition.findByIdAndUpdate(id, updates, { new: true });
// }

// async function deleteNutritionEntry(id) {
//   return await Nutrition.findByIdAndDelete(id);
// }

// module.exports = {
//   createNutritionEntry,
//   getUserNutritionEntries,
//   updateNutritionEntry,
//   deleteNutritionEntry,
// };
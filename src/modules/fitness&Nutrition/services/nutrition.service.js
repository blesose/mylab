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

async function deleteNutritionEntry(id) {
  return await Nutrition.findByIdAndDelete(id);
}

module.exports = {
  createNutritionEntry,
  getUserNutritionEntries,
  updateNutritionEntry,
  deleteNutritionEntry,
};

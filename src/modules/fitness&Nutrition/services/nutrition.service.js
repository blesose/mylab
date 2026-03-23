const Nutrition = require("../models/nutrition.model");
async function createNutritionEntry(data) {
  try {
    // Ensure all numeric fields are numbers
    const entryData = {
      ...data,
      calories: parseInt(data.calories) || 0,
      protein: parseInt(data.protein) || 0,
      carbs: parseInt(data.carbs) || 0,
      fats: parseInt(data.fats) || 0,
      sugar: parseInt(data.sugar) || 0,
      fiber: parseInt(data.fiber) || 0,
    };
    return await Nutrition.create(entryData);
  } catch (error) {
    console.error('❌ Error creating nutrition entry:', error);
    throw error;
  }
}

async function getUserNutritionEntries(userId) {
  try {
    return await Nutrition.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('❌ Error getting nutrition entries:', error);
    throw error;
  }
}

async function updateNutritionEntry(id, updates) {
  try {
    const updateData = {
      ...updates,
      calories: parseInt(updates.calories) || 0,
      protein: parseInt(updates.protein) || 0,
      carbs: parseInt(updates.carbs) || 0,
      fats: parseInt(updates.fats) || 0,
      sugar: parseInt(updates.sugar) || 0,
      fiber: parseInt(updates.fiber) || 0,
    };
    return await Nutrition.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error('❌ Error updating nutrition entry:', error);
    throw error;
  }
}

async function deleteNutritionEntry(id) {
  try {
    return await Nutrition.findByIdAndDelete(id);
  } catch (error) {
    console.error('❌ Error deleting nutrition entry:', error);
    throw error;
  }
}

module.exports = {
  createNutritionEntry,
  getUserNutritionEntries,
  updateNutritionEntry,
  deleteNutritionEntry,
};
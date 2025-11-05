// src/controllers/nutrition.controller.js
const { gradeNutrition, getNutritionTip } = require("../ai/ai.nutrition.helper");
const { nutritionValidator } = require("../validators/nutrition.validator");
const {
  createNutritionEntry,
  getUserNutritionEntries,
  updateNutritionEntry,
  deleteNutritionEntry,
} = require("../services/nutrition.service");
const Nutrition = require("../models/nutrition.model");

const createNutrition = async (req, res) => {
  try {
    // Grade the nutrition entry
    const grade = gradeNutrition(req.body);

    // Generate AI tip
    const aiTipData = await getNutritionTip({ ...req.body, grade });
    const aiTip = aiTipData?.tip || "Maintain a healthy and consistent meal routine.";

    // Save entry
    const meal = await createNutritionEntry({ ...req.body, userId: req.userId, grade, aiTip });

    res.status(201).json({ success: true, message: "Nutrition entry created", data: meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllNutrition = async (req, res) => {
  try {
    const data = await getUserNutritionEntries(req.userId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getANutrition = async (req, res) => {
  try {
    const userId = req.userId;
    const { activityId } = req.params;
    const data = await Nutrition.findOne({ _id: activityId, userId });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



const updateNutrition = async (req, res) => {
  try {
    const updated = await updateNutritionEntry(req.params.id, req.body);
    console.log(updated);
    res.status(200).json({ success: true, message: "whatsup data", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
}
};
const deleteNutrition = async (req, res) => {
  try {
    await deleteNutritionEntry(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
;
module.exports = { createNutrition, getAllNutrition, updateNutrition, deleteNutrition, getANutrition };

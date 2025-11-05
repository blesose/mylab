// src/modules/fitness&Nutrition/controllers/fitness.controller.js
const { gradeFitness, getFitnessNutritionTip } = require("../ai/ai.fitness.helper");
const Fitness = require("../models/fitness.model")
const { analyzeFitnessProgress } = require("../services/fitness.analysis");
const {
  createFitnessActivity,
  getUserFitnessActivities,
  updateFitnessActivity,
  deleteFitnessActivity,
} = require("../services/fitness.service");

const createFitness = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized — user ID missing" });

    const grade = gradeFitness(req.body);
    const aiTipData = await getFitnessNutritionTip({
      goal: req.body.goal,
      activityLevel: req.body.intensity,
      duration: req.body.duration,
      grade,
    });

    const activity = await createFitnessActivity({
      ...req.body,
      userId,
      grade,
      aiTip: aiTipData.tip,
    });

    res.status(201).json({
      success: true,
      message: "Fitness activity logged successfully",
      data: activity,
    });
  } catch (err) {
    console.error("Error creating fitness activity:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllFitness = async (req, res) => {
  try {
    const activities = await getUserFitnessActivities(req.userId);
    const analysis = analyzeFitnessProgress(activities);
    res.status(200).json({ success: true, data: activities, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFitness = async (req, res) => {
  try {
    const userId = req.userId;
    const { activityId } = req.params;
    const activities = await Fitness.findOne({_id: activityId, userId });
    const analysis = analyzeFitnessProgress(activities);
    res.status(200).json({ success: true, data: activities, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateFitness = async (req, res) => {
  try {
    const updated = await updateFitnessActivity(req.params.id, req.body);
    console.log(updated);
    res.status(200).json({ success: true, message: "whatsup data", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
}
};

const deleteFitness = async (req, res) => {
  try {
    await deleteFitnessActivity(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createFitness, getAllFitness, updateFitness, deleteFitness, getFitness };

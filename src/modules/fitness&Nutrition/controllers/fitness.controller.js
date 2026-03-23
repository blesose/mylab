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
      goal: req.body.goal, // Make sure this field exists in your request
      activityLevel: req.body.intensity,
      duration: req.body.duration,
      grade,
    });

    const activity = await createFitnessActivity({
      ...req.body,
      userId,
      grade,
      aiTip: aiTipData.tip, // This should save the AI tip
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
    
    // Return activities directly (not nested in data.data)
    res.status(200).json({ 
      success: true, 
      data: activities, // This should be the array
      analysis 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFitness = async (req, res) => {
  try {
    const userId = req.userId;
    const { activityId } = req.params;
    const activity = await Fitness.findOne({_id: activityId, userId });
    
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }
    
    // For single activity, just return it
    res.status(200).json({ 
      success: true, 
      data: activity 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateFitness = async (req, res) => {
  try {
    const updated = await updateFitnessActivity(req.params.id, req.body);
    
    // Regenerate AI tip when updating
    if (req.body.duration || req.body.intensity || req.body.goal) {
      const grade = gradeFitness({...updated.toObject(), ...req.body});
      const aiTipData = await getFitnessNutritionTip({
        goal: req.body.goal || updated.goal,
        activityLevel: req.body.intensity || updated.intensity,
        duration: req.body.duration || updated.duration,
        grade,
      });
      
      updated.aiTip = aiTipData.tip;
      updated.grade = grade;
      await updated.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Activity updated successfully", 
      data: updated 
    });
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
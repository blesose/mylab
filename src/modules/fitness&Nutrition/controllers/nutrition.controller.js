const { gradeNutrition, getNutritionTip } = require("../ai/ai.nutrition.helper");
const {
  createNutritionEntry,
  getUserNutritionEntries,
  updateNutritionEntry,
  deleteNutritionEntry,
} = require("../services/nutrition.service");
const Nutrition = require("../models/nutrition.model");

const createNutrition = async (req, res) => {
  try {
    console.log('📝 Creating nutrition entry for user:', req.userId);
    console.log('📝 Nutrition data:', req.body);
    
    // Only require basic fields
    const requiredFields = ['meal', 'calories', 'mealType'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Please provide: ${field}` 
        });
      }
    }
    
    // Prepare data with defaults for optional fields
    const nutritionData = {
      userId: req.userId,
      meal: req.body.meal.trim(),
      calories: parseInt(req.body.calories) || 0,
      protein: parseInt(req.body.protein) || 0,
      carbs: parseInt(req.body.carbs) || 0,
      fats: parseInt(req.body.fats) || 0,
      fiber: parseInt(req.body.fiber) || 0,
      sugar: parseInt(req.body.sugar) || 0,
      mealType: req.body.mealType,
      portion: req.body.portion || "medium",
      notes: req.body.notes || "",
      createdAt: req.body.date ? new Date(req.body.date) : new Date(),
    };
    
    // Grade the nutrition entry (optional)
    let grade = "Good choice!";
    try {
      grade = gradeNutrition(nutritionData);
    } catch (error) {
      console.log('⚠️ Grade generation failed, using default');
    }
    
    // Generate AI tip
    let aiTip = "Keep up the healthy eating habits! 🌱";
    try {
      const aiTipData = await getNutritionTip({ ...nutritionData, grade });
      aiTip = aiTipData?.tip || aiTip;
    } catch (error) {
      console.log('⚠️ AI tip generation failed, using default');
    }
    
    nutritionData.grade = grade;
    nutritionData.aiTip = aiTip;
    
    // Save entry
    const meal = await createNutritionEntry(nutritionData);
    
    res.status(201).json({ 
      success: true, 
      message: "Meal logged successfully! 🍎", 
      data: meal 
    });
  } catch (err) {
    console.error('❌ Error in createNutrition:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllNutrition = async (req, res) => {
  try {
    const data = await getUserNutritionEntries(req.userId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('❌ Error in getAllNutrition:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getANutrition = async (req, res) => {
  try {
    const userId = req.userId;
    const { activityId } = req.params;
    const data = await Nutrition.findOne({ _id: activityId, userId });
    if (!data) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('❌ Error in getANutrition:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateNutrition = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      meal: req.body.meal,
      calories: parseInt(req.body.calories) || 0,
      protein: parseInt(req.body.protein) || 0,
      carbs: parseInt(req.body.carbs) || 0,
      fats: parseInt(req.body.fats) || 0,
      sugar: parseInt(req.body.sugar) || 0,
      fiber: parseInt(req.body.fiber) || 0,
      mealType: req.body.mealType,
      portion: req.body.portion || "medium",
      notes: req.body.notes || "",
    };
    
    const updated = await updateNutritionEntry(id, updates);
    console.log('✅ Updated meal:', updated);
    res.status(200).json({ success: true, message: "Meal updated!", data: updated });
  } catch (err) {
    console.error('❌ Error in updateNutrition:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNutrition = async (req, res) => {
  try {
    await deleteNutritionEntry(req.params.id);
    res.status(200).json({ success: true, message: "Meal deleted successfully" });
  } catch (err) {
    console.error('❌ Error in deleteNutrition:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { 
  createNutrition, 
  getAllNutrition, 
  updateNutrition, 
  deleteNutrition, 
  getANutrition 
};
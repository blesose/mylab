const {
  searchFoods,
  getFoodById,
  getFoodsByCategory,
  createCustomFood,
  getUserCustomFoods,
  calculatePortionNutrition,
} = require("../services/food.service");

// Search foods
const searchFoodsController = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "Search query must be at least 2 characters" 
      });
    }
    
    const foods = await searchFoods(q, parseInt(limit));
    
    res.status(200).json({ 
      success: true, 
      data: foods,
      count: foods.length 
    });
  } catch (error) {
    console.error("❌ Error in searchFoods:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get food by ID
const getFoodByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await getFoodById(id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    console.error("❌ Error in getFoodById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get foods by category
const getFoodsByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const foods = await getFoodsByCategory(category, parseInt(limit));
    
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Error in getFoodsByCategory:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create custom food
const createCustomFoodController = async (req, res) => {
  try {
    const userId = req.userId;
    const foodData = req.body;
    
    const customFood = await createCustomFood(userId, foodData);
    
    res.status(201).json({ 
      success: true, 
      message: "Custom food created successfully",
      data: customFood 
    });
  } catch (error) {
    console.error("❌ Error in createCustomFood:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's custom foods
const getUserCustomFoodsController = async (req, res) => {
  try {
    const userId = req.userId;
    const foods = await getUserCustomFoods(userId);
    
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Error in getUserCustomFoods:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate nutrition for portion
const calculatePortionController = async (req, res) => {
  try {
    const { foodId, portionSize, servingUnit } = req.body;
    
    const food = await getFoodById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    
    // Parse portion size (e.g., "100g" -> 100, or "1 medium" -> 1)
    let multiplier = 1;
    if (portionSize) {
      const numericValue = parseFloat(portionSize);
      if (!isNaN(numericValue)) {
        // If portion is in same unit as serving size
        if (servingUnit === food.servingUnit) {
          multiplier = numericValue / parseFloat(food.servingSize);
        } else {
          // Different units - use grams as base
          multiplier = numericValue / 100; // Assuming 100g is standard
        }
      }
    }
    
    const nutrition = calculatePortionNutrition(food, multiplier);
    
    res.status(200).json({ 
      success: true, 
      data: {
        ...nutrition,
        portionSize,
        servingUnit,
        foodName: food.name,
        servingSize: food.servingSize,
      }
    });
  } catch (error) {
    console.error("❌ Error in calculatePortion:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchFoodsController,
  getFoodByIdController,
  getFoodsByCategoryController,
  createCustomFoodController,
  getUserCustomFoodsController,
  calculatePortionController,
};
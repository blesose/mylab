const Food = require("../models/food.model");

const commonFoods = [
  { name: "Apple", category: "fruits", calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, sugar: 19, servingSize: "1 medium" },
  { name: "Banana", category: "fruits", calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14, servingSize: "1 medium" },
  { name: "Orange", category: "fruits", calories: 62, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3.1, sugar: 12, servingSize: "1 medium" },
  { name: "Strawberries", category: "fruits", calories: 49, protein: 1, carbs: 12, fats: 0.5, fiber: 3, sugar: 7, servingSize: "100g" },
  { name: "Blueberries", category: "fruits", calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4, sugar: 10, servingSize: "100g" },
 
  { name: "Broccoli", category: "vegetables", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, sugar: 1.7, servingSize: "100g" },
  { name: "Carrots", category: "vegetables", calories: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, sugar: 4.7, servingSize: "100g" },
  { name: "Spinach", category: "vegetables", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, sugar: 0.4, servingSize: "100g" },
  { name: "Sweet Potato", category: "vegetables", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, sugar: 4.2, servingSize: "100g" },
  { name: "Avocado", category: "fruits", calories: 160, protein: 2, carbs: 8.5, fats: 14.7, fiber: 6.7, sugar: 0.7, servingSize: "100g" },
  
  { name: "Chicken Breast (grilled)", category: "proteins", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, servingSize: "100g" },
  { name: "Salmon", category: "proteins", calories: 208, protein: 22, carbs: 0, fats: 13, fiber: 0, sugar: 0, servingSize: "100g" },
  { name: "Egg", category: "proteins", calories: 78, protein: 6.3, carbs: 0.6, fats: 5.3, fiber: 0, sugar: 0.6, servingSize: "1 large" },
  { name: "Beef (lean)", category: "proteins", calories: 250, protein: 26, carbs: 0, fats: 15, fiber: 0, sugar: 0, servingSize: "100g" },
  { name: "Tofu", category: "proteins", calories: 76, protein: 8, carbs: 2, fats: 4.8, fiber: 0.3, sugar: 0.3, servingSize: "100g" },
  { name: "Lentils", category: "proteins", calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8, sugar: 2, servingSize: "100g" },
 
  { name: "White Rice", category: "carbs", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sugar: 0, servingSize: "100g" },
  { name: "Brown Rice", category: "carbs", calories: 112, protein: 2.6, carbs: 23.5, fats: 0.9, fiber: 1.8, sugar: 0.4, servingSize: "100g" },
  { name: "Oatmeal", category: "carbs", calories: 68, protein: 2.4, carbs: 12, fats: 1.4, fiber: 2, sugar: 0, servingSize: "100g" },
  { name: "Whole Wheat Bread", category: "carbs", calories: 69, protein: 3.6, carbs: 12, fats: 1, fiber: 1.9, sugar: 1.4, servingSize: "1 slice" },
  { name: "Pasta", category: "carbs", calories: 158, protein: 5.8, carbs: 31, fats: 0.9, fiber: 1.8, sugar: 1, servingSize: "100g" },
  
  { name: "Milk (2%)", category: "dairy", calories: 122, protein: 8, carbs: 12, fats: 5, fiber: 0, sugar: 12, servingSize: "1 cup" },
  { name: "Greek Yogurt", category: "dairy", calories: 100, protein: 17, carbs: 6, fats: 0.4, fiber: 0, sugar: 5, servingSize: "100g" },
  { name: "Cheddar Cheese", category: "dairy", calories: 113, protein: 7, carbs: 0.4, fats: 9, fiber: 0, sugar: 0.1, servingSize: "1 slice" },
  
  { name: "Cheese Pizza Slice", category: "meals", calories: 285, protein: 12, carbs: 36, fats: 10, fiber: 2, sugar: 3, servingSize: "1 slice" },
  { name: "Hamburger", category: "meals", calories: 354, protein: 17, carbs: 36, fats: 16, fiber: 2, sugar: 6, servingSize: "1 burger" },
  { name: "Chicken Salad", category: "meals", calories: 350, protein: 30, carbs: 15, fats: 20, fiber: 3, sugar: 5, servingSize: "1 bowl" },
  { name: "Caesar Salad", category: "meals", calories: 400, protein: 12, carbs: 15, fats: 32, fiber: 3, sugar: 3, servingSize: "1 bowl" },
  { name: "Grilled Cheese Sandwich", category: "meals", calories: 380, protein: 14, carbs: 32, fats: 22, fiber: 2, sugar: 4, servingSize: "1 sandwich" },
  { name: "Sushi Roll", category: "meals", calories: 250, protein: 8, carbs: 35, fats: 8, fiber: 2, sugar: 5, servingSize: "6 pieces" },
  
  { name: "Potato Chips", category: "snacks", calories: 152, protein: 2, carbs: 15, fats: 10, fiber: 1, sugar: 0, servingSize: "30g" },
  { name: "Granola Bar", category: "snacks", calories: 100, protein: 2, carbs: 18, fats: 3, fiber: 1, sugar: 8, servingSize: "1 bar" },
  { name: "Popcorn", category: "snacks", calories: 31, protein: 1, carbs: 6, fats: 0.4, fiber: 1, sugar: 0, servingSize: "1 cup" },
 
  { name: "Coffee (black)", category: "beverages", calories: 2, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, servingSize: "1 cup" },
  { name: "Orange Juice", category: "beverages", calories: 112, protein: 1.7, carbs: 26, fats: 0.5, fiber: 0.5, sugar: 21, servingSize: "1 cup" },
  { name: "Soda", category: "beverages", calories: 150, protein: 0, carbs: 39, fats: 0, fiber: 0, sugar: 39, servingSize: "12 oz" },
];

const initializeFoodDatabase = async () => {
  try {
    const count = await Food.countDocuments({ isCommon: true });
    if (count === 0) {
      console.log("Initializing food database...");
      await Food.insertMany(commonFoods);
      console.log(`Added ${commonFoods.length} common foods to database`);
    }
  } catch (error) {
    console.error("Error initializing food database:", error);
  }
};

// Search foods
const searchFoods = async (query, limit = 20) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const foods = await Food.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { $text: { $search: query } }
      ]
    })
    .limit(limit)
    .sort({ isCommon: -1, name: 1 });
    
    return foods;
  } catch (error) {
    console.error("Error searching foods:", error);
    return [];
  }
};

const getFoodById = async (id) => {
  try {
    return await Food.findById(id);
  } catch (error) {
    console.error("Error getting food:", error);
    return null;
  }
};

const getFoodsByCategory = async (category, limit = 10) => {
  try {
    return await Food.find({ category, isCommon: true })
      .limit(limit)
      .sort({ name: 1 });
  } catch (error) {
    console.error("Error getting foods by category:", error);
    return [];
  }
};

const createCustomFood = async (userId, foodData) => {
  try {
    const customFood = await Food.create({
      ...foodData,
      isCommon: false,
      isCustom: true,
      userId,
    });
    return customFood;
  } catch (error) {
    console.error("Error creating custom food:", error);
    throw error;
  }
};

const getUserCustomFoods = async (userId) => {
  try {
    return await Food.find({ userId, isCustom: true }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error getting custom foods:", error);
    return [];
  }
};

const calculatePortionNutrition = (food, portionMultiplier) => {
  return {
    calories: Math.round(food.calories * portionMultiplier),
    protein: Math.round(food.protein * portionMultiplier * 10) / 10,
    carbs: Math.round(food.carbs * portionMultiplier * 10) / 10,
    fats: Math.round(food.fats * portionMultiplier * 10) / 10,
    fiber: Math.round(food.fiber * portionMultiplier * 10) / 10,
    sugar: Math.round(food.sugar * portionMultiplier * 10) / 10,
  };
};

module.exports = {
  initializeFoodDatabase,
  searchFoods,
  getFoodById,
  getFoodsByCategory,
  createCustomFood,
  getUserCustomFoods,
  calculatePortionNutrition,
};
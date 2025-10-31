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


// const updateFitness = async (req, res) => {
//   try {
//     const updated = await updateFitnessActivity(req.params.id, req.body);
//     res.status(200).json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
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
// const { gradeFitness } = require("../ai/ai.helper");
// const { fitnessValidator } = require("../validators/fitness.validator");
// const {
//   createFitnessActivity,
//   getUserFitnessActivities,
//   updateFitnessActivity,
//   deleteFitnessActivity,
// } = require("../services/fitness.service");


// // const createFitness = async (req, res) => {
// //   try {
// //     const { error } = fitnessValidator.validate(req.body);
// //     if (error) return res.status(400).json({ success: false, message: error.details[0].message });

// //     const grade = gradeFitness(req.body);
// //     const aiTip = grade === "Excellent 💪" ? "Maintain your great routine!" : "Try increasing workout duration.";
// //     const activity = await createFitnessActivity({ ...req.body, userId: req.userId, grade, aiTip });

// //     res.status(201).json({ success: true, activity });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };
// // const { gradeFitness } = require("../analysis/fitness.analysis");
// // const { createFitnessActivity } = require("../services/fitness.service");
// // const { getFitnessNutritionTip } = require("../services/fitnessNutrition.service");

// const createFitness = async (req, res) => {
//   try {
//     const userId = req.userId; // ✅ Comes from auth middleware
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized — user ID missing",
//       });
//     }

//     // 🧠 Analyze and grade the fitness activity
//     const grade = gradeFitness(req.body);

//     // 🧩 Generate smart AI tip using your local AI helper
//     const aiTipData = await getFitnessNutritionTip({
//       goal: req.body.goal,
//       activityLevel: req.body.activityLevel,
//       duration: req.body.duration,
//       grade,
//     });

//     const aiTip =
//       aiTipData?.tip || (grade === "Excellent 💪"
//         ? "Maintain your great routine!"
//         : "Try increasing workout duration or intensity.");

//     // 🗂 Save activity to DB
//     const activity = await createFitnessActivity({
//       ...req.body,
//       userId,
//       grade,
//       aiTip,
//     });

//     // ✅ Send response
//     res.status(201).json({
//       success: true,
//       message: "Fitness activity created successfully",
//       data: activity,
//     });
//   } catch (err) {
//     console.error("Error creating fitness activity:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + err.message,
//     });
//   }
// };

// // module.exports = { createFitness };
// // const addSelfCare = async (req, res) => {
// //   try {
// //     const userId = req.userId;
// //     if (!userId) {
// //       return res.status(401).json({ success: false, message: "Unauthorized: Missing userId from token." });
// //     }

// //     const result = await logSelfCareActivity({ ...req.body, userId });

// //     res.status(201).json({
// //       success: true,
// //       message: "Self-care activity logged successfully",
// //       data: result,
// //     });
// //   } catch (err) {
// //     console.error("Error adding self-care activity:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: err.message || "Server error while adding self-care activity",
// //     });
// //   }
// // };

// const getAllFitness = async (req, res) => {
//   try {
//     const data = await getUserFitnessActivities(req.userId);
//     res.status(200).json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// const getFitness = async (req, res) => {
//   try {
//     const data = await getUserFitnessActivities(req.userId);
//     res.status(200).json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const updateFitness = async (req, res) => {
//   try {
//     const updated = await updateFitnessActivity(req.params.id, req.body);
//     res.status(200).json({ success: true, updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const deleteFitness = async (req, res) => {
//   try {
//     await deleteFitnessActivity(req.params.id);
//     res.status(200).json({ success: true, message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = { createFitness, getAllFitness, updateFitness, deleteFitness, getFitness };
// const { createPlan, getUserPlans } = require("../services/fitness.service");

// const createFitnessPlan = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const plan = await createPlan(userId, req.body);
//     res.status(201).json({ success: true, plan });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPlans = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const plans = await getUserPlans(userId);
//     res.json({ success: true, plans });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { createFitnessPlan, getPlans };

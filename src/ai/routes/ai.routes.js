const express = require("express");
const { getDailyMentalTip } = require("../modules/mentalHealth/services/mentalHealth.service");
const { getMensWellnessTip } = require("../modules/menHealth/services/menHealth.service");
const { getCycleHealthTip } = require("../modules/femaleHealth/services/cycle.service");
const { getPregnancyTip } = require("../modules/femaleHealth/services/pregnancy.service");
const { getFitnessNutritionTip } = require("../modules/fitnessAndNutrition/services/fitnessAndNutrition.service");

const router = express.Router();

router.post("/tip", async (req, res) => {
  try {
    const { category, userData = {} } = req.body;
    let result;

    switch (category) {
      case "mental":
        result = await getDailyMentalTip(userData);
        break;
      case "men":
        result = await getMensWellnessTip(userData);
        break;
      case "female-cycle":
        result = await getCycleHealthTip(userData);
        break;
      case "pregnancy":
        result = await getPregnancyTip(userData);
        break;
      case "fitness":
        result = await getFitnessNutritionTip(userData);
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid category" });
    }

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("AI tip error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

// // routes/ai.routes.js
// const express = require('express');
// const { getPersonalizedTip } = require('../femaleHealth/services/fitnessNutrition.service');
// const router = express.Router();

// router.post('/tip', async (req, res) => {
//   try {
//     const tip = await getPersonalizedTip(req.body);
//     res.json({ success: true, ...tip });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// src/modules/mentalHealth/controllers/mentalHealth.controller.js
const mentalService = require("../services/mentalHealth.service");
const { logEntrySchema } = require("../validators/mentalHealth.validator");

exports.logMood = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.userData.id };
    const { error } = logEntrySchema.validate(payload, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message) });

    const entry = await mentalService.logEntry(payload);
    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("logMood error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.userData.id || req.params.userId;
    const data = await mentalService.getHistory(userId, 50);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("getHistory error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.userData.id || req.params.userId;
    const summary = await mentalService.getDashboardSummary(userId);
    return res.json({ success: true, data: summary });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// // src/modules/mentalHealth/services/mentalHealth.service.js
// const MentalHealth = require("../models/mentalHealth.model");
// const { computeMoodDistribution, detectNegativeTrend } = require("./mentalHealth.analysis");
// const { generateSmartHealthTip } = require("../../../ai/ai.helper"); // centralized local AI helper
// const Notification = require("../../../notifications/models/notification.model"); // optional

// class MentalHealthService {
//   async logEntry({ userId, moodType, score, notes, tags }) {
//     // Create entry
//     const entry = await MentalHealth.create({ userId, moodType, score, notes, tags });

//     // Basic on-save analysis: generate short AI insight
//     const ai = await generateSmartHealthTip({
//       category: "Mental Health",
//       userData: { name: "", gender: "", age: "" },
//       context: `User mood: ${moodType}. Notes: ${notes || "none"}`
//     });

//     entry.aiInsight = ai.tip || ai;
//     await entry.save();

//     // If negative trend suspected, create an in-app notification (non-blocking)
//     try {
//       const recent = await MentalHealth.find({ userId }).sort({ createdAt: -1 }).limit(20);
//       const trend = detectNegativeTrend(recent);
//       if (trend.flagged) {
//         // create minimal notification (best-effort)
//         await Notification.create({
//           userId,
//           title: "We noticed a pattern in recent mood entries",
//           message: "Your recent entries indicate elevated negative moods. Consider reaching out to support or trying a short mindfulness exercise.",
//           type: "insight"
//         });
//       }
//     } catch (err) {
//       console.error("post-logEntry analysis/notification error:", err.message);
//     }

//     return entry;
//   }

//   async getHistory(userId, limit = 50) {
//     const entries = await MentalHealth.find({ userId }).sort({ createdAt: -1 }).limit(limit);
//     const distribution = computeMoodDistribution(entries);
//     const trend = detectNegativeTrend(entries);

//     return { entries, distribution, trend };
//   }

//   async getDashboardSummary(userId) {
//     const { entries, distribution, trend } = await this.getHistory(userId, 100);
//     // create a short AI summary for dashboard once in a while (cache this in production)
//     const ai = await generateSmartHealthTip({
//       category: "Mental Health Summary",
//       userData: { name: "", gender: "", age: "" },
//       context: `Distribution: ${JSON.stringify(distribution)}. Trend negative ratio: ${trend.negativeRatio}`
//     });
//     return { distribution, trend, aiTip: ai.tip || ai };
//   }
// }

// module.exports = new MentalHealthService();




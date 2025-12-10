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
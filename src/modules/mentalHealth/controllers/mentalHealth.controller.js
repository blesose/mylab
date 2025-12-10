const MentalHealth = require("../models/mentalHealth.model");
const { analyzeMoodTrends } = require("../services/mentalHealth.analysis");
const { generateWeeklyMentalHealthSummary } = require("../services/mentalHealth.service");
const { moodEntryValidator } = require("../validators/mentalHealth.validator");
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

/**
 * ✅ Create new mental health entry
 */
exports.createEntry = async (req, res, next) => {
  try {
    const { error } = moodEntryValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });

    const newEntry = await MentalHealth.create({
      userId: req.user?._id || req.body.userId, // flexible for now
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "New mental health entry created successfully.",
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

///Get all entries for all users
exports.getAllEntries = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const entries = await MentalHealth.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    next(err);
  }
};

//Get single entry by ID
exports.getSingleEntry = async (req, res, next) => {
  try {
    const entry = await MentalHealth.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.status(200).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

// update mood entry
exports.updateEntry = async (req, res, next) => {
  try {
    const { error } = moodEntryValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });

    const entry = await MentalHealth.findByIdAndUpdate(req.params.entryId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.status(200).json({
      success: true,
      message: "Mental health entry updated successfully",
      data: entry,
    });
  } catch (err) {
    next(err);
  }
};

// Delete mood entry
exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await MentalHealth.findByIdAndDelete(req.params.entryId);
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.status(200).json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

//Get user's mood analysis report
exports.getUserMentalHealth = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const report = await analyzeMoodTrends(userId);
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// Get weekly summary
exports.getWeeklySummary = async (req, res, next) => {
  try {
    const summary = await generateWeeklyMentalHealthSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};


exports.getUserEntries = async (req, res) => {
  try {
    const userId = req.user?.id || "guest";
    const entries = await getUserEntriesService(userId);
    return res.json({ success: true, data: entries });
  } catch (err) {
    console.error("❌ getUserEntries error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const Pregnancy = require("../models/pregnancy.schema");

// Helper to calculate due date (40 weeks after start)
const calculateDueDate = (startDate) => {
  const due = new Date(startDate);
  due.setDate(due.getDate() + 280); // 40 weeks
  return due;
};

// CREATE a new pregnancy record
const createPregnancy = async (req, res) => {
  try {
    const { startDate, notes } = req.body;

    if (!startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }

    const dueDate = calculateDueDate(startDate);

    const pregnancy = new Pregnancy({
      user: req.userData.id,
      startDate,
      dueDate,
      notes,
    });

    pregnancy.updateProgress();
    await pregnancy.save();

    res.status(201).json({
      success: true,
      message: "Pregnancy record created successfully",
      data: pregnancy,
    });
  } catch (error) {
    console.error("Create Pregnancy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all pregnancy records for logged-in user
const getPregnancies = async (req, res) => {
  try {
    const records = await Pregnancy.find({ user: req.userData.id }).sort({
      createdAt: -1,
    });

    // auto-update each record’s progress
    records.forEach((r) => r.updateProgress());

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error("Get Pregnancies Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single record by ID
const getPregnancyById = async (req, res) => {
  try {
    const record = await Pregnancy.findOne({
      _id: req.params.id,
      user: req.userData.id,
    });

    if (!record)
      return res.status(404).json({ message: "Pregnancy record not found" });

    record.updateProgress();
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error("Get Pregnancy By ID Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE record
const updatePregnancy = async (req, res) => {
  try {
    const updates = req.body;

    const record = await Pregnancy.findOneAndUpdate(
      { _id: req.params.id, user: req.userData.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!record)
      return res.status(404).json({ message: "Pregnancy record not found" });

    record.updateProgress();
    await record.save();

    res.status(200).json({ success: true, message: "Record updated", data: record });
  } catch (error) {
    console.error("Update Pregnancy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE record
const deletePregnancy = async (req, res) => {
  try {
    const record = await Pregnancy.findOneAndDelete({
      _id: req.params.id,
      user: req.userData.id,
    });

    if (!record)
      return res.status(404).json({ message: "Pregnancy record not found" });

    res.status(200).json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete Pregnancy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPregnancy,
  getPregnancies,
  getPregnancyById,
  updatePregnancy,
  deletePregnancy,
};

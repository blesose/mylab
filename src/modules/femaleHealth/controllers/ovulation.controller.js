const ovulationService = require("../services/ovulation.service");

const createOvulationEntry = async (req, res) => {
  try {
    const { userId, cycleStart, cycleLength, notes } = req.body;
    const data = await ovulationService.createEntry(userId, cycleStart, cycleLength, notes);
    res.status(201).json({ success: true, message: "Ovulation entry created successfully", data });
  } catch (error) {
    console.error("createOvulationEntry error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOvulationHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await ovulationService.getEntriesWithAnalysis(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("getOvulationHistory error:", error);
    res.status(500).json({ success: false, message: "Error fetching ovulation history" });
  }
};

module.exports = { createOvulationEntry, getOvulationHistory }
const cycleService = require("../services/cycle.service");
const createCycle = async (req, res) => {
  try {
    const { 
      userId, 
      startDate, 
      endDate, 
      notes,
      // New fields
      flowLevel,
      symptoms,
      mood,
      energyLevel,
      crampsIntensity,
      flowConsistency
    } = req.body;
    
    const result = await cycleService.createCycle(
      userId, 
      startDate, 
      endDate, 
      notes,
      // Pass new fields to service
      flowLevel,
      symptoms,
      mood,
      energyLevel,
      crampsIntensity,
      flowConsistency
    );
    
    res.status(201).json({ 
      success: true, 
      message: "Cycle created successfully", 
      data: result 
    });
  } catch (error) {
    console.error("createCycle error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};

const getCycles = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await cycleService.getCyclesWithAnalysis(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("getCycles error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching cycles" 
    });
  }
};

module.exports = { createCycle, getCycles };
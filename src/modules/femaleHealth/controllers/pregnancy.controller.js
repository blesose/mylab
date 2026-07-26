const { 
  createPregnancyRecord, 
  getPregnancyByUser, 
  getPregnancyTip 
} = require("../services/pregnancy.service");

const { generatePregnancyInsights } = require("../services/pregnancy.analysis");

const createPregnancy = async (req, res) => {
  try {
    const record = await createPregnancyRecord(req.body);

    const tip = await getPregnancyTip(record);

    return res.status(201).json({
      success: true,
      message: "Pregnancy record created successfully",
      record,
      tip,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getPregnancy = async (req, res) => {
  try {
    const record = await getPregnancyByUser(req.params.userId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    const insights = generatePregnancyInsights(record.currentWeek);
  o
    const tip = await getPregnancyTip(record);

    return res.status(200).json({
      success: true,
      record,
      insights,
      tip,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createPregnancy, getPregnancy };
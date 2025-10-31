const { 
  createPregnancyRecord, 
  getPregnancyByUser, 
  getPregnancyTip 
} = require("../services/pregnancy.service");

const { generatePregnancyInsights } = require("../services/pregnancy.analysis");

// ✅ Create Pregnancy Record
const createPregnancy = async (req, res) => {
  try {
    const record = await createPregnancyRecord(req.body);

    // 🧠 Generate AI health tip
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

// ✅ Get Pregnancy Record
const getPregnancy = async (req, res) => {
  try {
    const record = await getPregnancyByUser(req.params.userId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    const insights = generatePregnancyInsights(record.currentWeek);
    
    // 🧠 Add AI tip too
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

// const { createPregnancyRecord, getPregnancyByUser } = require("../services/pregnancy.service");
// const { generatePregnancyInsights } = require("../services/pregnancy.analysis");

// const createPregnancy = async (req, res) => {
//   try {
//     // Validation already handled by middleware
//     const record = await createPregnancyRecord(req.body);
//     return res.status(201).json({ message: "Pregnancy record created", record });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPregnancy = async (req, res) => {
//   try {
//     const record = await getPregnancyByUser(req.params.userId);
//     if (!record) return res.status(404).json({ message: "Record not found" });

//     const insights = generatePregnancyInsights(record.currentWeek);
//     return res.status(200).json({ ...record.toObject(), insights });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { createPregnancy, getPregnancy };

// const { createPregnancyRecord, getPregnancyByUser, updatePregnancyWeek } = require("../services/pregnancy.service");
// const { generatePregnancyInsights } = require("../services/pregnancy.analysis");
// const { createPregnancyValidator } = require("../validators/pregnancy.validator");

// const createPregnancy = async (req, res) => {
//   try {
//     const { error } = createPregnancyValidator.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const record = await createPregnancyRecord(req.body);
//     return res.status(201).json({ message: "Pregnancy record created", record });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPregnancy = async (req, res) => {
//   try {
//     const record = await getPregnancyByUser(req.params.userId);
//     if (!record) return res.status(404).json({ message: "Record not found" });

//     const insights = generatePregnancyInsights(record.currentWeek);
//     return res.status(200).json({ ...record.toObject(), insights });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { createPregnancy, getPregnancy };

// const Cycle = require("../models/cycle.schema");

// // CREATE a cycle entry
// const createCycle = async (req, res) => {
//   try {
//     const { startDate, endDate, flow, symptoms, notes } = req.body;
//     const cycle = await Cycle.create({ user: req.user.id, startDate, endDate, flow, symptoms, notes });
//     res.status(201).json({ success: true, message: "Cycle added", data: cycle });
//   } catch (error) {
//     console.error("Create Cycle Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // GET all cycles for the user
// const getCycles = async (req, res) => {
//   try {
//     const cycles = await Cycle.find({ user: req.user.id }).sort({ startDate: -1 });
//     res.status(200).json({ success: true, data: cycles });
//   } catch (error) {
//     console.error("Get Cycles Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // UPDATE a cycle
// const updateCycle = async (req, res) => {
//   try {
//     const cycle = await Cycle.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!cycle) return res.status(404).json({ success: false, message: "Cycle not found" });
//     res.status(200).json({ success: true, message: "Cycle updated", data: cycle });
//   } catch (error) {
//     console.error("Update Cycle Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // DELETE a cycle
// const deleteCycle = async (req, res) => {
//   try {
//     const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, user: req.user.id });
//     if (!cycle) return res.status(404).json({ success: false, message: "Cycle not found" });
//     res.status(200).json({ success: true, message: "Cycle deleted" });
//   } catch (error) {
//     console.error("Delete Cycle Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { createCycle, getCycles, updateCycle, deleteCycle };
const Cycle = require("../models/cycle.schema");
const {
  computeCycleStats,
  predictNextPeriod,
  predictOvulationWindow,
} = require("../utils/cycle.utils");

/**
 * createCycle - create a cycle record
 */
const createCycle = async (req, res) => {
  try {
    const { startDate, endDate, flow, symptoms, notes, meta } = req.body;

    if (!startDate) {
      return res.status(400).json({ success: false, message: "startDate is required" });
    }

    const cycle = await Cycle.create({
      user: req.userData.id,
      startDate,
      endDate,
      flow,
      symptoms,
      notes,
      meta,
    });

    res.status(201).json({ success: true, message: "Cycle created", data: cycle });
  } catch (error) {
    console.error("Create Cycle Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * getCycles - return user's cycles and basic stats
 */
const getCycles = async (req, res) => {
  try {
    // fetch all cycles for user, sorted ascending (oldest first)
    let cycles = await Cycle.find({ user: req.userData.id }).sort({ startDate: 1 });

    const stats = computeCycleStats(cycles);

    res.status(200).json({ success: true, data: { cycles, stats } });
  } catch (error) {
    console.error("Get Cycles Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * getCycleById
 */
const getCycleById = async (req, res) => {
  try {
    const cycle = await Cycle.findOne({ _id: req.params.id, user: req.userData.id });
    if (!cycle) return res.status(404).json({ success: false, message: "Cycle not found" });
    res.status(200).json({ success: true, data: cycle });
  } catch (error) {
    console.error("Get CycleById Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * updateCycle
 */
const updateCycle = async (req, res) => {
  try {
    const updates = { ...req.body };
    const cycle = await Cycle.findOneAndUpdate(
      { _id: req.params.id, user: req.userData.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!cycle) return res.status(404).json({ success: false, message: "Cycle not found" });
    res.status(200).json({ success: true, message: "Cycle updated", data: cycle });
  } catch (error) {
    console.error("Update Cycle Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * deleteCycle
 */
const deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, user: req.userData.id });
    if (!cycle) return res.status(404).json({ success: false, message: "Cycle not found" });
    res.status(200).json({ success: true, message: "Cycle deleted" });
  } catch (error) {
    console.error("Delete Cycle Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * getPredictions - compute next period, ovulation and fertile window
 * Optional query params:
 *  - defaultCycleLength (number) // user override
 *  - defaultPeriodLength (number)
 *  - lutealPhase (number)
 */
const getPredictions = async (req, res) => {
  try {
    // fetch cycles sorted ascending (oldest first)
    const cycles = await Cycle.find({ user: req.userData.id }).sort({ startDate: 1 });

    // allow user-specified defaults (fallback to typical values)
    const defaultCycleLength = parseInt(req.query.defaultCycleLength) || 28;
    const defaultPeriodLength = parseInt(req.query.defaultPeriodLength) || 5;
    const lutealPhase = parseInt(req.query.lutealPhase) || 14;

    const { predictedStartDate, predictedEndDate, usedCycleLength, usedPeriodLength } = predictNextPeriod(
      cycles,
      { defaultCycleLength, defaultPeriodLength }
    );

    const ovulation = predictOvulationWindow(predictedStartDate, usedCycleLength, lutealPhase);

    res.status(200).json({
      success: true,
      data: {
        predictedStartDate,
        predictedEndDate,
        usedCycleLength,
        usedPeriodLength,
        ovulation,
      },
    });
  } catch (error) {
    console.error("Get Predictions Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// near other imports in cycle.controller.js
// const Cycle = require("../models/cycle.schema");
// const Pregnancy = require("../models/pregnancy.schema"); // for pregnancy suppression
// const {
//   computeCycleStats,
//   predictNextPeriod,
//   predictOvulationWindow,
// } = require("../utils/cycle.utils");

/**
 * GET /api/cycles/calendar?from=2025-10-01&to=2025-10-31
 * returns:
 * {
 *   cycles: [...],
 *   predictedEvents: [{ type: 'period', start, end }, { type: 'ovulation', date, fertileWindowStart, fertileWindowEnd }]
 * }
 */
const getCalendarRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(new Date().setDate(new Date().getDate() + 30));

    // Fetch cycles in an expanded window (older cycles for better stats)
    const cycles = await Cycle.find({ user: req.userData.id }).sort({ startDate: 1 });

    // If user is pregnant, suppress period predictions
    const activePregnancy = await Pregnancy.findOne({ user: req.userData.id });
    const stats = computeCycleStats(cycles);

    const predictions = [];
    if (!activePregnancy) {
      // Use last few cycles to predict next period(s)
      const { predictedStartDate, predictedEndDate, usedCycleLength, usedPeriodLength } =
        predictNextPeriod(cycles, { defaultCycleLength: stats.avgCycleLength || 28, defaultPeriodLength: stats.avgPeriodLength || 5 });

      // if predictedStart falls inside requested range, add it
      if (predictedStartDate >= fromDate && predictedStartDate <= toDate) {
        predictions.push({
          type: "period",
          start: predictedStartDate,
          end: predictedEndDate,
          usedCycleLength,
          usedPeriodLength,
        });

        const ov = predictOvulationWindow(predictedStartDate, usedCycleLength);
        predictions.push({
          type: "ovulation",
          ovulationDate: ov.ovulationDate,
          fertileWindowStart: ov.fertileWindowStart,
          fertileWindowEnd: ov.fertileWindowEnd,
        });
      }
    } else {
      // Optionally include pregnancy milestone events
      const due = activePregnancy.dueDate;
      if (due >= fromDate && due <= toDate) {
        predictions.push({ type: "pregnancy_due", date: due });
      }
    }

    // Filter cycles that overlap the range (cycles with startDate in range OR endDate in range)
    const cyclesInRange = cycles.filter((c) => {
      const s = new Date(c.startDate);
      const e = c.endDate ? new Date(c.endDate) : s;
      return (s >= fromDate && s <= toDate) || (e >= fromDate && e <= toDate) || (s <= fromDate && e >= toDate);
    });

    res.status(200).json({ success: true, data: { cycles: cyclesInRange, predictions } });
  } catch (err) {
    console.error("Get Calendar Range Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// module.exports = { /* existing exports */, getCalendarRange };


module.exports = {
  createCycle,
  getCycles,
  getCycleById,
  updateCycle,
  deleteCycle,
  getPredictions,
  getCalendarRange
};

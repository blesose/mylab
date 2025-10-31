//  const express = require("express");
// const router = express.Router();
// const validateUser = require("../middleware/auth.middleware");
// const { createCycle, getCycles, updateCycle, deleteCycle } = require("../controllers/cycle.controller");

// router.use(validateUser);

// router.post("/", createCycle);
// router.get("/", getCycles);
// router.put("/:id", updateCycle);
// router.delete("/:id", deleteCycle);

// module.exports = router;


const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const {
  createCycle,
  getCycles,
  getCycleById,
  updateCycle,
  deleteCycle,
  getPredictions,
} = require("../controllers/cycle.controller");

// Protect routes
router.use(validateUser);

// CRUD
router.post("/", createCycle);
router.get("/", getCycles);
router.get("/:id", getCycleById);
router.put("/:id", updateCycle);
router.delete("/:id", deleteCycle);

// Predictions endpoint (GET /api/cycles/predictions)
router.get("/predictions/next", getPredictions);

module.exports = router;


const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const ctrl = require("../controllers/cycle.controller");

router.post("/", validateUser, ctrl.createCycle);
router.get("/", validateUser, ctrl.getCycles);
router.get("/predictions/next", validateUser, ctrl.getPredictions);
router.get("/:id", validateUser, ctrl.getCycleById);
router.put("/:id", validateUser, ctrl.updateCycle);
router.delete("/:id", validateUser, ctrl.deleteCycle);

module.exports = router;

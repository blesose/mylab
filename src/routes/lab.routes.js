const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const ctrl = require("../controllers/lab.controller");

router.post("/", validateUser, ctrl.createLab);
router.get("/", validateUser, ctrl.getLabs);
router.get("/:id", validateUser, ctrl.getLabById);
router.put("/:id", validateUser, ctrl.updateLab);
router.delete("/:id", validateUser, ctrl.deleteLab);

module.exports = router;

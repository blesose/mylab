// src/routes/mensHealth.routes.js
const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/auth.middleware");
const {
  createMensHealthRecord,
  getMensHealthRecords,
  getMensHealthRecordById,
  updateMensHealthRecord,
  deleteMensHealthRecord,
} = require("../controllers/mensHealth.controller");

router.use(validateUser);

router.post("/create", createMensHealthRecord);
router.get("/get", getMensHealthRecords);
router.get("/get/:id", getMensHealthRecordById);
router.put("/update/:id", updateMensHealthRecord);
router.delete("/delete/:id", deleteMensHealthRecord);

module.exports = router;

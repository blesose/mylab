const { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } = require("../services/menHealth.service");

async function createRecordHandler(req, res) {
  try {
    const userId = req.userId;
    const payload = req.body;
    const record = await createRecord(userId, payload);

    res.status(201).json({
      success: true,
      message: "Men health record added successfully",
      data: record,
    });
  } catch (err) {
    console.error("Error creating men health record:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create men health record",
      error: err.message,
    });
  }
}


async function listRecordsHandler(req, res, next) {
  try {
    const userId = req.userId || req.params.userId;
    const { page = 1, limit = 50 } = req.query;
    const result = await getRecords(userId, { page, limit });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getRecordHandler(req, res, next) {
  try {
    const userId = req.userId;
    // const insights = await getMenHealthInsights(userId);
    const rec = await getRecordById(userId, req.params.recordId);
    if (!rec) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: rec });
  } catch (err) {
    next(err);
  }
}


async function updateRecordHandler(req, res, next) {
  try {
    const userId = req.userId;
    const updated = await updateRecord(userId, req.params.recordId, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      message: "Men health record updated successfully",
      data: updated
    });
  } catch (err) {
    console.error("Error updating men health record:", err);
    next(err);
  }
}


async function deleteRecordHandler(req, res, next) {
  try {
    const userId = req.userId;
    const deleted = await deleteRecord(userId, req.params.recordId);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  createRecordHandler,
  listRecordsHandler,
  getRecordHandler,
  updateRecordHandler,
  deleteRecordHandler
};

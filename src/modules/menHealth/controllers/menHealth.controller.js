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

// async function updateRecordHandler(req, res, next) {
//   try {
//     const userId = req.userId;
//     const updated = await updateRecord(userId, req.params.recordId, req.body);
//     if (!updated) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     next(err);
//   }
// }
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





// const { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } = require("../services/menHealth.service");
// const { createRecordValidator } = require("../validators/menHealth.validator");
// const { validate } = require("../../../middleware/validate"); // if you use centralized validator


// const MenHealth = require("../models/menHealth.model"); // ✅ import your model

// // // create record handler
// // const createRecordHandler = async (req, res) => {
// //   try {
// //     const userId = req.userId; // from middleware
// //     const { condition, description, date } = req.body;

// //     if (!userId) {
// //       return res.status(400).json({ success: false, message: "User ID missing from token" });
// //     }

// //     const newRecord = new MenHealth({
// //       userId,
// //       condition,
// //       description,
// //       date,
// //     });
    

// //     await newRecord.save();
// //     return res.status(201).json({
// //   success: true,
// //   message: "Men health record added successfully",
// //   data: newRecord, // 👈 add this line
// // });
// //     // return res.status(201).json({ success: true, message: "Men health record added successfully" });
// //   } catch (error) {
// //     console.error("Error creating record:", error);
// //     return res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // const { createRecord } = require("../services/menHealth.service");
// const { generateSmartHealthTip } = require("../ai/ai.helper");

// async function createRecordHandler(req, res, next) {
//   try {
//     const userId = req.userId;
//     const payload = req.body;
//     const insights =  await createRecord;
   
//     // const data = await cycleService.getCyclesWithAnalysis(userId);

//     // 1️⃣ Create the men’s health record
//     // const record = await createRecord(userId, payload);
//         const record = new MenHealth({
//       // userId,
//       // condition,
//       // description,
//       // date,
//       userId,
//       ...payload
//     });

//     // 2️⃣ Generate AI wellness tip (from your ai.helper.js)
//     const aiTip = await generateSmartHealthTip({
//       category: "men's health",
//       userData: payload, // pass user data like stressLevel, sleepHours, etc.
//       context: "record creation"
//     });

//     // 3️⃣ Attach AI tip to record (and optionally save it)
//     record.aiTip = aiTip;
//     await record.save();

//     // 4️⃣ Send final response
//     res.status(201).json({
//       success: true,
//       message: "Men health record added successfully",
//       data: record,
//       aiTip
//     });

//   } catch (err) {
//     console.error("Error creating record:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create men health record",
//       error: err.message
//     });
//   }
// }



// async function listRecordsHandler(req, res, next) {
//   try {
//     const userId = req.userId || req.params.userId;
//     const { page = 1, limit = 50 } = req.query;
//     const result = await getRecords(userId, { page, limit });
//     res.json({ success: true, ...result });
//   } catch (err) {
//     next(err);
//   }
// }

// async function getRecordHandler(req, res, next) {
//   try {
//     const userId = req.userId;
//     // const insights = await getMenHealthInsights(userId);
//     const rec = await getRecordById(userId, req.params.recordId);
//     if (!rec) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, data: rec });
//   } catch (err) {
//     next(err);
//   }
// }

// async function updateRecordHandler(req, res, next) {
//   try {
//     const userId = req.userId;
//     const updated = await updateRecord(userId, req.params.recordId, req.body);
//     if (!updated) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     next(err);
//   }
// }

// async function deleteRecordHandler(req, res, next) {
//   try {
//     const userId = req.userId;
//     const deleted = await deleteRecord(userId, req.params.recordId);
//     if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, message: "Deleted" });
//   } catch (err) {
//     next(err);
//   }
// }


// module.exports = {
//   createRecordHandler,
//   listRecordsHandler,
//   getRecordHandler,
//   updateRecordHandler,
//   deleteRecordHandler
// };
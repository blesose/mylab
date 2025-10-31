const labresultschema = require("../models/LabResult.schema");

sanitizeLab = (lab) => {
  const { __v, ...data } = lab.toObject();
  return data;
};

const createLabResult = async(req, res) => {
  try {
    const { testName, result, unit, normalRange, dateTaken, notes } = req.body;
    console.log(req.body);
    if (!testName || !result || !unit || !normalRange || !dateTaken || !notes) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }
    const lab = await labresultschema({
      user: req.userData.userId,
      testName,
      result,
      unit,
      normalRange,
      dateTaken,
      notes
    });
    await lab.save();
    return res.status(200).json({
      success: true,
      data: sanitizeLab(lab),
      message: "lab result added successfully",
    });
  } catch(error) {
    console.error("create Labresult error:", error.message + error.satck)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  };
};

const getALabResult = async(req, res) => {
  try {
    const lab = await labresultschema.findOne({
      id: req.params.id, user: req.user.id
    });
    if (!lab) {
      return res.status(401).json({
        success: false,
        message: "lab result not found"
      });
    };
    return res.status(201).json({
      success: true,
      data: sanitizeLab(lab),
      message: "lab result found"
    });
  } catch(error) {
    return res.status(501).json({
      success: false,
      message: "could not find result:" + error.message
    });
  };
};

const getAllLabresult = async (req, res) => {
  try {
    const labs = await labresultschema.find();
    if (!labs.length) {
      return res.status(402).json({
        success: false,
        message: "could not find all the lab result"
      });
    };
    return res.status(202).json({
      success: true,
      data: sanitizeLab(labs),
      message: "all labresult found"
    })

    // const labs = await labresultschema.find({user: req.user.id }).sort({ dateTaken: -1 });
    // return res.status(202).json({
    //   success: true,
    //   data: labs.map(sanitizeLab), message: "all lab result"
    // })
  } catch(error) {
    console.error("Get labs error:", error.mesage + error.stack);
    return res.status(502).json({
      success: false,
      message: "Internal server error" + error.message
    });
  };
};

const updateLabResult = async (req, res) => {
  try {
    const update = { ...req.body };
    const lab = await labresultschema.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true, runVaildators: true },
   )
   if (!lab) {
    return res.status(403).json({
      success: false,
      message: "no labresult was not found to be updated"
    });
   };
   return res.status(203).json({
    success: true,
    data: sanitizeLab(lab),
    message: "labresult updated"
   });
  } catch(error) {
    console.error("update error", error.message + error.stack)
    return res.status(503).json({
      success: false,
      message: "Internal server error"
    });
  };
};

const deleteLabResult = async (req, res) => {
  try {
    const lab = await labresultschema.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if(!lab) {
      return res.status(404).json({
        success: false,
        message: "lab result not found"
      });
    }
    return res.status(204).json({
      success: true,
      message: "labresult deleted successfully"
    });
  } catch(error) {
    console.error("Delete lab error:", error.message )
  };
};

module.exports = { createLabResult, getALabResult, getAllLabresult, updateLabResult, deleteLabResult }

// // CREATE lab result
// const createLabResult = async (req, res) => {
//   try {
//     const { testName, result, unit, normalRange, dateTaken, notes } = req.body;

//     const lab = await LabResult.create({
//       user: req.user.id,
//       testName,
//       result,
//       unit,
//       normalRange,
//       dateTaken,
//       notes,
//     });

//     res.status(201).json({ success: true, message: "Lab result added", data: sanitizeLab(lab) });
//   } catch (error) {
//     console.error("Create Lab Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // GET all lab results of user
// const getLabResults = async (req, res) => {
//   try {
//     const labs = await LabResult.find({ user: req.user.id }).sort({ dateTaken: -1 });
//     res.status(200).json({ success: true, data: labs.map(sanitizeLab) });
//   } catch (error) {
//     console.error("Get Labs Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // GET single lab result
// const getLabById = async (req, res) => {
//   try {
//     const lab = await LabResult.findOne({ _id: req.params.id, user: req.user.id });
//     if (!lab) return res.status(404).json({ success: false, message: "Lab result not found" });

//     res.status(200).json({ success: true, data: sanitizeLab(lab) });
//   } catch (error) {
//     console.error("Get Lab Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // UPDATE lab result
// const updateLabResult = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     const lab = await LabResult.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!lab) return res.status(404).json({ success: false, message: "Lab result not found" });

//     res.status(200).json({ success: true, message: "Lab result updated", data: sanitizeLab(lab) });
//   } catch (error) {
//     console.error("Update Lab Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // DELETE lab result
// const deleteLabResult = async (req, res) => {
//   try {
//     const lab = await LabResult.findOneAndDelete({ _id: req.params.id, user: req.user.id });
//     if (!lab) return res.status(404).json({ success: false, message: "Lab result not found" });

//     res.status(200).json({ success: true, message: "Lab result deleted" });
//   } catch (error) {
//     console.error("Delete Lab Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { createLabResult, getLabResults, getLabById, updateLabResult, deleteLabResult };

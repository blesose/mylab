const express = require("express");
const labRouter = express.Router();
const validateUser = require("../middleware/auth.middleware");
const { createLabResult, getAllLabresult, getALabResult, updateLabResult, deleteLabResult } = require("../controllers/LabResult.controller");


labRouter.post("/createlabresult", validateUser, createLabResult);
labRouter.get("/getAlabresult/:id", validateUser, getALabResult);
labRouter.get("/getAllLabresult", validateUser, getAllLabresult);
labRouter.put("/updateLabresult/:id", validateUser, updateLabResult);
labRouter.delete("/deleteLabresult/:id", validateUser, deleteLabResult);

module.exports = labRouter;


// CREATE lab result
// labRouter.post("/", validateUser, createLabResult);

// // GET all lab results for the logged-in user
// labRouter.get("/", validateUser, getLabResults);

// // GET single lab result by ID
// labRouter.get("/:id", validateUser, getLabById);

// // UPDATE lab result
// labRouter.put("/:id", validateUser, updateLabResult);

// // DELETE lab result
// labRouter.delete("/:id", validateUser, deleteLabResult);
// const express = require("express");
// const router = express.Router();
// const validateUser = require("../middlewares/auth.middleware");
// const {
//   createLabResult,
//   getLabResults,
//   getLabById,
//   updateLabResult,
//   deleteLabResult,
// } = require("../controllers/LabResult.controller");

// router.use(validateUser);

// router.post("/", createLabResult);
// router.get("/", getLabResults);
// router.get("/:id", getLabById);
// router.put("/:id", updateLabResult);
// router.delete("/:id", deleteLabResult);

// module.exports = router;

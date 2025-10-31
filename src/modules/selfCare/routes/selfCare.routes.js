const express = require("express");
const {
  addSelfCare,
  fetchSelfCareActivities,
  updateSelfCare,
  deleteSelfCare,
  fetchAllSelfCareActivities,
} = require("../controllers/selfCare.controller.js");
const { authMiddleware } = require("../../../middleware/auth.middleware.js");
// const { authMiddleware } = require("../../../middleware/auth.middleware.js");

const selfcareRouter = express.Router();

// ✅ CREATE
selfcareRouter.post("/add-selfcare", authMiddleware, addSelfCare);

// 📖 READ
selfcareRouter.get("/fetch-selfcare", authMiddleware, fetchAllSelfCareActivities);
selfcareRouter.get("/fetch-aselfcare/:activitiesId", authMiddleware, fetchSelfCareActivities);

// ✏ UPDATE
selfcareRouter.put("/update-selfcare/:activitiesId", authMiddleware, updateSelfCare);

// 🗑 DELETE
selfcareRouter.delete("/delete-selfcare/:id", authMiddleware, deleteSelfCare);

module.exports = { selfcareRouter };
// const express = require("express");
// const { addSelfCare, fetchSelfCareActivities } = require("../controllers/selfCare.controller");
// const { authMiddleware } = require("../../../middleware/auth.middleware");
// const selfcareRouter = express.Router();

// selfcareRouter.post("/add", authMiddleware, addSelfCare);
// selfcareRouter.get("/:userId",  authMiddleware, fetchSelfCareActivities);

// module.exports = { selfcareRouter };



const express = require("express");
const { selfcareRouter } = require("./routes/selfCare.routes");
const selfCareIndexRouter = express.Router();

selfCareIndexRouter.use("/selfcare", selfcareRouter);

module.exports = { selfCareIndexRouter };
// const express = require("express");
// const { addSelfCareActivity, getSelfCareOverview } = require("./controllers/selfCare.controller");
// const { validate } = require("../../middlewares/validate");
// const { addActivityValidator } = require("./validators/selfCare.validator");

// const router = express.Router();

// router.post("/add", validate(addActivityValidator), addSelfCareActivity);
// router.get("/summary", getSelfCareOverview);

// module.exports = router;

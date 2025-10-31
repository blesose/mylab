const express = require("express");
const { labinsightRouter } = require("./routes/labInsights.routes");
const labinsightsIndexRouter = express.Router();

labinsightsIndexRouter.use("/lab", labinsightRouter);
// labinsightsIndexRouter.use("/generate", labinsightRouter);
// const labinsightsIndexRouter = require("./routes/labInsights.routes");
module.exports = { labinsightsIndexRouter };
// const labinsightsIndexRouter = require("./routes/labinsights.routes");
// module.exports = { labinsightsIndexRouter };
// const express = require("express");
// const { fitnessRouter } = require("./routes/fitness.routes");
// const { nutritionRouter } = require("./routes/nutrition.routes");
// const fitnessNutritionRouter = express.Router();

// fitnessNutritionRouter.use("/fitness", fitnessRouter);
// fitnessNutritionRouter.use("/nutrition", nutritionRouter);

// module.exports = { fitnessNutritionRouter };
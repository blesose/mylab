const express = require("express");
require("dotenv").config();
const connectDB = require("./src/config/DBconnection");
const cors = require("cors")

require("./src/modules/labInsights/cron/labinsights.cron");


const userRouter = require("./src/modules/users/routes/user.routes");
const femaleRouter = require("./src/modules/femaleHealth");
const { mensHealthRouter } = require("./src/modules/menHealth");
const { SleepIndexRouter } = require("./src/modules/sleepRecovery");
const { selfCareIndexRouter } = require("./src/modules/selfCare");
const { fitnessNutritionRouter } = require("./src/modules/fitness&Nutrition");
const { communityPostIndexRouter } = require("./src/modules/communityPost");
const { labinsightsIndexRouter } = require("./src/modules/labInsights");

const app = express();
app.use(express.json());

app.use(cors({ 
  origin: ["https://mylabroyal.onrender.com", "http://localhost:5173"], 
  methods:["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use("/api/users", userRouter);
app.use("/api/females", femaleRouter);
app.use("/api/mens", mensHealthRouter);
app.use("/api/shealth", SleepIndexRouter);
app.use("/api/selfhealth", selfCareIndexRouter);
app.use("/api/fitnessnutrition", fitnessNutritionRouter);
app.use("/api/communitypost", communityPostIndexRouter);
app.use("/api/labinsights", labinsightsIndexRouter);


app.get("/", (req, res) => {
  res.json({
    data: true,
    message: "Welcome to MyLab 🤺🤺🤺",
  });
});


app.use((err, req, res, next) => {
  console.error("💥 Error caught:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 9000;
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

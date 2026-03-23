const express = require("express");
require("dotenv").config();

// ** DNS CONFIGURATION - SINGLE DECLARATION **
const dns = require('dns');
try {
    // Set DNS servers explicitly to Google DNS
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    // Force IPv4 resolution order
    dns.setDefaultResultOrder('ipv4first');
    console.log('✅ DNS configured to use:', dns.getServers());
} catch (err) {
    console.log('⚠️ DNS configuration error:', err.message);
}

const connectDB = require("./src/config/DBconnection");
const cors = require("cors");

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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://mylabroyal.onrender.com'
    ];
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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

// Connect to database and then start server
connectDB()
  .then(async () => {
    console.log('✅ Database connected successfully');
    
    // Initialize food database after connection
    try {
      const { initializeFoodDatabase } = require("./src/modules/fitness&Nutrition/services/food.service");
      await initializeFoodDatabase();
      console.log('✅ Food database initialized');
    } catch (err) {
      console.error('⚠️ Food database initialization warning:', err.message);
      // Don't crash the server if food DB init fails
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });
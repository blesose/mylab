const express = require("express");
require("dotenv").config();

const dns = require("dns");
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    dns.setDefaultResultOrder("ipv4first");
    console.log("DNS configured to use:", dns.getServers());
} catch (err) {
    console.log("DNS configuration error:", err.message);
}

const connectDB = require("./src/config/DBconnection");
const cors = require("cors");

const { swaggerUi, specs } = require("./src/swagger");

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
      "https://mylabroyal.onrender.com",
      "http://localhost:5173"
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: "list",
    filter: true,
    showRequestDuration: true,
    tryItOutEnabled: true,
    persistAuthorization: true,
    defaultModelRendering: "model",
    displayRequestDuration: true,
    tagsSorter: "alpha",
    operationsSorter: "alpha",
    syntaxHighlight: {
      activate: true,
      theme: "darkula"
    }
  },
  customCss: `
    .swagger-ui .topbar {
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      padding: 10px 0;
    }
    .swagger-ui .topbar .download-url-wrapper .select-label {
      color: #fff;
    }
    .swagger-ui .info .title {
      color: #1a237e;
      font-size: 32px;
    }
    .swagger-ui .info .description {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #1a237e;
    }
    .swagger-ui .opblock-tag {
      border-bottom: 2px solid #1a237e20;
      font-size: 20px;
    }
    .swagger-ui .opblock-tag:hover {
      background-color: #1a237e10;
    }
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 4px;
      font-weight: bold;
    }
    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      border-color: #1a237e;
      color: #fff;
    }
    .swagger-ui .btn.authorize:hover {
      background: linear-gradient(135deg, #0d47a1, #1a237e);
    }
    .swagger-ui .model-box {
      background: #f8f9fa;
    }
    .swagger-ui section.models {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .swagger-ui .response-col_status {
      font-weight: bold;
    }
  `,
  customSiteTitle: "MyLab API Documentation"
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

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
    success: true,
    message: "Welcome to MyLab API",
  });
});

app.use((err, req, res, next) => {
  console.error("Error caught:", err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 9000;

connectDB()
  .then(async () => {
    console.log("Database connected successfully");
    
    try {
      const { initializeFoodDatabase } = require("./src/modules/fitness&Nutrition/services/food.service");
      await initializeFoodDatabase();
      console.log("Food database initialized");
    } catch (err) {
      console.error("Food database initialization warning:", err.message);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`OpenAPI Spec: http://localhost:${PORT}/api-docs.json`);
      console.log("Environment: " + (process.env.NODE_ENV || "development"));
    });
  })
  .catch(err => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
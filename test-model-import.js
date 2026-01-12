// test-model-import.js
try {
  const LabInsights = require("./src/modules/labInsights/models/labInsights.model");
  console.log("✅ LabInsights model loaded successfully");
  console.log("Model:", LabInsights);
} catch (error) {
  console.log("❌ Error loading LabInsights:", error.message);
  console.log("Full path tried:", __dirname + "/labInsights.model");
}
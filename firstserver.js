// const express = require("express");
// require("dotenv").config();
// const connectDB = require("./Database/dbConnection");
// const helmet = require("helmet");
// const cors = require("cors");
// // const rateLimit = require("express-rate-limit");
// const userRouter = require("./src/routes/user.router");
// // const mongoSanitize = require("express-mongo-sanitize");
// // const userRouter =


const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const connectDB = require("./DataBase/dbConnection");
const userRouter = require("./src/routes/user.routes");
const cron = require("node-cron");
const sendEmail = require("./src/utils/emailSender");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/users", userRouter);

// ✅ CRON JOB 1: Clean expired OTPs daily
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🕛 Running scheduled cleanup job...");
    const OTP = require("./src/models/otp.model");
    const result = await OTP.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log(`✅ Deleted ${result.deletedCount} expired OTPs.`);
  } catch (err) {
    console.error("❌ Error during cleanup:", err.message);
  }
});

// ✅ CRON JOB 2: Send daily health tips email (runs at 8 AM)
cron.schedule("0 8 * * *", async () => {
  try {
    console.log("💌 Sending daily health tip email...");

    // Example health tips
    const tips = [
      "Stay hydrated — drink at least 8 glasses of water daily 💧.",
      "Get 7–8 hours of sleep for better focus and health 😴.",
      "Avoid skipping breakfast — it fuels your body for the day 🍳.",
      "Take short breaks during work to reduce stress 🧘‍♀️.",
      "Do at least 30 minutes of physical activity every day 🏃‍♂️.",
    ];

    // Pick a random tip
    const tip = tips[Math.floor(Math.random() * tips.length)];

    const htmlContent = `
      <h2>🌿 Your Daily Health Tip</h2>
      <p>${tip}</p>
      <hr/>
      <p>💉 From the MyLab Team — caring for your health always.</p>
    `;

    // Example: send to all users (you can later pull this list from DB)
    const recipients = ["testuser1@gmail.com", "testuser2@yahoo.com"];

    for (const email of recipients) {
      await sendEmail(email, "🌞 Daily Health Tip", tip, htmlContent);
    }

    console.log(`✅ Health tips sent to ${recipients.length} users.`);
  } catch (err) {
    console.error("❌ Error sending health tips:", err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to MyLab API 💉");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});




// const express = require("express");
// require("dotenv").config();
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./DataBase/dbConnection");
// const userRouter = require("./src/routes/user.routes");
// const cron = require("node-cron");

// const app = express();
// const PORT = process.env.PORT || 9000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Database connection
// connectDB();

// // Routes
// app.use("/api/users", userRouter);

// // Example Cron Job: Runs every day at midnight
// cron.schedule("0 0 * * *", async () => {
//   try {
//     console.log("🕛 Running scheduled cleanup job...");

//     // Example: delete expired OTPs
//     const OTP = require("./src/models/otp.model");
//     const result = await OTP.deleteMany({
//       expiresAt: { $lt: new Date() },
//     });

//     console.log(`✅ Cleanup complete. Deleted ${result.deletedCount} expired OTPs.`);
//   } catch (err) {
//     console.error("❌ Error during scheduled task:", err.message);
//   }
// });

// // Default route
// app.get("/", (req, res) => {
//   res.send("Welcome to MyLab API 💉");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

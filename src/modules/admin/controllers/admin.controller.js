const AdminService = require("../services/admin.service");

// src/controllers/admin.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mylab.com";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Store bcrypt hash in .env

// Example: generate hash in terminal (Node):
//   node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL)
      return res.status(401).json({ message: "Unauthorized email" });

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Admin login successful",
      token,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  const result = await AdminService.listUsers();
  res.json(result);
};

exports.getAllPosts = async (req, res) => {
  const result = await AdminService.listPosts();
  res.json(result);
};

exports.getInsightsSummary = async (req, res) => {
  const result = await AdminService.aggregateInsights();
  res.json(result);
};

exports.sendBroadcast = async (req, res) => {
  const { title, message } = req.body;
  await AdminService.queueBroadcast(title, message);
  res.json({ success: true, message: "Broadcast queued" });
};

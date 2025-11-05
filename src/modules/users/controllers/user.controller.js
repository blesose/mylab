const userschema = require("../models/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to hide sensitive fields
const sanitizeUser = (user) => {
  const { password, __v, ...safeData } = user.toObject();
  return safeData;
};

// ---------------------- REGISTER ----------------------
const register = async (req, res) => {
  try {
    const { name, userName, email, password, phone, dob, gender, role } = req.body;

    // Check missing fields
    if (!name || !userName || !email || !password || !phone || !dob || !gender || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await userschema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userschema.create({
      name,
      userName,
      email,
      phone,
      password: hashedPassword,
      dob,
      gender,
      role,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET, // must be defined in .env
      { expiresIn: "7d" }
    );

    console.log("✅ User registered:", newUser.email);
    console.log(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------------- LOGIN ----------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userschema.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }
//     console.log("Body password:", password);
// console.log("User password from DB:", user?.password);


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    console.log("✅ Login successful:", user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ Login error:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------------- GET PROFILE ----------------------
const getProfile = async (req, res) => {
  try {
    const user = await userschema.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ Get profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------------- GET ALL USERS ----------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await userschema.find();
    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: users.map((u) => sanitizeUser(u)),
    });
  } catch (error) {
    console.error("❌ Get all users error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await userschema.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("❌ Update profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------------- DELETE USER ----------------------
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userschema.findByIdAndDelete(req.userId);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete user error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers,
  updateProfile,
  deleteUser,
};

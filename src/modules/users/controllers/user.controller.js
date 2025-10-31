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

// const userschema = require("../models/user.schema");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// // const { signupValidator, loginValidator } = require("../validators/user.validator");

// // Helper: hide sensitive fields
// const sanitizeUser = (user) => {
//   const { password, __v, ...safeData } = user.toObject();
//   return safeData;
// };

// const register = async(req, res) => {
//   try {
//     const {name, userName, email, password, phone, dob, gender, role } = req.body;
//     // if(!name || !userName || !phone|| !email || !password || !dob || !gender || !role) {
//     //   console.log(req.body);
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "All fields required"
//     //   });
//     // };
// console.log(req.body);
//      const verifyemail = await userschema.findOne({ email });
//     if(verifyemail) {
//       return res.status(401).json({
//         success: false,
//         message: "Email already in use"
//       })
//     } else {
//       if (password) {
//       bcrypt.hash(password, 10).then((hashresult) => {
//         const user = new userschema({
//           name, 
//           userName,
//           phone,
//           email, 
//           password: hashresult, 
//           dob, 
//           gender, 
//           role,
          
//         });
//         user
//         .save()
//         .then((response) => {
//         console.log(response.data);
//         let jwtToken = jwt.sign(
//           {
//             email: response.email,
//             id: response._id,
//             gender: response.gender,
//             role: response.role
//           },
//           process.env.JWT_SECRET,
//           { expiresIn: "7d" }
//         );
//         return res.status(200).json({
//           success: true,
//           message: "user registration successsfully",
//           data: { accessToken: jwtToken },
//           data: sanitizeUser(user)
//       });
//     });
// });
//     }
 
//     }

//   } catch(error) {
//     console.log("Error:", error.message + error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error"
//     });
//   };
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if(!email || !password) {
//       return res.status(401).josn({
//         success: false,
//         message: "All fields required"
//       });
//     };
//     const user = await userschema.findOne({ email })
//       if (!user) {
//       return res.status(402).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid password"
//       });
      
//     } else {
//       const jwtToken = jwt.sign(
//         {
//           email: user.email, id: user._id, role: user.role
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
//       user.lastLogin = new Date();
//       return res.status(201).json({
//         success: true,
//         jwtToken,
//         data: sanitizeUser(user),
//         message: "Login successful"
//       });
//     }
//   } catch(error) {
//     return res.status(501).json({
//       success: false,
//       message: "Internal server error" + error.message
//     });
//   };
// };

// const getProfile = async(req, res) => {
//   try {
//     const  user = await userschema.findById(req.userId);
//     if (!user) {
//       return res.status(405).json({
//         success: false,
//         message: "Profile not found"
//       });
//     }
//     return res.status(203).json({
//       success: true,
//       data: sanitizeUser(user),
//       message: "profile found successfully"
//     })
//   } catch(error) {
//     return res.status(502).json({
//       success: false,
//       message: "Internal server error" + error.message
//     });
//   };
// }

// const getAllUsers = async(req, res) => {
//   try {
//     const users = await userschema.find();
//     if(!users.length) {
//       return res.status(406).json({
//         success: false,
//         message: "could not find users at the moment" + error.message
//       });
//     };
//     return res.status(204).json({
//       success: true,
//       data: sanitizeUser(users),
//       message: "All users found successfully"
//     })
//   } catch(error) {
//     return res.status(503).json({
//       success: false,
//       message: "Internal server error" + error.message
//     });
//   };
// };

// const updateProfile = async(req, res) => {
//   try {
//     const update = {  ...req.body };
//     if (update.password) {
//       update.password = await bcrypt.hash(update.passord, 10);
//     };
//     const user = await userschema.findByIdAndUpdate(req.user.id, update, 
//       {new: true, runValidators: true}
//     );
//     if(!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
//     return res.status(202).json({
//       success: true,
//       data: sanitizeUser(user),
//       message: "Profile updated successfully"
//     });
//   } catch(error) {
//     return res.status(502).json({
//       success: false,
//       message: "Internal server error" + error.message
//     });
//   };
// };

// const deleteUser = async(req, res) => {
//   try {
//     // const userId = req.params.userId
//     //  await userschema.findByIdAndDelete(userId);
//     const user = await userschema.findByIdAndDelete(req.user.id)
//     if(!user){
//       return res.status.json({
//         success: false,
//         message: "user not found," + error.message,
//       })
//     }
//      return res.status(203).json({
//       success: true,
//       message: "User deleted successfully"
//      })
//   } catch(error) {
//     return res.status(503).json({
//       success: false,
//       message: "Failed to delete user from database"
//     });
//   };
// };



// module.exports = { register, login, getProfile, getAllUsers, updateProfile, deleteUser };
// const jwt = require("jsonwebtoken");
// const userschema = require("../models/user.schema"); // ✅ FIX: import User model
// const { signupValidator, loginValidator } = require("../validators/user.validator");

// // Helper functions
// const sanitize = (user) => {
//   const obj = user.toObject();
//   delete obj.password;
//   return obj;
// };

// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// // ======================== REGISTER ========================
// const register = async (req, res) => {
//   try {
//     const { error } = signupValidator.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     const { name, email, userName, password, phone, gender, dob, role } = req.body;

//     const existing = await userschema.findOne({ email });
//     if (existing)
//       return res.status(400).json({ success: false, message: "Email already used" });

//     const user = await userschema.create({ name, email, userName, password, phone, gender, dob, role });
//     const token = generateToken(user._id);

//     return res.status(201).json({
//       success: true,
//       data: { token, user: sanitize(user) },
//     });
//   } catch (err) {
//     console.error("Register err:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ======================== LOGIN ========================
// const login = async (req, res) => {
//   try {
//     const { error } = loginValidator.validate(req.body);
//     if (error)
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });

//     const { email, password } = req.body;
//     const user = await userschema.findOne({ email });

//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     const token = generateToken(user._id);
//     return res.status(200).json({
//       success: true,
//       data: { token, user: sanitize(user) },
//     });
//   } catch (err) {
//     console.error("Login err:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ======================== PROFILE ========================
// const getProfile = async (req, res) => {
//   try {
//     const user = await userschema.findById(req.userData.id).select("-password");
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });
//     res.json({ success: true, data: sanitize(user) });
//   } catch (err) {
//     console.error("Profile err:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     if (updates.password) {
//       const u = await User.findById(req.userData.id);
//       if (!u)
//         return res.status(404).json({ success: false, message: "User not found" });
//       Object.assign(u, updates);
//       await u.save();
//       return res.json({ success: true, data: sanitize(u) });
//     } else {
//       const user = await userschema.findByIdAndUpdate(req.userData.id, updates, {
//         new: true,
//         runValidators: true,
//       }).select("-password");
//       if (!user)
//         return res.status(404).json({ success: false, message: "User not found" });
//       return res.json({ success: true, data: sanitize(user) });
//     }
//   } catch (err) {
//     console.error("Update profile err:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const user = await userschema.findByIdAndDelete(req.userData.id);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });
//     res.json({ success: true, message: "User deleted" });
//   } catch (err) {
//     console.error("Delete user err:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { register, login, getProfile, updateProfile, deleteUser };


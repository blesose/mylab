const userschema = require("../models/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { signupValidator, loginValidator } = require("../validators/user.validator");

// Helper: hide sensitive fields
const sanitizeUser = (user) => {
  const { password, __v, ...safeData } = user.toObject();
  return safeData;
};

const register = async(req, res) => {
  try {
    const {name, email, password, dob, gender, role } = req.body;
    if(!name || !email || !password || !dob || !gender || !role) {
      console.log(req.body);
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    };

     const verifyemail = await userschema.findOne({ email });
    if(verifyemail) {
      return res.status(401).json({
        success: false,
        message: "Email already in use"
      })
    } else {
      if (password) {
      bcrypt.hash(password, 10).then((hashresult) => {
        const user = new userschema({
          name, 
          email, 
          password: hashresult, 
          dob, 
          gender, 
          role,
          profilePicture
        });
        user
        .save()
        .then((response) => {
        console.log(response.data);
        let jwtToken = jwt.sign(
          {
            email: response.email,
            id: response._id,
            gender: response.gender,
            role: response.role
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        return res.status(200).json({
          success: true,
          message: "user registration successsfully",
          data: { accessToken: jwtToken },
          data: sanitizeUser(user)
      });
    });
});
    }
 
    }

  } catch(error) {
    console.log("Error:", error.message + error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  };
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(401).josn({
        success: false,
        message: "All fields required"
      });
    };
    const user = await userschema.findOne({ email })
      if (!user) {
      return res.status(402).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid password"
      });
      
    } else {
      const jwtToken = jwt.sign(
        {
          email: user.email, id: user._id, role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      user.lastLogin = new Date();
      return res.status(201).json({
        success: true,
        jwtToken,
        data: sanitizeUser(user),
        message: "Login successful"
      });
    }
  } catch(error) {
    return res.status(501).json({
      success: false,
      message: "Internal server error" + error.message
    });
  };
};

const getProfile = async(req, res) => {
  try {
    const  user = await userschema.findById(req.userId);
    if (!user) {
      return res.status(405).json({
        success: false,
        message: "Profile not found"
      });
    }
    return res.status(203).json({
      success: true,
      data: sanitizeUser(user),
      message: "profile found successfully"
    })
  } catch(error) {
    return res.status(502).json({
      success: false,
      message: "Internal server error" + error.message
    });
  };
}

const getAllUsers = async(req, res) => {
  try {
    const users = await userschema.find();
    if(!users.length) {
      return res.status(406).json({
        success: false,
        message: "could not find users at the moment" + error.message
      });
    };
    return res.status(204).json({
      success: true,
      data: sanitizeUser(users),
      message: "All users found successfully"
    })
  } catch(error) {
    return res.status(503).json({
      success: false,
      message: "Internal server error" + error.message
    });
  };
};

const updateProfile = async(req, res) => {
  try {
    const update = {  ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.passord, 10);
    };
    const user = await userschema.findByIdAndUpdate(req.user.id, update, 
      {new: true, runValidators: true}
    );
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(202).json({
      success: true,
      data: sanitizeUser(user),
      message: "Profile updated successfully"
    });
  } catch(error) {
    return res.status(502).json({
      success: false,
      message: "Internal server error" + error.message
    });
  };
};

const deleteUser = async(req, res) => {
  try {
    // const userId = req.params.userId
    //  await userschema.findByIdAndDelete(userId);
    const user = await userschema.findByIdAndDelete(req.user.id)
    if(!user){
      return res.status.json({
        success: false,
        message: "user not found," + error.message,
      })
    }
     return res.status(203).json({
      success: true,
      message: "User deleted successfully"
     })
  } catch(error) {
    return res.status(503).json({
      success: false,
      message: "Failed to delete user from database"
    });
  };
};



module.exports = { register, loginUser, getProfile, getAllUsers, updateProfile, deleteUser };
// const userschema = require("../models/user.schema");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// // const { signupValidator, loginValidator } = require("../validators/user.validator");

// // Helper: hide sensitive fields
// const sanitizeUser = (user) => {
//   const { password, __v, ...safeData } = user.toObject();
//   return safeData;
// };

// // REGISTER
// const register = async (req, res) => {
//   try {
//     // Validate request
//     const { error } = signupValidator.validate(req.body);
//     if (error) return res.status(400).json({ success: false, message: error.details[0].message });

//     const { name, email, password, dob, role, gender } = req.body;

//     const existingUser = await userschema.findOne({ email });
//     if (existingUser) return res.status(400).json({ success: false, message: "Email already in use" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await userschema.create({ name, email, password: hashedPassword, dob, role, gender });

//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(201).json({ success: true, message: "User registered successfully", data: { accessToken: token } });

//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // LOGIN
// const loginUser = async (req, res) => {
//   try {
//     const { error } = loginValidator.validate(req.body);
//     if (error) return res.status(400).json({ success: false, message: error.details[0].message });

//     const { email, password } = req.body;

//     const user = await userschema.findOne({ email });
//     if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({ success: true, message: "Login successful", token, data: sanitizeUser(user) });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // GET PROFILE
// const getProfile = async (req, res) => {
//   try {
//     const user = await userschema.findById(req.user.id);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     res.status(200).json({ success: true, data: sanitizeUser(user) });
//   } catch (error) {
//     console.error("Get Profile Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // UPDATE PROFILE
// const updateProfile = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     if (updates.password) {
//       updates.password = await bcrypt.hash(updates.password, 10);
//     }

//     const user = await userschema.findByIdAndUpdate(req.user.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     res.status(200).json({ success: true, message: "Profile updated", data: sanitizeUser(user) });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // DELETE USER
// const deleteUser = async (req, res) => {
//   try {
//     const user = await userschema.findByIdAndDelete(req.user.id);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     res.status(200).json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Delete User Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { register, loginUser, getProfile, updateProfile, deleteUser };

//  const express = require("express");
//  const userschema = require("../models/user.schema");
//  const bcrypt = require("bcryptjs");
//  const jwt = require("jsonwebtoken");
// const sanitizeUser = (user) => {
//   const { password, __v, ...safeData } = user.toObject();
//   return safeData;
// };
//  const register = async (req, res) => {
//   try {
//     const { name, email, password, dob, role, gender } = req.body;

//     const existingUser = await userschema.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email already in use" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await userschema.create({
//       name, email, gender, dob, role, password: hashedPassword
//     });

//     const jwtToken = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.status(201).json({
//       success: true,
//       data: { accessToken: jwtToken },
//       message: "User registered successfully"
//     });

//   } catch (error) {
//     console.error("Register Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userschema.findOne({ email });
//     if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({ success: true, message: "Login successful", token, data: sanitizeUser(user) });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     if (updates.password) {
//       updates.password = await bcrypt.hash(updates.password, 10);
//     }

//     const user = await userschema.findByIdAndUpdate(req.user.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     res.status(200).json({ success: true, message: "Profile updated", data: sanitizeUser(user) });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

//  const getProfile = async (req, res) => {
//   try {
//     const user = await userschema.findById(req.user.id); 
//      if (!user) {
//        return res.status(404).json({
//         success: false,
//          message: "User not found",
//        });
//      }

//      res.status(200).json({
//      success: true,
//        data: sanitizeUser(user),
//      });
//    } catch (error) {
//      console.error("Get Profile Error:", error);
//      res.status(500).json({ success: false, message: "Server error" });
//    }
//  };

//  const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete User Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { register, loginUser, getProfile, updateProfile, deleteUser }

// const express = require("express");
// const userschema = require("../models/user.schema");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // Helper: hide sensitive fields
// const sanitizeUser = (user) => {
//   const { password, __v, ...safeData } = user.toObject();
//   return safeData;
// };
// const register = async (req, res) => {
//   try {
//     const { name, email, password, dob, role, gender } = req.body;
//     console.log(req.body);

//     verifyemail = await userschema.findOne({ email });

//     if (verifyemail) {
//       return res.status(400).json({
//         success: false,
//         message: "email already in use"
//       });
//     } else {
//       if (password) {
//         bcrypt.hash(password, 10).then((hashresult) => {
//           const user = new userschema ({
//             name,
//             gender,
//             password: hashresult,
//             dob,
//             role,
//             email,
//           });
//           user
//           .save()
//           .then((response) => {
//             console.log(response.data);
//             let jwtToken = jwt.sign(
//               {
//                 email: response.email,
//                 name: response.name,
//                 dob: response.dob,
//                 gender: response.gender
//               },
//               process.env.JWT_SECRET,
//               { expiresIn: "7d" }
//             );
//             return res.status(201).json({
//               success: true,
//               data: { accessToken: jwtToken },
//               message: " User registered successfully"
//             });
//           })
//           .catch((err) => {
//             res.status(500).json({
//               error: err,
//             });
//           });
//         });
//       };
//     };
//   } catch(error) {
//     console.error("Register Error:", error);
//     return res.status(412).send({
//       success: false,
//       mesage: error.message,
//     });
//   };
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userschema.findOne({ email });
//     if (!user) {
//       return res.status(403).json({
//         success: false,
//         message: "invalid credentials"
//       })
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials"
//       })
//     }
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//      // Update last login
//      user.lastLogin = new Date();
//      await user.save();
     
//      res.status(200).json({
//       success: true,
//       message: "Login sucessfully",
//       token,
//       data: sanitizeUser(user)
//      });


// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //       token,
// //       data: sanitizeUser(user),
// //     });
// //   } catch (error) {
// //     console.error("Login Error:", error);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }

//   //   let getUser;

//   //   userschema
//   //   .findOne({ email })
//   //   .then((user) => {
//   //     if (!user) {
//   //       return res.status(404).json({
//   //         mesage: "authorization failed"
//   //       });
        
//   //     }
//   //     getUser = user;
//   //     return bcrypt.compare(password, user.password);
//   //   })
//   //   .then((response) => {
//   //     if (!response) {
//   //       return res.status(404).json({
//   //         message: "invalid password"
//   //       })
//   //     } else {
//   //       let jwtToken = jwt.sign(
//   //         {
//   //           id: user._id,
//   //         role: user.role
//   //         },
//   //         process.env.JWT_SECRET,
//   //         { expiresIn: "7d" }
//   //       )
//   //       return res.status(200).json({
//   //         success: true,
//   //         data: { accessToken: jwtToken },
//   //         message: "login successfully",
//   //       })
//   //     }
//   //   })
//   // .catch((err) => {
//   //   return res.status(401).json({
//   //     success: false,
//   //     message: err.message
//   //   })
//   // })
//   } catch(error) {
//     console.error("Login Error:", error)
//     return res.status(500).json({
//       sucess: false,
//       message: "Sever error"
//     })
//   };
// };

// const getProfile = async (req, res) => {
//   try {
//     const user = await userschema.findById(req.user.id); 
//      if (!user) {
//        return res.status(404).json({
//         success: false,
//          message: "User not found",
//        });
//      }

//      res.status(200).json({
//      success: true,
//        data: sanitizeUser(user),
//      });
//    } catch (error) {
//      console.error("Get Profile Error:", error);
//      res.status(500).json({ success: false, message: "Server error" });
//    }
//  };


//  const updateProfile = async (req, res) => {
//    try {
//      const updates = { ...req.body };
//   if (updates.password) {
//    await bcrypt.hash(password, 10)
//   }

//      const user = await userschema.findByIdAndUpdate(req.user.id, updates, {
//        new: true,
//        runValidators: true,
//        });

//       if (!user) {
//         return res.status(404).json({
//          success: false,
//          message: "User not found",
//        });
//      }

//       res.status(200).json({
//         success: true,
//         message: "Profile updated",
//         data: sanitizeUser(user),
//       });
//    } catch (error) {
//       console.error("Update Profile Error:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//  };

//  const deleteUser = async (req, res) => {
//   try {
//     const user = await userschema.findByIdAndDelete(req.user.id);

//     if(!user) {
//       return res.status(404).json({
//         success: false,
//         message: "user not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "user deleted successfully",
//     })
//   } catch(error) {
//     console.error("Delete user error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     })
//   }
//  };


// module.exports =  { register, loginUser, getProfile, updateProfile, deleteUser };
// controllers/user.controller.js
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/user.schema"); // adjust path if needed

// // Helper: hide sensitive fields
// const sanitizeUser = (user) => {
//   const { password, __v, ...safeData } = user.toObject();
//   return safeData;
// };

// // ===============================
// // CREATE (Register new user)
// // ===============================
// const register = async (req, res) => {
//   try {
//     const { name, email, password, gender, dob, role } = req.body;

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is already registered",
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       gender,
//       dob,
//       role,
//     });

//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: sanitizeUser(user),
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===============================
// // LOGIN (Authenticate user)
// // ===============================
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       data: sanitizeUser(user),
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===============================
// // GET PROFILE (Authenticated user)
// // ===============================
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id); // req.user comes from auth middleware
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: sanitizeUser(user),
//     });
//   } catch (error) {
//     console.error("Get Profile Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===============================
// // UPDATE PROFILE
// // ===============================
// const updateProfile = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     // If password is updated, hash it
//     if (updates.password) {
//       const salt = await bcrypt.genSalt(10);
//       updates.password = await bcrypt.hash(updates.password, salt);
//     }

//     const user = await User.findByIdAndUpdate(req.user.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile updated",
//       data: sanitizeUser(user),
//     });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ===============================
// // DELETE USER
// // ===============================
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete User Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { register, loginUser, getProfile, updateProfile, deleteUser }
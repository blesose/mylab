const jwt = require("jsonwebtoken");

const validateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // recommended env name
    req.userData = decoded;
    req.userId = decoded.id; // convenient for DB queries

    next();
  } catch (error) {
    console.error("JWT validation error:", error.message);
    return res.status(401).json({ message: "Authentication failed: Invalid or expired token" });
  }
};

module.exports = validateUser;

// const jwt = require("jsonwebtoken");

// const validateUser = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Authentication failed: No or invalid token format",
//       });
//     }

//     // Extract token safely
//     const token = authHeader.split(" ")[1]; // safer than replace()
    
//     // Verify token
//     const decodedData = jwt.verify(token, process.env.SECRET);

//     // Attach decoded payload to req for later use
//     req.userData = decodedData;

//     next();
//   } catch (error) {
//     console.error("JWT validation error:", error.message);
//     return res.status(401).json({
//       message: "Authentication failed: Invalid or expired token",
//     });
//   }
// };

// module.exports = validateUser;





























// const jwt = require("jsonwebtoken");
// const User = require("../models/user.schema"); // adjust path if needed

// // Middleware to protect routes
//  const authMiddleware = async (req, res, next) => {
//   try {
//     // 1️⃣ Get token from headers
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided. Authorization denied",
//       });
//     }

//     // 2️⃣ Extract token
//     const token = authHeader.split(" ")[1];

//     // 3️⃣ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 4️⃣ Attach user to request
//     const user = await User.findById(decoded.id).select("-password -__v");
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found. Invalid token",
//       });
//     }

//     req.user = user; // now accessible in controllers
//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error);

//     return res.status(401).json({
//       success: false,
//       message: "Token is invalid or expired",
//     });
//   }
// };

// // Middleware for role-based access
// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to access this resource",
//       });
//     }
//     next();
//   };
// };

// module.exports = { authMiddleware, authorizeRoles }
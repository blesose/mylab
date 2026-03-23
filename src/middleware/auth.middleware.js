const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to the request
    req.userData = decoded;
    req.userId = decoded.id; // convenience for DB queries
    console.log(decoded.id)

    next();
  } catch (error) {
    console.error("JWT validation error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed: Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
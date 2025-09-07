const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

      console.log(token)

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "🚫 Token not provided",
      });
    }

    const token1 = jwt.sign(
  { id: "68b1e30eee58d3cadbab7be7", accountType: "Instructor", email: "neerajyadav72005@gmail.com" },
  process.env.JWT_SECRET, // must match server secret
  { expiresIn: "1h" }
);

console.log(token1);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach payload
    req.user = decoded; // ✅ consistent casing

    console.log("Decoded JWT:", decoded);

    next();
  } catch (e) {
    console.error("JWT Error:", e.message);
    return res.status(401).json({
      success: false,
      message:
        e.name === "TokenExpiredError"
          ? "⏳ Token expired, please log in again"
          : "⚠️ Invalid token",
    });
  }
};

// ✅ Generic role authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.accountType)) {
      return res.status(403).json({
        success: false,
        message: `This route is protected. Required roles: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

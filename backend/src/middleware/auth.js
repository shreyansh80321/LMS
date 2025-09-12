const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const COOKIE_NAME = process.env.COOKIE_NAME || "lm_token";

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // ✅ attach user to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

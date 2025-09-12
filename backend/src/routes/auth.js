const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const COOKIE_NAME = process.env.COOKIE_NAME || "lm_token";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "strict", // better CSRF protection
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    return res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// GET CURRENT USER
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error("Me route error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;

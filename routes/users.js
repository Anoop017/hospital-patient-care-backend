// routes/users.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/users/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

// @route   GET /api/users/check-role
router.get("/check-role", authMiddleware, (req, res) => {
  res.json({ role: req.user.role });
});

// @route   GET /api/users/logout
router.get("/logout", (req, res) => {
  // In stateless JWT, logout is handled on the frontend
  res.json({ message: "Logout successful" });
});

export default router;

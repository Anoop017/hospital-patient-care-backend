// routes/doctors.js
import express from "express";
import Doctor from "../models/Doctor.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// POST: Create new doctor (admin only)
router.post("/", authMiddleware, async (req, res) => {
  const { userId, specialization, availability, experience } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor user" });
    }

    const existingDoctor = await Doctor.findOne({ user: userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const newDoctor = new Doctor({
      user: userId,
      specialization,
      availability,
      experience,
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ message: "Error creating doctor", error: err.message });
  }
});

// GET: Fetch all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "name email");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors", error: err.message });
  }
});

export default router;

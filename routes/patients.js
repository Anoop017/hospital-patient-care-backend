// routes/patients.js
import express from "express";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST: Register a new patient (admin only)
router.post("/", authMiddleware, async (req, res) => {
  const { userId, age, gender, bloodGroup, medicalHistory } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "patient") {
      return res.status(400).json({ message: "Invalid patient user" });
    }

    const existingPatient = await Patient.findOne({ user: userId });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const newPatient = new Patient({
      user: userId,
      age,
      gender,
      bloodGroup,
      medicalHistory,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
  } catch (err) {
    res.status(500).json({ message: "Error registering patient", error: err.message });
  }
});

// GET: Fetch all patients (admin only)
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const patients = await Patient.find().populate("user", "name email");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients", error: err.message });
  }
});

export default router;

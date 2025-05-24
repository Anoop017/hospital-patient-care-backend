// routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Patient from "../models/Patient.js";

const router = express.Router();

// POST: Submit feedback (patient only)
router.post("/", authMiddleware, async (req, res) => {
  const { message, rating } = req.body;

  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Only patients can submit feedback" });
  }

  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const newFeedback = new Feedback({
      patient: patient._id,
      message,
      rating,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted", feedback: newFeedback });
  } catch (err) {
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
});

// GET: View all feedback (admin only)
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  try {
    const feedbacks = await Feedback.find().populate("patient", "user");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch feedback", error: err.message });
  }
});

export default router;

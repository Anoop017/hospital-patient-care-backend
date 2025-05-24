// routes/appointments.js
import express from "express";
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST: Book an appointment (patient only)
router.post("/", authMiddleware, async (req, res) => {
  const { doctorId, date, time, notes } = req.body;

  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Only patients can book appointments" });
  }

  try {
    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date,
      time,
      notes,
      status: "pending",
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// GET: View all appointments (admin or doctor)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "admin") {
      appointments = await Appointment.find()
        .populate("doctor", "user")
        .populate("patient", "user");
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user.id })
        .populate("patient", "user");
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments", error: err.message });
  }
});

export default router;

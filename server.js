// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import Patient from "./models/Patient.js";
import Appointment from "./models/Appointment.js";
import Feedback from "./models/Feedback.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import doctorRoutes from "./routes/doctors.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import feedbackRoutes from "./routes/feedback.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());


// Database Connection
connectDB();


const insertTestUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (!existingUser) {
      const newUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        role: "admin",

      });
      await newUser.save();
      console.log("✅ Test user created!");
    } else {
      console.log("⚠️ Test user already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }

};

const insertTestDoctor = async () => {
  try {
    const user = await User.findOne({ email: "test@example.com" });
    if (!user) return console.log("Test user not found!");

    const existingDoctor = await Doctor.findOne({ user: user._id });
    if (!existingDoctor) {
      const newDoctor = new Doctor({
        user: user._id,
        specialization: "Cardiology",
        availability: "10 AM - 2 PM",
        experience: 5,
      });
      await newDoctor.save();
      console.log("✅ Test doctor created!");
    } else {
      console.log("⚠️ Test doctor already exists.");
    }
  } catch (err) {
    console.error("❌ Error inserting test doctor:", err);
  }
};

const insertTestPatient = async () => {
  try {
    const user = await User.findOne({ email: "test@example.com" });
    if (!user) return console.log("Test user not found!");

    const existingPatient = await Patient.findOne({ user: user._id });
    if (!existingPatient) {
      const newPatient = new Patient({
        user: user._id,
        age: 30,
        gender: "male",
        bloodGroup: "B+",
        medicalHistory: ["Diabetes", "High blood pressure"],
      });
      await newPatient.save();
      console.log("✅ Test patient created!");
    } else {
      console.log("⚠️ Test patient already exists.");
    }
  } catch (err) {
    console.error("❌ Error inserting test patient:", err);
  }
};

const insertTestAppointment = async () => {
  try {
    const patient = await Patient.findOne();
    const doctor = await Doctor.findOne();
    if (!patient || !doctor) return console.log("Doctor or patient not found!");

    const existingAppointment = await Appointment.findOne({ doctor: doctor._id, patient: patient._id });
    if (!existingAppointment) {
      const newAppointment = new Appointment({
        doctor: doctor._id,
        patient: patient._id,
        date: "2025-05-20",
        time: "11:00 AM",
        status: "confirmed",
        notes: "Regular check-up",
      });
      await newAppointment.save();
      console.log("✅ Test appointment created!");
    } else {
      console.log("⚠️ Test appointment already exists.");
    }
  } catch (err) {
    console.error("❌ Error inserting test appointment:", err);
  }
};

const insertTestFeedback = async () => {
  try {
    const patient = await Patient.findOne();
    if (!patient) return console.log("Patient not found!");

    const existingFeedback = await Feedback.findOne({ patient: patient._id });
    if (!existingFeedback) {
      const newFeedback = new Feedback({
        patient: patient._id,
        message: "Great service and friendly staff!",
        rating: 4,
      });
      await newFeedback.save();
      console.log("✅ Test feedback created!");
    } else {
      console.log("⚠️ Test feedback already exists.");
    }
  } catch (err) {
    console.error("❌ Error inserting test feedback:", err);
  }
};


// insertTestUser();
// insertTestDoctor();
// insertTestPatient();
// insertTestAppointment();
// insertTestFeedback();



app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/feedback", feedbackRoutes);
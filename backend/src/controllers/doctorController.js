import { v4 as uuidv4 } from "uuid";
import { db } from "../config/google-sheets.js";

// ================= ADD DOCTOR =================
export const addDoctor = async (req, res) => {
  try {
    const { hospitalId, name, specialty, email, phone, qualification } = req.body;

    if (!hospitalId || !name || !specialty || !email || !phone || !qualification) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const doctorData = {
      id: uuidv4(),
      hospitalId,
      name,
      specialty,
      email,
      phone,
      qualification,
      createdAt: new Date().toISOString(),
    };

    await db.addDoctor(doctorData);

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: doctorData,
    });
  } catch (error) {
    console.error("Add doctor error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to add doctor",
    });
  }
};

// ================= GET DOCTORS BY HOSPITAL =================
export const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ error: "Hospital ID required" });
    }

    const doctors = await db.getDoctorsByHospital(hospitalId);

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch doctors",
    });
  }
};

// ================= GET ALL DOCTORS =================
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await db.getAllDoctors();

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch doctors",
    });
  }
};

// ================= DELETE DOCTOR (NEW & REQUIRED) =================
export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID required" });
    }

    await db.deleteDoctor(doctorId);

    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete doctor",
    });
  }
};

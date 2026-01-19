import express from "express";
import {
  addDoctor,
  getDoctorsByHospital,
  getAllDoctors,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/add", addDoctor);
router.get("/hospital/:hospitalId", getDoctorsByHospital);
router.get("/list", getAllDoctors);
router.delete("/:doctorId", deleteDoctor);

// ✅ THIS LINE WAS MISSING
export default router;

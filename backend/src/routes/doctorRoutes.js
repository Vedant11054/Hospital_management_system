import express from 'express';
import { addDoctor, getDoctorsByHospital, getAllDoctors } from '../controllers/doctorController.js';

const router = express.Router();

router.post('/add', addDoctor);
router.get('/hospital/:hospitalId', getDoctorsByHospital);
router.get('/list', getAllDoctors);

export default router;

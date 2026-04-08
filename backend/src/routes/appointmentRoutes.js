import express from 'express';
import { bookAppointment, getPatientAppointments, getDoctorAppointments, getHospitalAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/book', bookAppointment);
router.get('/patient/:patientId', getPatientAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.get('/hospital/:hospitalId', getHospitalAppointments);
router.patch('/:id/status', updateAppointmentStatus);


export default router;

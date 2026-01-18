import express from 'express';
import { addHospital, getAllHospitals } from '../controllers/hospitalController.js';

const router = express.Router();

router.post('/add', addHospital);
router.get('/list', getAllHospitals);

export default router;

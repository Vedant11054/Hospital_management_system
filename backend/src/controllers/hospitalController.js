import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/google-sheets.js';

export const addHospital = async (req, res) => {
  try {
    const { name, address, phone, adminEmail } = req.body;

    if (!name || !address || !phone || !adminEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hospitalData = {
      id: uuidv4(),
      name,
      address,
      phone,
      adminEmail,
      createdAt: new Date().toISOString(),
    };

    await db.addHospital(hospitalData);

    res.status(201).json({
      message: 'Hospital added successfully',
      hospital: hospitalData,
    });
  } catch (error) {
    console.error('Add hospital error:', error);
    res.status(500).json({ error: error.message || 'Failed to add hospital' });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await db.getAllHospitals();
    res.json({
      success: true,
      hospitals,
    });
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch hospitals' });
  }
};

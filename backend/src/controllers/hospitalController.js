import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { db } from '../config/google-sheets.js';

export const addHospital = async (req, res) => {
  try {
    const { name, address, phone, adminEmail, adminPassword, adminName } = req.body;

    if (!name || !address || !phone || !adminEmail) {
      return res.status(400).json({ error: 'Missing required fields: name, address, phone, adminEmail' });
    }

    // Check if a user with this admin email already exists
    const existingUser = await db.findUserByEmail(adminEmail);
    if (existingUser) {
      return res.status(409).json({ error: `A user account already exists for ${adminEmail}. Use a different admin email.` });
    }

    const hospitalId = uuidv4();
    const hospitalData = {
      id: hospitalId,
      name,
      address,
      phone,
      adminEmail,
      status: 'active',
      plan: 'Basic',
      createdAt: new Date().toISOString(),
    };

    await db.addHospital(hospitalData);

    // Auto-create the hospital_admin user account
    const password = adminPassword || 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUserId = uuidv4();

    const adminUserData = {
      id: adminUserId,
      email: adminEmail,
      password: hashedPassword,
      name: adminName || `Admin - ${name}`,
      role: 'hospital_admin',
      createdAt: new Date().toISOString(),
    };

    await db.addUser(adminUserData);

    res.status(201).json({
      message: 'Hospital and admin account created successfully',
      hospital: hospitalData,
      adminCredentials: {
        email: adminEmail,
        password: password,
        note: 'Share these credentials with the hospital admin',
      },
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

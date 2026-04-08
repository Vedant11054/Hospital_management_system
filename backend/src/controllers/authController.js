import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/google-sheets.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    const userData = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: timestamp,
    };

    await db.addUser(userData);

    const token = jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const stats = await db.getStatistics();

    res.status(201).json({
      message: 'User created successfully',
      user: { id: userId, email, name, role },
      token,
      statistics: stats,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await db.findUserByEmail(email);

    if (!user || user.role !== role) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For hospital admins: look up their hospital by adminEmail to get hospitalId
    let hospitalId = null;
    if (user.role === 'hospital_admin') {
      const hospital = await db.findHospitalByAdminEmail(email);
      if (hospital) {
        hospitalId = hospital.id;
      }
    }

    // For doctors: look up their Doctors sheet record by email to get doctorId + hospitalId
    let doctorId = null;
    if (user.role === 'doctor') {
      const doctorRecord = await db.findDoctorByEmail(email);
      if (doctorRecord) {
        doctorId = doctorRecord.id;
        hospitalId = doctorRecord.hospitalId;
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const stats = await db.getStatistics();

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        ...(hospitalId ? { hospitalId } : {}),
        ...(doctorId ? { doctorId } : {}),
      },
      token,
      statistics: stats,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await db.getStatistics();
    res.json({
      success: true,
      statistics: stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch statistics' });
  }
};

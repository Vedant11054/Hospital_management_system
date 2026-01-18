import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getSheets, SPREADSHEET_ID, USERS_SHEET } from '../config/google-sheets.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const sheets = await getSheets();

    // Check if user already exists
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${USERS_SHEET}!A:F`,
      });

      const rows = response.data.values || [];
      const headerRow = rows[0];

      if (rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][1] === email) {
            return res.status(409).json({ error: 'User already exists' });
          }
        }
      }
    } catch (error) {
      console.log('First user being created');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    // Prepare user data
    const userData = [
      userId,
      email,
      hashedPassword,
      name,
      role,
      timestamp,
    ];

    // Check if sheet has headers
    let hasHeaders = false;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${USERS_SHEET}!A1:F1`,
      });
      hasHeaders = !!(response.data.values && response.data.values.length > 0);
    } catch (error) {
      hasHeaders = false;
    }

    // Add headers if needed
    if (!hasHeaders) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${USERS_SHEET}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['ID', 'Email', 'Password', 'Name', 'Role', 'CreatedAt']],
        },
      });
    }

    // Append user data
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USERS_SHEET}!A:F`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [userData],
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        name,
        role,
      },
      token,
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

    const sheets = await getSheets();

    // Get user from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USERS_SHEET}!A:F`,
    });

    const rows = response.data.values || [];
    let user = null;

    if (rows.length > 1) {
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][1] === email && rows[i][4] === role) {
          user = {
            id: rows[i][0],
            email: rows[i][1],
            hashedPassword: rows[i][2],
            name: rows[i][3],
            role: rows[i][4],
          };
          break;
        }
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
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

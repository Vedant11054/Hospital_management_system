import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let doc = null;
let usersSheet = null;

async function initializeSheet() {
  try {
    const credentialsPath = path.join(__dirname, '../../credentials.json');
    
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('credentials.json not found in backend folder');
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const newDoc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, auth);
    await newDoc.loadInfo();

    // Get or create Users sheet
    let sheet = newDoc.sheetsByTitle['Users'];
    
    if (!sheet) {
      sheet = await newDoc.addSheet({ title: 'Users' });
      await sheet.setHeaderRow(['ID', 'Email', 'Password', 'Name', 'Role', 'CreatedAt']);
    }

    console.log('✅ Google Sheets connected');
    return { doc: newDoc, usersSheet: sheet };
  } catch (error) {
    console.error('❌ Google Sheets error:', error.message);
    throw error;
  }
}

export const db = {
  async addUser(user) {
    try {
      const { usersSheet } = await initializeSheet();
      await usersSheet.addRows([{
        ID: user.id,
        Email: user.email,
        Password: user.password,
        Name: user.name,
        Role: user.role,
        CreatedAt: user.createdAt,
      }]);
      return user;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  async findUserByEmail(email) {
    try {
      const { usersSheet } = await initializeSheet();
      const rows = await usersSheet.getRows();
      const user = rows.find(row => row.get('Email') === email);
      
      if (user) {
        return {
          id: user.get('ID'),
          email: user.get('Email'),
          password: user.get('Password'),
          name: user.get('Name'),
          role: user.get('Role'),
          createdAt: user.get('CreatedAt'),
        };
      }
      return null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const { usersSheet } = await initializeSheet();
      const rows = await usersSheet.getRows();
      return rows.map(row => ({
        id: row.get('ID'),
        email: row.get('Email'),
        password: row.get('Password'),
        name: row.get('Name'),
        role: row.get('Role'),
        createdAt: row.get('CreatedAt'),
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }
};

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';
export const USERS_SHEET = 'Users';
export const HOSPITALS_SHEET = 'Hospitals';
export const DOCTORS_SHEET = 'Doctors';
export const PATIENTS_SHEET = 'Patients';

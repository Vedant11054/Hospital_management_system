import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  const credentialsPath = path.join(process.cwd(), 'credentials.json');
  
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('credentials.json not found. Please set up Google Sheets API credentials.');
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: SCOPES,
  });

  return auth;
}

export const getSheets = async () => {
  const auth = await getAuthClient();
  return google.sheets({ version: 'v4', auth });
};

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';
export const USERS_SHEET = 'Users';
export const HOSPITALS_SHEET = 'Hospitals';
export const DOCTORS_SHEET = 'Doctors';
export const PATIENTS_SHEET = 'Patients';

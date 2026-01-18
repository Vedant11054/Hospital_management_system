import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let doc = null;
let usersSheet = null;
let hospitalsSheet = null;
let doctorsSheet = null;
let appointmentsSheet = null;

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

    // Get or create Hospitals sheet
    let hospitalsSheetLocal = newDoc.sheetsByTitle['Hospitals'];
    
    if (!hospitalsSheetLocal) {
      hospitalsSheetLocal = await newDoc.addSheet({ title: 'Hospitals' });
      await hospitalsSheetLocal.setHeaderRow(['ID', 'Name', 'Address', 'Phone', 'AdminEmail', 'CreatedAt']);
    }

    // Get or create Doctors sheet
    let doctorsSheetLocal = newDoc.sheetsByTitle['Doctors'];
    
    if (!doctorsSheetLocal) {
      doctorsSheetLocal = await newDoc.addSheet({ title: 'Doctors' });
      await doctorsSheetLocal.setHeaderRow(['ID', 'HospitalID', 'Name', 'Specialty', 'Email', 'Phone', 'Qualification', 'CreatedAt']);
    }

    // Get or create Appointments sheet
    let appointmentsSheetLocal = newDoc.sheetsByTitle['Appointments'];
    
    if (!appointmentsSheetLocal) {
      appointmentsSheetLocal = await newDoc.addSheet({ title: 'Appointments' });
      await appointmentsSheetLocal.setHeaderRow(['ID', 'PatientID', 'DoctorID', 'HospitalID', 'Date', 'Time', 'Reason', 'Status', 'CreatedAt']);
    }

    console.log('✅ Google Sheets connected');
    return { doc: newDoc, usersSheet: sheet, hospitalsSheet: hospitalsSheetLocal, doctorsSheet: doctorsSheetLocal, appointmentsSheet: appointmentsSheetLocal };
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
  },

  async getTotalUsers() {
    try {
      const { usersSheet } = await initializeSheet();
      const rows = await usersSheet.getRows();
      return rows.length;
    } catch (error) {
      console.error('Error getting user count:', error);
      throw error;
    }
  },

  async addHospital(hospital) {
    try {
      const { hospitalsSheet } = await initializeSheet();
      await hospitalsSheet.addRows([{
        ID: hospital.id,
        Name: hospital.name,
        Address: hospital.address,
        Phone: hospital.phone,
        AdminEmail: hospital.adminEmail,
        CreatedAt: hospital.createdAt,
      }]);
      return hospital;
    } catch (error) {
      console.error('Error adding hospital:', error);
      throw error;
    }
  },

  async getTotalHospitals() {
    try {
      const { hospitalsSheet } = await initializeSheet();
      const rows = await hospitalsSheet.getRows();
      return rows.length;
    } catch (error) {
      console.error('Error getting hospital count:', error);
      throw error;
    }
  },

  async getStatistics() {
    try {
      const totalUsers = await this.getTotalUsers();
      const totalHospitals = await this.getTotalHospitals();
      return {
        totalUsers,
        totalHospitals,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  },

  async addDoctor(doctor) {
    try {
      const { doctorsSheet } = await initializeSheet();
      await doctorsSheet.addRows([{
        ID: doctor.id,
        HospitalID: doctor.hospitalId,
        Name: doctor.name,
        Specialty: doctor.specialty,
        Email: doctor.email,
        Phone: doctor.phone,
        Qualification: doctor.qualification,
        CreatedAt: doctor.createdAt,
      }]);
      return doctor;
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw error;
    }
  },

  async getDoctorsByHospital(hospitalId) {
    try {
      const { doctorsSheet } = await initializeSheet();
      const rows = await doctorsSheet.getRows();
      return rows
        .filter(row => row.get('HospitalID') === hospitalId)
        .map(row => ({
          id: row.get('ID'),
          hospitalId: row.get('HospitalID'),
          name: row.get('Name'),
          specialty: row.get('Specialty'),
          email: row.get('Email'),
          phone: row.get('Phone'),
          qualification: row.get('Qualification'),
          createdAt: row.get('CreatedAt'),
        }));
    } catch (error) {
      console.error('Error getting doctors:', error);
      throw error;
    }
  },

  async getAllDoctors() {
    try {
      const { doctorsSheet } = await initializeSheet();
      const rows = await doctorsSheet.getRows();
      return rows.map(row => ({
        id: row.get('ID'),
        hospitalId: row.get('HospitalID'),
        name: row.get('Name'),
        specialty: row.get('Specialty'),
        email: row.get('Email'),
        phone: row.get('Phone'),
        qualification: row.get('Qualification'),
        createdAt: row.get('CreatedAt'),
      }));
    } catch (error) {
      console.error('Error getting all doctors:', error);
      throw error;
    }
  },

  async addAppointment(appointment) {
    try {
      const { appointmentsSheet } = await initializeSheet();
      await appointmentsSheet.addRows([{
        ID: appointment.id,
        PatientID: appointment.patientId,
        DoctorID: appointment.doctorId,
        HospitalID: appointment.hospitalId,
        Date: appointment.date,
        Time: appointment.time,
        Reason: appointment.reason,
        Status: appointment.status,
        CreatedAt: appointment.createdAt,
      }]);
      return appointment;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  },

  async getAppointmentsByPatient(patientId) {
    try {
      const { appointmentsSheet } = await initializeSheet();
      const rows = await appointmentsSheet.getRows();
      return rows
        .filter(row => row.get('PatientID') === patientId)
        .map(row => ({
          id: row.get('ID'),
          patientId: row.get('PatientID'),
          doctorId: row.get('DoctorID'),
          hospitalId: row.get('HospitalID'),
          date: row.get('Date'),
          time: row.get('Time'),
          reason: row.get('Reason'),
          status: row.get('Status'),
          createdAt: row.get('CreatedAt'),
        }));
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    }
  },

  async getAppointmentsByDoctor(doctorId) {
    try {
      const { appointmentsSheet } = await initializeSheet();
      const rows = await appointmentsSheet.getRows();
      return rows
        .filter(row => row.get('DoctorID') === doctorId)
        .map(row => ({
          id: row.get('ID'),
          patientId: row.get('PatientID'),
          doctorId: row.get('DoctorID'),
          hospitalId: row.get('HospitalID'),
          date: row.get('Date'),
          time: row.get('Time'),
          reason: row.get('Reason'),
          status: row.get('Status'),
          createdAt: row.get('CreatedAt'),
        }));
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      throw error;
    }
  },

  async getAllHospitals() {
    try {
      const { hospitalsSheet } = await initializeSheet();
      const rows = await hospitalsSheet.getRows();
      return rows.map(row => ({
        id: row.get('ID'),
        name: row.get('Name'),
        address: row.get('Address'),
        phone: row.get('Phone'),
        adminEmail: row.get('AdminEmail'),
        createdAt: row.get('CreatedAt'),
      }));
    } catch (error) {
      console.error('Error getting hospitals:', error);
      throw error;
    }
  }
}

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';
export const USERS_SHEET = 'Users';
export const HOSPITALS_SHEET = 'Hospitals';
export const DOCTORS_SHEET = 'Doctors';
export const PATIENTS_SHEET = 'Patients';

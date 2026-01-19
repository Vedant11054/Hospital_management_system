import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initializeSheet() {
  const credentialsPath = path.join(__dirname, "../../credentials.json");

  if (!fs.existsSync(credentialsPath)) {
    throw new Error("credentials.json not found");
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, auth);
  await doc.loadInfo();

  // ================= USERS =================
  let usersSheet = doc.sheetsByTitle["Users"];
  if (!usersSheet) {
    usersSheet = await doc.addSheet({ title: "Users" });
    await usersSheet.setHeaderRow([
      "ID",
      "Email",
      "Password",
      "Name",
      "Role",
      "CreatedAt",
    ]);
  }

  // ================= HOSPITALS =================
  let hospitalsSheet = doc.sheetsByTitle["Hospitals"];
  if (!hospitalsSheet) {
    hospitalsSheet = await doc.addSheet({ title: "Hospitals" });
    await hospitalsSheet.setHeaderRow([
      "ID",
      "Name",
      "Address",
      "Phone",
      "AdminEmail",
      "Status",
      "Plan",
      "Users",
      "CreatedAt",
    ]);
  }

  // ================= DOCTORS =================
  let doctorsSheet = doc.sheetsByTitle["Doctors"];
  if (!doctorsSheet) {
    doctorsSheet = await doc.addSheet({ title: "Doctors" });
    await doctorsSheet.setHeaderRow([
      "ID",
      "HospitalID",
      "Name",
      "Specialty",
      "Email",
      "Phone",
      "Qualification",
      "CreatedAt",
    ]);
  }

  // ================= APPOINTMENTS =================
  let appointmentsSheet = doc.sheetsByTitle["Appointments"];
  if (!appointmentsSheet) {
    appointmentsSheet = await doc.addSheet({ title: "Appointments" });
    await appointmentsSheet.setHeaderRow([
      "ID",
      "PatientID",
      "DoctorID",
      "HospitalID",
      "Date",
      "Time",
      "Reason",
      "Status",
      "CreatedAt",
    ]);
  }

  return { usersSheet, hospitalsSheet, doctorsSheet, appointmentsSheet };
}

export const db = {
  // ================= USERS =================
  async addUser(user) {
    const { usersSheet } = await initializeSheet();
    await usersSheet.addRow({
      ID: user.id,
      Email: user.email,
      Password: user.password,
      Name: user.name,
      Role: user.role,
      CreatedAt: user.createdAt,
    });
    return user;
  },

  async findUserByEmail(email) {
    const { usersSheet } = await initializeSheet();
    const rows = await usersSheet.getRows();
    const user = rows.find(r => r.get("Email") === email);
    if (!user) return null;

    return {
      id: user.get("ID"),
      email: user.get("Email"),
      password: user.get("Password"),
      name: user.get("Name"),
      role: user.get("Role"),
      createdAt: user.get("CreatedAt"),
    };
  },

  async getTotalUsers() {
    const { usersSheet } = await initializeSheet();
    const rows = await usersSheet.getRows();
    return rows.length;
  },

  // ================= HOSPITALS =================
  async addHospital(hospital) {
    const { hospitalsSheet } = await initializeSheet();

    await hospitalsSheet.addRow({
      ID: hospital.id,
      Name: hospital.name,
      Address: hospital.address,
      Phone: hospital.phone,
      AdminEmail: hospital.adminEmail,
      Status: hospital.status || "pending",
      Plan: hospital.plan || "Basic",
      Users: hospital.users || 0,
      CreatedAt: hospital.createdAt,
    });

    return hospital;
  },

  async getAllHospitals() {
    const { hospitalsSheet } = await initializeSheet();
    const rows = await hospitalsSheet.getRows();

    return rows.map(row => ({
      id: row.get("ID"),
      name: row.get("Name"),
      status: row.get("Status"),
      users: Number(row.get("Users")) || 0,
      plan: row.get("Plan"),
    }));
  },

  async getTotalHospitals() {
    const hospitals = await this.getAllHospitals();
    return hospitals.length;
  },

  // ================= DOCTORS =================
  async addDoctor(doctor) {
    const { doctorsSheet } = await initializeSheet();
    await doctorsSheet.addRow({
      ID: doctor.id,
      HospitalID: doctor.hospitalId,
      Name: doctor.name,
      Specialty: doctor.specialty,
      Email: doctor.email,
      Phone: doctor.phone,
      Qualification: doctor.qualification,
      CreatedAt: doctor.createdAt,
    });
    return doctor;
  },

  async getDoctorsByHospital(hospitalId) {
    const { doctorsSheet } = await initializeSheet();
    const rows = await doctorsSheet.getRows();

    return rows
      .filter(r => r.get("HospitalID") === hospitalId)
      .map(r => ({
        id: r.get("ID"),
        hospitalId: r.get("HospitalID"),
        name: r.get("Name"),
        specialty: r.get("Specialty"),
        email: r.get("Email"),
        phone: r.get("Phone"),
        qualification: r.get("Qualification"),
        createdAt: r.get("CreatedAt"),
      }));
  },

  // ================= APPOINTMENTS =================
  async addAppointment(appointment) {
    const { appointmentsSheet } = await initializeSheet();
    await appointmentsSheet.addRow({
      ID: appointment.id,
      PatientID: appointment.patientId,
      DoctorID: appointment.doctorId,
      HospitalID: appointment.hospitalId,
      Date: appointment.date,
      Time: appointment.time,
      Reason: appointment.reason,
      Status: appointment.status,
      CreatedAt: appointment.createdAt,
    });
    return appointment;
  },

  async getAppointmentsByDoctor(doctorId) {
    const { appointmentsSheet } = await initializeSheet();
    const rows = await appointmentsSheet.getRows();

    return rows
      .filter(r => r.get("DoctorID") === doctorId)
      .map(r => ({
        id: r.get("ID"),
        hospitalId: r.get("HospitalID"),
        date: r.get("Date"),
        time: r.get("Time"),
        reason: r.get("Reason"),
        status: r.get("Status"),
      }));
  },

  // ================= STATISTICS (DASHBOARD) =================
  async getStatistics() {
    const hospitals = await this.getAllHospitals();
    const totalUsers = hospitals.reduce((sum, h) => sum + h.users, 0);

    return {
      totalHospitals: hospitals.length,
      totalUsers,
    };
  },
};

// OPTIONAL EXPORTS
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || "";
export const USERS_SHEET = "Users";
export const HOSPITALS_SHEET = "Hospitals";
export const DOCTORS_SHEET = "Doctors";
export const APPOINTMENTS_SHEET = "Appointments";

/**
 * Nagpur Reseed Script
 * - Clears all existing hospitals, doctors, and non-superadmin users
 * - Seeds 5 famous Nagpur hospitals with real doctors and patients
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logins = [];

// ─── Nagpur Data ───────────────────────────────────────────────
const NAGPUR_HOSPITALS = [
  {
    name: 'Alexis Multispeciality Hospital',
    address: 'Manish Nagar, Somalwada, Nagpur, Maharashtra 440015',
    phone: '0712-6645555',
    adminEmail: 'admin@alexishospital.nagpur',
    adminName: 'Rajesh Sharma',
    adminPassword: 'alexis@123',
    doctors: [
      { name: 'Dr. Prashant Kadu', specialty: 'Cardiology', qualification: 'MD, DM (Cardiology)', email: 'prashant.kadu@alexishospital.nagpur', phone: '9823001001' },
      { name: 'Dr. Sudhir Tiwari', specialty: 'Neurology', qualification: 'MD, DM (Neurology)', email: 'sudhir.tiwari@alexishospital.nagpur', phone: '9823001002' },
      { name: 'Dr. Manisha Gaikar', specialty: 'Gynecology', qualification: 'MBBS, MS (OBG)', email: 'manisha.gaikar@alexishospital.nagpur', phone: '9823001003' },
      { name: 'Dr. Arun Meshram', specialty: 'Orthopedics', qualification: 'MBBS, MS (Ortho)', email: 'arun.meshram@alexishospital.nagpur', phone: '9823001004' },
    ],
  },
  {
    name: 'Wockhardt Hospital Nagpur',
    address: 'North Ambazari Road, Shivaji Nagar, Nagpur, Maharashtra 440010',
    phone: '0712-6620000',
    adminEmail: 'admin@wockhardtnagpur.com',
    adminName: 'Anita Deshmukh',
    adminPassword: 'wockhardt@123',
    doctors: [
      { name: 'Dr. Sameer Arbat', specialty: 'Cardiology', qualification: 'MD, DM (Cardiology), FESC', email: 'sameer.arbat@wockhardtnagpur.com', phone: '9823002001' },
      { name: 'Dr. Vikram Chandak', specialty: 'Oncology', qualification: 'MD, DM (Medical Oncology)', email: 'vikram.chandak@wockhardtnagpur.com', phone: '9823002002' },
      { name: 'Dr. Nisha Rathod', specialty: 'Pediatrics', qualification: 'MBBS, MD (Pediatrics)', email: 'nisha.rathod@wockhardtnagpur.com', phone: '9823002003' },
      { name: 'Dr. Hemant Balpande', specialty: 'General Surgery', qualification: 'MBBS, MS (Surgery)', email: 'hemant.balpande@wockhardtnagpur.com', phone: '9823002004' },
    ],
  },
  {
    name: 'Care Hospital Nagpur',
    address: '7 Laxmi Nagar Square, Ring Road, Nagpur, Maharashtra 440022',
    phone: '0712-6691200',
    adminEmail: 'admin@carehospitalnagpur.in',
    adminName: 'Sanjay Joshi',
    adminPassword: 'care@123',
    doctors: [
      { name: 'Dr. Ravi Agarwal', specialty: 'Internal Medicine', qualification: 'MBBS, MD (Medicine)', email: 'ravi.agarwal@carehospitalnagpur.in', phone: '9823003001' },
      { name: 'Dr. Pramod Jiwtode', specialty: 'Nephrology', qualification: 'MD, DM (Nephrology)', email: 'pramod.jiwtode@carehospitalnagpur.in', phone: '9823003002' },
      { name: 'Dr. Kalyani Singh', specialty: 'Dermatology', qualification: 'MBBS, MD (Dermatology)', email: 'kalyani.singh@carehospitalnagpur.in', phone: '9823003003' },
      { name: 'Dr. Ashish Dabhade', specialty: 'Radiology', qualification: 'MBBS, MD (Radiology)', email: 'ashish.dabhade@carehospitalnagpur.in', phone: '9823003004' },
    ],
  },
  {
    name: 'Orange City Hospital & Research Institute',
    address: 'Wadi, Kalmeshwar Road, Nagpur, Maharashtra 440023',
    phone: '0712-2721234',
    adminEmail: 'admin@orangecityhospital.com',
    adminName: 'Deepak Thakur',
    adminPassword: 'orange@123',
    doctors: [
      { name: 'Dr. Suresh Ughade', specialty: 'Ophthalmology', qualification: 'MBBS, MS (Ophthalmology)', email: 'suresh.ughade@orangecityhospital.com', phone: '9823004001' },
      { name: 'Dr. Rashmi Deshpande', specialty: 'Psychiatry', qualification: 'MBBS, MD (Psychiatry)', email: 'rashmi.deshpande@orangecityhospital.com', phone: '9823004002' },
      { name: 'Dr. Nitin Kochar', specialty: 'ENT', qualification: 'MBBS, MS (ENT)', email: 'nitin.kochar@orangecityhospital.com', phone: '9823004003' },
      { name: 'Dr. Preeti Bawankar', specialty: 'Gynecology', qualification: 'MBBS, MD, DGO', email: 'preeti.bawankar@orangecityhospital.com', phone: '9823004004' },
    ],
  },
  {
    name: 'Getwell Hospital & Research Institute',
    address: 'Dhantoli, Nagpur, Maharashtra 440012',
    phone: '0712-2420001',
    adminEmail: 'admin@getwellhospital.nagpur',
    adminName: 'Pooja Nagdeve',
    adminPassword: 'getwell@123',
    doctors: [
      { name: 'Dr. Ajay Bhatt', specialty: 'Anesthesiology', qualification: 'MBBS, MD (Anaesthesia)', email: 'ajay.bhatt@getwellhospital.nagpur', phone: '9823005001' },
      { name: 'Dr. Seema Fulzele', specialty: 'Orthopedics', qualification: 'MBBS, MS (Orthopedics)', email: 'seema.fulzele@getwellhospital.nagpur', phone: '9823005002' },
      { name: 'Dr. Mohan Hedau', specialty: 'Cardiology', qualification: 'MBBS, MD, DM (Cardiology)', email: 'mohan.hedau@getwellhospital.nagpur', phone: '9823005003' },
      { name: 'Dr. Ritu Pathak', specialty: 'Pediatrics', qualification: 'MBBS, DCH, MD (Pediatrics)', email: 'ritu.pathak@getwellhospital.nagpur', phone: '9823005004' },
    ],
  },
];

const NAGPUR_PATIENTS = [
  { name: 'Rahul Deshmukh', email: 'rahul.deshmukh@gmail.com' },
  { name: 'Priya Wankhede', email: 'priya.wankhede@gmail.com' },
  { name: 'Amit Kapse', email: 'amit.kapse@gmail.com' },
  { name: 'Sneha Fulkar', email: 'sneha.fulkar@gmail.com' },
  { name: 'Vijay Nagrale', email: 'vijay.nagrale@gmail.com' },
  { name: 'Anita Borkar', email: 'anita.borkar@gmail.com' },
  { name: 'Suresh Gawande', email: 'suresh.gawande@gmail.com' },
  { name: 'Meena Bopche', email: 'meena.bopche@gmail.com' },
];

// ─── Google Sheets Access ──────────────────────────────────────
async function getSheets() {
  const credentialsPath = path.join(__dirname, 'credentials.json');
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, auth);
  await doc.loadInfo();

  const sheets = {
    users: doc.sheetsByTitle['Users'],
    hospitals: doc.sheetsByTitle['Hospitals'],
    doctors: doc.sheetsByTitle['Doctors'],
    appointments: doc.sheetsByTitle['Appointments'],
  };

  // Verify all sheets exist
  for (const [key, sheet] of Object.entries(sheets)) {
    if (!sheet) throw new Error(`Sheet "${key}" not found. Run the app once to create sheets.`);
  }
  return sheets;
}

// ─── Clear non-superadmin data ─────────────────────────────────
async function clearData(sheets) {
  console.log('\n🗑️  Clearing existing data...');

  // Clear all hospitals
  const hospitalRows = await sheets.hospitals.getRows();
  console.log(`   Removing ${hospitalRows.length} hospitals...`);
  for (const row of hospitalRows) await row.delete();

  // Clear all doctors
  const doctorRows = await sheets.doctors.getRows();
  console.log(`   Removing ${doctorRows.length} doctors...`);
  for (const row of doctorRows) await row.delete();

  // Clear all appointments
  const aptRows = await sheets.appointments.getRows();
  console.log(`   Removing ${aptRows.length} appointments...`);
  for (const row of aptRows) await row.delete();

  // Clear users except super_admin
  const userRows = await sheets.users.getRows();
  let removedUsers = 0;
  for (const row of userRows) {
    if (row.get('Role') !== 'super_admin') {
      await row.delete();
      removedUsers++;
    }
  }
  console.log(`   Removed ${removedUsers} non-super-admin users (kept super_admin accounts).`);
  console.log('✅ Data cleared.\n');
}

// ─── Direct sheet write helpers ────────────────────────────────
async function addHospital(sheet, data) {
  return sheet.addRow({
    ID: data.id,
    Name: data.name,
    Address: data.address,
    Phone: data.phone,
    AdminEmail: data.adminEmail,
    Status: 'active',
    Plan: 'Pro',
    Users: 0,
    CreatedAt: new Date().toISOString(),
  });
}

async function addDoctor(sheet, data) {
  return sheet.addRow({
    ID: data.id,
    HospitalID: data.hospitalId,
    Name: data.name,
    Specialty: data.specialty,
    Email: data.email,
    Phone: data.phone,
    Qualification: data.qualification,
    CreatedAt: new Date().toISOString(),
  });
}

async function addUser(sheet, data) {
  return sheet.addRow({
    ID: data.id,
    Email: data.email,
    Password: data.password,
    Name: data.name,
    Role: data.role,
    CreatedAt: new Date().toISOString(),
  });
}

// ─── Main Seed ──────────────────────────────────────────────────
async function seed() {
  console.log('🏥  Nagpur Hospital Reseed Script');
  console.log('==================================');

  const sheets = await getSheets();
  await clearData(sheets);

  console.log('🌱  Seeding Nagpur hospitals and staff...\n');

  for (const hospital of NAGPUR_HOSPITALS) {
    const hospitalId = uuidv4();
    console.log(`   🏥  ${hospital.name}`);

    // Add hospital
    await addHospital(sheets.hospitals, { id: hospitalId, ...hospital });

    // Add hospital admin user
    const adminHash = await bcrypt.hash(hospital.adminPassword, 10);
    const adminId = uuidv4();
    await addUser(sheets.users, {
      id: adminId,
      email: hospital.adminEmail,
      password: adminHash,
      name: hospital.adminName,
      role: 'hospital_admin',
    });
    logins.push({ role: 'hospital_admin', name: hospital.adminName, hospital: hospital.name, email: hospital.adminEmail, password: hospital.adminPassword });
    console.log(`      ✓ Admin: ${hospital.adminName} (${hospital.adminEmail})`);

    // Add doctors
    for (const doc of hospital.doctors) {
      const docId = uuidv4();
      await addDoctor(sheets.doctors, { id: docId, hospitalId, ...doc });

      const docHash = await bcrypt.hash('doctor@123', 10);
      const docUserId = uuidv4();
      await addUser(sheets.users, {
        id: docUserId,
        email: doc.email,
        password: docHash,
        name: doc.name,
        role: 'doctor',
      });
      logins.push({ role: 'doctor', name: doc.name, hospital: hospital.name, email: doc.email, password: 'doctor@123' });
      console.log(`      ✓ Doctor: ${doc.name} — ${doc.specialty}`);
    }
  }

  // Add patients
  console.log('\n   👤  Adding Nagpur patients...');
  for (const patient of NAGPUR_PATIENTS) {
    const hash = await bcrypt.hash('patient@123', 10);
    await addUser(sheets.users, {
      id: uuidv4(),
      email: patient.email,
      password: hash,
      name: patient.name,
      role: 'patient',
    });
    logins.push({ role: 'patient', name: patient.name, hospital: '', email: patient.email, password: 'patient@123' });
    console.log(`      ✓ Patient: ${patient.name}`);
  }

  // Write CSV
  console.log('\n📄  Writing logins.csv...');
  const csvHeader = 'Role,Name,Hospital,Email,Password\n';
  const csvRows = logins.map(l => `${l.role},${l.name},${l.hospital},${l.email},${l.password}`).join('\n');
  const csvPath = path.join(__dirname, '..', 'logins.csv');
  fs.writeFileSync(csvPath, csvHeader + csvRows);

  console.log('\n✅  Seeding complete!');
  console.log(`   🏥  ${NAGPUR_HOSPITALS.length} hospitals`);
  console.log(`   👨‍⚕️  ${NAGPUR_HOSPITALS.reduce((s, h) => s + h.doctors.length, 0)} doctors`);
  console.log(`   👤  ${NAGPUR_PATIENTS.length} patients`);
  console.log(`   📄  Credentials saved to: ${csvPath}`);
  console.log('\n   Default passwords:');
  console.log('   • Doctors:  doctor@123');
  console.log('   • Patients: patient@123');
  console.log('   • Hospital admins: see individual passwords in logins.csv');
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});

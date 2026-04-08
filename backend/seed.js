import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const API_BASE = 'http://localhost:3001/api';

const logins = [];

async function post(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function seed() {
  const nonce = Math.floor(Math.random() * 100000);
  try {
    console.log('Creating Hospital...');
    const h1Data = {
      name: `City General Hospital ${nonce}`,
      address: '123 Main St, New York',
      phone: `555-${nonce}`,
      adminEmail: `admin${nonce}@citygeneral.com`
    };
    const h1Res = await post('/hospitals/add', h1Data);
    const hospitalId = h1Res.hospital.id;

    console.log('Creating Hospital Admin...');
    await post('/auth/signup', {
      email: h1Data.adminEmail,
      password: 'password123',
      name: `John Doe Admin ${nonce}`,
      role: 'hospital_admin'
    });
    logins.push({ role: 'hospital_admin', email: h1Data.adminEmail, password: 'password123' });

    console.log('Creating Doctors...');
    const d1Data = {
      hospitalId,
      name: `Dr. Alice Smith ${nonce}`,
      specialty: 'Cardiology',
      email: `alice${nonce}@citygeneral.com`,
      phone: `555-D1${nonce}`,
      qualification: 'MD, PhD'
    };
    await post('/doctors/add', d1Data);
    await post('/auth/signup', {
      email: d1Data.email,
      password: 'password123',
      name: d1Data.name,
      role: 'doctor'
    });
    logins.push({ role: 'doctor', email: d1Data.email, password: 'password123' });
    
    const d2Data = {
      hospitalId,
      name: `Dr. Bob Jones ${nonce}`,
      specialty: 'Neurology',
      email: `bob${nonce}@citygeneral.com`,
      phone: `555-D2${nonce}`,
      qualification: 'MD'
    };
    await post('/doctors/add', d2Data);
    await post('/auth/signup', {
      email: d2Data.email,
      password: 'password123',
      name: d2Data.name,
      role: 'doctor'
    });
    logins.push({ role: 'doctor', email: d2Data.email, password: 'password123' });

    console.log('Creating Patients...');
    const p1Data = { email: `patient.mary${nonce}@example.com`, password: 'password123', name: `Mary Patient ${nonce}`, role: 'patient' };
    await post('/auth/signup', p1Data);
    logins.push({ role: 'patient', email: p1Data.email, password: p1Data.password });

    const p2Data = { email: `patient.james${nonce}@example.com`, password: 'password123', name: `James Patient ${nonce}`, role: 'patient' };
    await post('/auth/signup', p2Data);
    logins.push({ role: 'patient', email: p2Data.email, password: p2Data.password });

    console.log('Writing CSV...');
    const csvHeader = 'Role,Email,Password,Name\n';
    const csvContent = logins.map(l => `${l.role},${l.email},${l.password}`).join('\n');
    
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const csvPath = path.join(__dirname, '..', 'logins.csv');
    fs.writeFileSync(csvPath, csvHeader + csvContent);
    console.log('Done! Wrote to ' + csvPath);

  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

seed();

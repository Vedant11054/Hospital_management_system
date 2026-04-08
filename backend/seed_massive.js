import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const API_BASE = 'http://localhost:3001/api';

const logins = [];

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function post(url, data) {
  // Rate limit protection: sleep 1.5 seconds between requests
  await sleep(1500);

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

const shifts = [
  { name: 'Night Shift', hours: '00:00 - 08:00' },
  { name: 'Day Shift', hours: '08:00 - 16:00' },
  { name: 'Evening Shift', hours: '16:00 - 00:00' }
];

async function seedMassive() {
  const nonce = Math.floor(Math.random() * 100000);
  console.log('Starting massive seed with rate limiting...');

  try {
    // 8 hospitals, since 2 were already created/partially created
    for (let i = 1; i <= 8; i++) {
      console.log(`\n--- Creating Hospital ${i} ---`);
      
      const hData = {
        name: `City Wide Care ${i} ID${nonce}`,
        address: `${i}00 Health Ave, Region ${i}`,
        phone: `800-555-${2000 + i}`,
        adminEmail: `admin.city${i}_${nonce}@citywide.com`
      };
      
      const hRes = await post('/hospitals/add', hData);
      const hospitalId = hRes.hospital.id;

      // Hospital Admin Login
      await post('/auth/signup', {
        email: hData.adminEmail,
        password: 'password123',
        name: `Admin City Wide ${i}`,
        role: 'hospital_admin'
      });
      logins.push({ role: 'hospital_admin', email: hData.adminEmail, password: 'password123' });

      // Add 3 Doctors with 8-hour shifts
      for (let j = 0; j < 3; j++) {
        const shift = shifts[j];
        
        const dData = {
          hospitalId,
          name: `Dr. Healer ${i}-${j + 1} ${nonce}`,
          specialty: `General Medicine (${shift.name}: ${shift.hours})`,
          email: `dr.city${i}_s${j}_${nonce}@citywide.com`,
          phone: `800-HEAL-${2000 + i}${j}`,
          qualification: `MD - Shift: ${shift.hours}`
        };

        await post('/doctors/add', dData);
        await post('/auth/signup', {
          email: dData.email,
          password: 'password123',
          name: dData.name,
          role: 'doctor'
        });
        
        logins.push({ role: 'doctor', email: dData.email, password: 'password123', name: dData.name, shift: shift.hours });
        console.log(`  Added Doctor ${j + 1} for ${shift.name}`);
      }
    }

    console.log('\nWriting CSV...');
    const csvHeader = 'Role,Email,Password,Name,AdditionalInfo\n';
    const csvContent = logins.map(l => `${l.role},${l.email},${l.password},${l.name || ''},${l.shift || ''}`).join('\n');
    
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const csvPath = path.join(__dirname, '..', 'logins_remaining.csv');
    fs.writeFileSync(csvPath, csvHeader + csvContent);
    console.log('Done! Wrote to ' + csvPath);

  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

seedMassive();

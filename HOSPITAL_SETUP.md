# Hospital Management - Adding Hospitals

## Current Status

Hospital functionality is partially set up in the backend:
- ✅ Google Sheets "Hospitals" sheet created automatically
- ✅ `db.addHospital()` function available
- ✅ `db.getTotalHospitals()` function available
- ❌ API endpoints for hospital management not yet created

## How to Add Hospitals

### Option 1: Directly in Google Sheets (Quick Test)

1. Open your Google Spreadsheet
2. Navigate to the "Hospitals" sheet
3. Add rows with data:
   - ID: `hospital-1`
   - Name: `City General Hospital`
   - Address: `123 Main Street, NYC`
   - Phone: `+1-555-0100`
   - AdminEmail: `admin@cityhospital.com`
   - CreatedAt: `2026-01-18T10:00:00Z`

4. Login to dashboard
5. Statistics will automatically show `1` hospital count

### Option 2: Create API Endpoint (Recommended)

Create a new hospitals controller and routes.

**File: `backend/src/controllers/hospitalController.js`**

```javascript
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/google-sheets.js';

export const addHospital = async (req, res) => {
  try {
    const { name, address, phone, adminEmail } = req.body;

    // Validate input
    if (!name || !address || !phone || !adminEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create hospital object
    const hospitalData = {
      id: uuidv4(),
      name,
      address,
      phone,
      adminEmail,
      createdAt: new Date().toISOString(),
    };

    // Add to database
    await db.addHospital(hospitalData);

    res.status(201).json({
      message: 'Hospital added successfully',
      hospital: hospitalData,
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
```

**File: `backend/src/routes/hospitalRoutes.js`**

```javascript
import express from 'express';
import { addHospital, getAllHospitals } from '../controllers/hospitalController.js';

const router = express.Router();

router.post('/add', addHospital);
router.get('/list', getAllHospitals);

export default router;
```

**Update: `backend/src/server.js`**

Add to imports:
```javascript
import hospitalRoutes from './routes/hospitalRoutes.js';
```

Add to routes:
```javascript
app.use('/api/hospitals', hospitalRoutes);
```

**Update: `backend/src/config/google-sheets.js`**

Add to db object:
```javascript
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
```

### Usage Example (cURL)

Add a hospital:
```bash
curl -X POST http://localhost:3001/api/hospitals/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "City General Hospital",
    "address": "123 Main Street, NYC",
    "phone": "+1-555-0100",
    "adminEmail": "admin@cityhospital.com"
  }'
```

Get all hospitals:
```bash
curl http://localhost:3001/api/hospitals/list
```

## Next Steps

1. **Create Hospital Management UI** in frontend:
   - List hospitals
   - Add new hospital
   - Edit hospital details
   - Delete hospital

2. **Link Hospitals to Hospital Admins**:
   - Add `hospitalId` field to User when role is "hospital_admin"
   - Scope hospital admin access to their hospital

3. **Add Doctors and Patients to Hospitals**:
   - Link doctors to specific hospitals
   - Link patients to hospital's doctors
   - Create appointment system between doctors and patients

4. **Implement Complete Hospital Management**:
   - Department management
   - Staff management
   - Equipment tracking
   - Inventory management

## Database Schema Ready

The foundations are set:
- ✅ Users sheet with role-based access
- ✅ Hospitals sheet for hospital records
- ✅ Ready for: Doctors sheet, Patients sheet, Appointments sheet
- ✅ Statistics aggregation works automatically

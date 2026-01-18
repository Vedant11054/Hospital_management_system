# Quick Start Guide

## Initial Setup (5 minutes)

### 1. Frontend Setup
```bash
# Install frontend dependencies (if not already done)
npm install

# Start frontend dev server
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 2. Backend Setup (First time only)

#### Step 1: Get Google Sheets Credentials
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create a Service Account
5. Generate JSON key and save as `backend/credentials.json`

#### Step 2: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Note the Spreadsheet ID from the URL
4. Share the sheet with your service account email

#### Step 3: Configure Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your values
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
FRONTEND_URL=http://localhost:5173
GOOGLE_SHEETS_ID=your_sheet_id_here  # From step 2
JWT_SECRET=generate-a-random-string-here
NODE_ENV=development
```

#### Step 4: Start Backend
```bash
npm run dev
```
Backend will be available at `http://localhost:5000`

## Testing Signup

1. Go to `http://localhost:5173/signup`
2. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Role: Patient
3. Click Sign Up
4. You should be redirected to the patient dashboard

## Testing Login

1. Go to `http://localhost:5173/login`
2. Enter the credentials from signup
3. Click Sign In
4. You should be redirected to the dashboard

## Troubleshooting

### Backend won't start
- Make sure `credentials.json` is in the backend folder
- Check that `GOOGLE_SHEETS_ID` is set in `.env`
- Run `npm install` in backend folder

### Signup returns error
- Check browser console for error messages
- Make sure backend is running on port 5000
- Verify email isn't already registered

### Can't connect to backend
- Check backend is running: `http://localhost:5000/api/health`
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS settings

## Common Commands

**Frontend:**
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
npm run test       # Run tests
```

**Backend:**
```bash
npm run dev        # Start with auto-reload
npm start          # Start production
```

## Next Steps

1. ✅ Signup/Login working
2. 📝 Add more API endpoints for doctors, patients, hospitals
3. 🔐 Add permission checks for different roles
4. 📊 Add more Google Sheets for different data
5. 🎨 Customize dashboards for each role

## File Locations

- Frontend signup: `src/pages/Signup.tsx`
- Frontend login: `src/pages/Login.tsx`
- Backend auth: `backend/src/controllers/authController.js`
- Backend routes: `backend/src/routes/authRoutes.js`
- API client: `src/lib/api.ts`

## Important Notes

- Never commit `credentials.json` to version control
- Never commit `.env` files to version control
- Change `JWT_SECRET` to something secure
- Use HTTPS in production
- Add more security measures before going to production

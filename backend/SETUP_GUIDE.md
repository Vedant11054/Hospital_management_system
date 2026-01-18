# Hospital Management System - Backend Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- Google Account with Google Sheets API enabled
- Google Cloud Project

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Google Sheets API

#### Create a Google Cloud Project:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

#### Create Service Account:
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the account details
4. Click "Create and Continue"
5. Skip optional steps and click "Done"

#### Generate JSON Key:
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the file and save it as `credentials.json` in the backend folder

#### Create Google Sheet:
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the Spreadsheet ID from the URL (between `/d/` and `/edit`)
4. Add it to your `.env` file as `GOOGLE_SHEETS_ID`

### 3. Configure Environment Variables

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Update the `.env` file with your values:
```
PORT=5000
FRONTEND_URL=http://localhost:5173
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 4. Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "patient" // or "doctor", "hospital_admin", "super_admin"
}

Response:
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "patient"
  },
  "token": "jwt_token"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "patient"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "patient"
  },
  "token": "jwt_token"
}
```

### Verify Token
```
POST /api/auth/verify
Authorization: Bearer jwt_token

Response:
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

## Troubleshooting

### "credentials.json not found"
- Make sure you've downloaded the Google Service Account JSON key
- Place it in the backend folder as `credentials.json`

### "GOOGLE_SHEETS_ID not set"
- Get your spreadsheet ID from the Google Sheets URL
- Add it to the `.env` file as `GOOGLE_SHEETS_ID`

### CORS errors
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that the frontend is running on the correct port

## Database Schema (Google Sheets)

The system creates sheets automatically. The main sheets are:

### Users Sheet
- ID: Unique user identifier
- Email: User email
- Password: Hashed password
- Name: User full name
- Role: User role (patient, doctor, etc.)
- CreatedAt: Account creation timestamp

## Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Never commit `.env` or `credentials.json` to version control
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Keep Google Sheets credentials secure

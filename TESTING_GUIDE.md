# Testing Guide - Signup & Login Functionality

## Prerequisites
- Both frontend and backend running
- Google Sheets API configured
- Backend `.env` file configured with GOOGLE_SHEETS_ID

## Step-by-Step Testing

### 1. Start Both Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Should output: `VITE v... ready in ... ms`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Should output: `Server running on http://localhost:5000`

### 2. Test Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status": "Server is running"}
```

### 3. Test Signup

**Option A: Using Browser UI**

1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
   - Role: Select `Patient`
3. Click "Sign Up"
4. Expected: Redirect to Patient Dashboard

**Option B: Using cURL**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@123",
    "name": "John Doe",
    "role": "patient"
  }'
```

Expected response:
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "patient"
  },
  "token": "jwt-token-here"
}
```

### 4. Test Login

**Option A: Using Browser UI**

1. Navigate to `http://localhost:5173/login`
2. Select Role: `Patient`
3. Enter Email: `john@example.com`
4. Enter Password: `Test@123`
5. Click "Sign In"
6. Expected: Redirect to Patient Dashboard

**Option B: Using cURL**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@123",
    "role": "patient"
  }'
```

### 5. Test Token Verification

```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

## Error Testing

### Test 1: Duplicate Email
Try signing up with the same email twice.

Expected error:
```json
{"error": "User already exists"}
```

### Test 2: Short Password
Try signing up with a password less than 6 characters.

Expected error:
```json
{"error": "Password must be at least 6 characters"}
```

### Test 3: Wrong Credentials
Try logging in with wrong password.

Expected error:
```json
{"error": "Invalid credentials"}
```

### Test 4: Missing Fields
Try signing up without filling all fields.

Expected error:
```json
{"error": "Missing required fields"}
```

## Chrome DevTools Testing

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Go through signup process
4. Check requests:
   - POST /api/auth/signup
   - Check response status (201 for success)
   - Check response payload for token
5. Go to Application tab
6. Check localStorage:
   - Look for `token` key
   - Look for `user` key

## Common Issues

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/signup' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Verify `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
- Restart backend server

### Issue: 404 on /api/auth/signup
```
POST http://localhost:5000/api/auth/signup 404 (Not Found)
```

**Solution:**
- Check backend is running: `http://localhost:5000/api/health`
- Check server.js is importing routes correctly

### Issue: Google Sheets Error
```
credentials.json not found
```

**Solution:**
- Download Google Service Account JSON key
- Save as `backend/credentials.json`
- Make sure path is correct

### Issue: "Cannot find credentials.json"
```
Error: credentials.json not found. Please set up Google Sheets API credentials.
```

**Solution:**
1. Get your Google Service Account JSON key
2. Place in `backend/` folder
3. Name it `credentials.json` exactly
4. Restart backend

## Database Verification

After signup, check Google Sheets:
1. Open your Google Sheet
2. Should have a new "Users" sheet
3. Check for your user data:
   - Column A: User ID
   - Column B: Email
   - Column C: Hashed Password
   - Column D: Name
   - Column E: Role
   - Column F: Created timestamp

## Performance Testing

### Test Signup Speed
1. Open Network tab in DevTools
2. Click Sign Up
3. Check request time
4. Expected: < 2 seconds

### Test Multiple Signups
1. Sign up 5 different users
2. Check all appear in Google Sheets
3. Verify no data corruption
4. Check performance remains good

## Role-Based Testing

Test signup with different roles:
- Patient
- Doctor
- Hospital Admin
- Super Admin

Each should:
- Save correctly to database
- Redirect to correct dashboard
- Display correct role in localStorage

## Security Testing

### Test 1: Password Hashing
1. Signup with user
2. Check Google Sheets
3. Password should be hashed (not readable)

### Test 2: Token Expiration
```bash
# Get a token
# Wait 7 days (or modify JWT_SECRET to test)
# Try to use token
```

### Test 3: Invalid Token
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer invalid-token"
```

Expected error:
```json
{"error": "Invalid token"}
```

## Automated Testing

To create automated tests (future):
- Unit tests for auth controller
- Integration tests for API endpoints
- End-to-end tests with Cypress/Playwright
- Load testing with multiple concurrent users

## Success Criteria ✅

All tests pass when:
- ✅ Signup creates user in Google Sheets
- ✅ Password is hashed
- ✅ JWT token is generated
- ✅ Login with correct credentials works
- ✅ Login with wrong credentials fails
- ✅ Token verification works
- ✅ Duplicate emails are rejected
- ✅ User redirected to correct dashboard
- ✅ localStorage contains token and user
- ✅ No console errors

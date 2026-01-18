# Quick Testing Guide - Statistics Functionality

## Prerequisites
- ✅ Backend running on `http://localhost:3001`
- ✅ Frontend running on `http://localhost:8080`
- ✅ Google Sheets connected and configured

## Step-by-Step Testing

### Test 1: Sign Up and View Statistics

1. Open browser → `http://localhost:8080/signup`
2. Fill in the form:
   - Name: "John Doe"
   - Email: "john123@example.com" (use unique email)
   - Password: "password123"
   - Confirm Password: "password123"
   - Role: Select "Patient"
3. Click "Sign Up"
4. **Expected Result**: 
   - ✅ Redirect to Patient Dashboard
   - ✅ Statistics card shows at top with "Total Users" and "Total Hospitals"
   - ✅ Stats should be: 1 user created (or more if testing with existing data)

### Test 2: Log Out and Log In

1. From dashboard, click user menu → "Logout"
2. Go to `http://localhost:8080/login`
3. Enter credentials:
   - Email: "john123@example.com" (from Test 1)
   - Password: "password123"
   - Role: "Patient"
4. Click "Login"
5. **Expected Result**:
   - ✅ Redirect to Patient Dashboard
   - ✅ Statistics card displays same values as before
   - ✅ User name shows correctly as "John Doe"

### Test 3: Different Role Statistics

1. Log out from current session
2. Create new account with different role:
   - Go to `/signup`
   - Use new email (e.g., "doctor@example.com")
   - Select role: "Doctor"
   - Complete signup
3. **Expected Result**:
   - ✅ Redirect to Doctor Dashboard
   - ✅ Statistics show (total users should now be 2 if this is second signup)
   - ✅ Doctor dashboard displays stats properly

### Test 4: All Dashboard Views

Switch between roles and verify each shows statistics:

```
Patient Dashboard     → /patient       → Stats display ✅
Doctor Dashboard      → /doctor        → Stats display ✅
Hospital Admin        → /hospital-admin → Stats display ✅
Super Admin           → /super-admin   → Stats display ✅
```

### Test 5: Verify Google Sheets Data

1. Go to your Google Sheets spreadsheet
2. Check "Users" sheet:
   - Should have headers: ID, Email, Password, Name, Role, CreatedAt
   - Should have rows for each signup
3. Check "Hospitals" sheet:
   - Should have headers: ID, Name, Address, Phone, AdminEmail, CreatedAt
   - (Empty unless you add hospitals)

### Test 6: Manual Stats API Call

Using curl or Postman:

```bash
# Get the token from browser localStorage after login
# Replace <TOKEN> with actual JWT token

curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/auth/stats
```

**Expected Response**:
```json
{
  "success": true,
  "statistics": {
    "totalUsers": 2,
    "totalHospitals": 0
  }
}
```

## Troubleshooting

### Statistics show 0 for everything
- Check Google Sheets connection (backend should log "✅ Google Sheets connected")
- Verify GOOGLE_SHEETS_ID in `.env` is correct
- Check that Users sheet exists and has headers

### Statistics don't update after signup
- Clear browser localStorage: F12 → Application → Storage → LocalStorage
- Sign up again
- Refresh dashboard

### Backend shows error connecting to Google Sheets
- Verify `credentials.json` exists in `backend/` folder
- Check that file has valid Google service account credentials
- Verify `.env` has correct GOOGLE_SHEETS_ID

### Statistics not showing on dashboard
- Check browser console (F12) for JavaScript errors
- Verify localStorage has "statistics" key: `localStorage.getItem('statistics')`
- Verify `useStatistics` hook is properly imported in dashboard component

## Expected Results Summary

| Action | Component | Result |
|--------|-----------|--------|
| Signup | Statistics Card | Shows updated counts |
| Login | Statistics Card | Shows counts from Google Sheets |
| Role Switch | Each Dashboard | All show same statistics |
| API Call | /api/auth/stats | Returns JSON with counts |
| Google Sheets | Users + Hospitals | Correct row counts match displayed stats |

## Performance Notes

- Statistics are fetched during login/signup
- Stored in localStorage for instant display
- Can manually refresh via `fetchStatistics()` function
- API endpoint available for real-time stats without page reload

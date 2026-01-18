# Complete Testing Checklist

## Pre-Test Setup
- [ ] Backend running on http://localhost:3001
- [ ] Frontend ready on http://localhost:8080
- [ ] Google Sheets connected and accessible
- [ ] credentials.json in backend folder
- [ ] .env file configured

## End-to-End Workflow Test

### Phase 1: User Registration
- [ ] Go to http://localhost:8080/signup
- [ ] Create account:
  - Email: `superadmin@test.com`
  - Password: `password123`
  - Name: `Super Admin User`
  - Role: **Super Admin**
- [ ] Verify redirect to Super Admin Dashboard
- [ ] Check statistics display (Total Users should be 1)

### Phase 2: Add Hospital (Super Admin)
- [ ] On Super Admin Dashboard, click "Add Hospital" button
- [ ] Fill hospital form:
  - Name: `City General Hospital`
  - Address: `123 Main Street, Downtown`
  - Phone: `+1-555-0100`
  - Admin Email: `admin@cityhospital.com`
- [ ] Click "Add Hospital"
- [ ] See success message ✅
- [ ] Verify Google Sheets "Hospitals" sheet has new row
- [ ] Statistics should update to show 1 hospital

### Phase 3: Create Hospital Admin Account
- [ ] Logout from Super Admin
- [ ] Go to http://localhost:8080/signup
- [ ] Create new account:
  - Email: `hospitaladmin@test.com`
  - Password: `password123`
  - Name: `Hospital Admin`
  - Role: **Hospital Admin**
- [ ] Verify redirect to Hospital Admin Dashboard
- [ ] Check statistics display

### Phase 4: Add Doctor (Hospital Admin)
- [ ] On Hospital Admin Dashboard, click "Add Doctor" button
- [ ] Fill doctor form:
  - Name: `Dr. Sarah Wilson`
  - Specialty: `Cardiology` (select from dropdown)
  - Email: `sarah@hospital.com`
  - Phone: `+1-555-0101`
  - Qualification: `MD, Board Certified Cardiologist`
- [ ] Click "Add Doctor"
- [ ] See success message ✅
- [ ] Verify Google Sheets "Doctors" sheet has new row
- [ ] Doctor count on dashboard updates

### Phase 5: Add Another Doctor
- [ ] Click "Add Doctor" button again
- [ ] Fill form:
  - Name: `Dr. Michael Chen`
  - Specialty: `General Medicine`
  - Email: `michael@hospital.com`
  - Phone: `+1-555-0102`
  - Qualification: `MD, Internal Medicine Specialist`
- [ ] Click "Add Doctor"
- [ ] See success message ✅

### Phase 6: Create Patient Account
- [ ] Logout from Hospital Admin
- [ ] Go to http://localhost:8080/signup
- [ ] Create new account:
  - Email: `patient@test.com`
  - Password: `password123`
  - Name: `John Patient`
  - Role: **Patient**
- [ ] Verify redirect to Patient Dashboard

### Phase 7: Book Appointment (Patient)
- [ ] On Patient Dashboard, click "Book Appointment" button
- [ ] Dialog shows list of doctors:
  - [ ] Can see "Dr. Sarah Wilson - Cardiology"
  - [ ] Can see "Dr. Michael Chen - General Medicine"
- [ ] Click on "Dr. Sarah Wilson"
- [ ] Fill appointment form:
  - Date: Select a date (today or tomorrow)
  - Time: `10:30`
  - Reason: `Annual cardiac checkup`
- [ ] Click "Book Appointment"
- [ ] See success message ✅
- [ ] Verify Google Sheets "Appointments" sheet has new row

### Phase 8: Book Another Appointment
- [ ] Click "Book Appointment" button again
- [ ] Select "Dr. Michael Chen"
- [ ] Fill form:
  - Date: Different date (2-3 days from now)
  - Time: `02:30`
  - Reason: `General health checkup`
- [ ] Click "Book Appointment"
- [ ] See success message ✅

### Phase 9: Doctor Views Appointments
- [ ] Logout from Patient
- [ ] Login as `sarah@hospital.com` (Doctor account)
  - [ ] Email: `sarah@hospital.com` (use signup first if needed)
  - [ ] Password: `password123`
  - [ ] Name: Some name
  - [ ] Role: **Doctor**
- [ ] On Doctor Dashboard:
  - [ ] Check appointment count shows appointments
  - [ ] Stats display shows Total Users and Total Hospitals

### Phase 10: Verify All Statistics
- [ ] Total Users count should be 4 (Super Admin, Hospital Admin, Patient, Doctor)
- [ ] Total Hospitals should be 1
- [ ] Login to different roles and verify same stats show

### Phase 11: Google Sheets Verification
- [ ] Open Google Sheets spreadsheet
- [ ] Verify "Users" sheet:
  - [ ] Has 4 rows (plus header)
  - [ ] Contains all user data
- [ ] Verify "Hospitals" sheet:
  - [ ] Has 1 row (plus header)
  - [ ] Contains hospital data
- [ ] Verify "Doctors" sheet:
  - [ ] Has 2 rows (plus header)
  - [ ] Contains both doctors
  - [ ] HospitalID matches hospital ID
- [ ] Verify "Appointments" sheet:
  - [ ] Has 2 rows (plus header)
  - [ ] Contains appointment details
  - [ ] PatientID, DoctorID, HospitalID populated

## Form Validation Tests

### Hospital Form
- [ ] All fields required (test with empty fields)
- [ ] Error message shows when required field missing
- [ ] Success message shows on successful add
- [ ] Loading state works (button shows "Adding...")
- [ ] Form clears after successful add

### Doctor Form
- [ ] All fields required
- [ ] Specialty dropdown works with all 10 options
- [ ] Error handling works
- [ ] Success message displays
- [ ] Loading state works

### Appointment Form
- [ ] Date picker allows today or future dates only
- [ ] Can't select past dates
- [ ] Time input works
- [ ] Reason textarea accepts text
- [ ] All fields required
- [ ] Success message shows

## Edge Cases & Error Handling

- [ ] Try adding duplicate hospital → See error or allow duplicate (expected)
- [ ] Try adding doctor without hospital ID → See error
- [ ] Try booking appointment without selecting doctor → See message
- [ ] Try using past date for appointment → Can't select
- [ ] Try submitting empty form → See validation errors
- [ ] Close dialog while form loading → Aborts correctly

## Performance Tests

- [ ] Dashboard loads quickly
- [ ] Forms open/close without lag
- [ ] Statistics display immediately
- [ ] No console errors in browser (F12)
- [ ] API responses are fast (<2 seconds)

## Final Verification

- [ ] Backend shows no errors in console
- [ ] Frontend shows no errors in console (F12)
- [ ] All 4 roles work correctly
- [ ] Statistics accurate and update
- [ ] Google Sheets has all data entered
- [ ] No broken links or 404 errors

## Test Results

| Feature | Status | Notes |
|---------|--------|-------|
| Super Admin Add Hospital | ✅ / ❌ | |
| Hospital Admin Add Doctor | ✅ / ❌ | |
| Patient Book Appointment | ✅ / ❌ | |
| Doctor View Appointments | ✅ / ❌ | |
| Statistics Display | ✅ / ❌ | |
| Form Validation | ✅ / ❌ | |
| Error Handling | ✅ / ❌ | |
| Google Sheets Sync | ✅ / ❌ | |

## Issues Found

```
(List any issues encountered during testing)
```

## Summary

**Ready for Testing:** ✅ All systems operational

Next: Start with Phase 1 and work through systematically!

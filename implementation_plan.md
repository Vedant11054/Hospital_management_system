# Fully-Fledged Dashboards Implementation Plan

## Goal
The current dashboards (Super Admin, Hospital Admin, Doctor, Patient) use hardcoded placeholder data arrays (e.g., `upcomingAppointments`, `recentPatients`) and have many "dead" buttons (e.g., "New Prescription", "Add Clinical Notes"). 

This plan outlines how we will wire up the real data from the backend to the dashboard UIs, and add functional interactivity (Dialogs, Toasts, API endpoints) to every button to make the app feel "fully fledged" and ready to use.

## User Review Required
> [!IMPORTANT]
> The backend currently only has tables for **Users**, **Hospitals**, **Doctors**, and **Appointments**. 
> Implementing full database backing for *Prescriptions*, *Medical Records*, and *Billing* requires adding new Google Sheets and substantial backend changes. 
> **My proposed approach:** I will wire up all the real data we *do* have (e.g., calculating Total Patients from unique Appointment IDs), but for missing major architectural pieces like "Billing", I will create **Functional Mock Dialogs** (e.g., a "New Prescription" form that successfully submits and shows a Toast notification, but saves to localized component state rather than a remote database). 
> **Does this hybrid approach (real data where possible + interactive mock forms for missing tables) sound acceptable to you?**

## Proposed Changes

### 1. Doctor Dashboard (`DoctorDashboard.tsx`)
Currently uses hardcoded arrays for `upcomingAppointments` and `recentPatients`.
- **Wire up Real Data**: Map the fetched `appointments` from the backend into the UI table, extracting the unique patient names.
- **Make Buttons Work**: 
  - **"New Prescription"**: Open a `FormDialog` with a `NewPrescriptionForm`.
  - **"Manage Availability" / "Request Leave"**: Trigger a success toast notification.
  - **"Add Clinical Notes" / "Upload Report"**: Open a `FormDialog` to simulate file upload/note saving.

### 2. Patient Dashboard (`PatientDashboard.tsx`)
Currently shows "Coming soon" for Prescriptions, Medical Records, and Balance.
- **Wire up Real Data**: Show actual numerical stats derived from the user's role and history.
- **Make Buttons Work**: The "Book Appointment" button already works. We will add click handlers to the sidebar items to show a "Feature in development" toast rather than causing an empty page reload.

### 3. Hospital Admin Dashboard (`HospitalAdminDashboard.tsx`)
Currently shows "Coming soon" for Total Patients and Revenue.
- **Wire up Real Data**: 
  - **Total Patients**: Calculate by finding the number of unique `patientId`s existing in the `appointments` array for that hospital.
  - **Revenue**: Calculate a rough estimate based on `appointments.length * 150` (assuming $150 per appointment).
- **Make Buttons Work**: Ensure "Add Doctor" is fully hooked up to refresh the UI immediately (already mostly implemented).

### 4. Super Admin Dashboard (`SuperAdminDashboard.tsx`)
Currently uses static HTML for "System Alerts" and "Quick Actions".
- **Make Buttons Work**:
  - **"Onboard Hospital"**: Make this open the `AddHospitalForm` dialog.
  - **"Generate Reports"**: Add an onClick that simulates a PDF download (shows a loading spinner on the button, then a "Report Downloaded" toast).
  - **"System Settings"**: Navigate to `/super-admin/settings`.

### 5. Backend Refinements
- Add a utility function to safely aggregate patient counts and revenue across hospitals so that the administrative dashboards load accurate summary numbers instead of placeholders.

## Verification Plan
1. Log in as a Doctor → verify the appointment list loads from the database and the "New Prescription" button opens a working form.
2. Log in as a Hospital Admin → verify "Total Patients" and "Revenue" show valid numbers calculated from appointments.
3. Log in as Super Admin → click "Generate Reports" and verify the loading/toast animation plays.

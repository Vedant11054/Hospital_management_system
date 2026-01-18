# Hospital Management System

A comprehensive hospital management platform with role-based access control for Super Admin, Hospital Admin, Doctor, and Patient roles.

## Features

- **Role-Based Access Control** - Super Admin, Hospital Admin, Doctor, Patient
- **Hospital Management** - Add and manage hospitals
- **Doctor Management** - Add doctors with specialties and link to hospitals
- **Appointment Booking** - Patients can book appointments with doctors
- **Real-time Statistics** - Track total users and hospitals
- **Google Sheets Integration** - All data persisted to Google Sheets
- **Form Validation** - Comprehensive input validation
- **Error Handling** - User-friendly error messages

## Development Setup

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd "Hospital management"

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

The frontend runs on http://localhost:8080 and the backend on http://localhost:3001

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Build the project with `npm run build` and deploy the dist folder to your hosting provider.

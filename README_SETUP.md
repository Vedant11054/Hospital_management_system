# Hospital Management System

A comprehensive healthcare management platform built with React, TypeScript, and Google Sheets as the database.

## Project Structure

```
Hospital management/
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
│   ├── package.json
│   └── vite.config.ts
│
└── backend/               # Express.js backend
    ├── src/
    │   ├── routes/        # API routes
    │   ├── controllers/    # Request handlers
    │   ├── config/         # Configuration files
    │   ├── middleware/     # Express middleware
    │   └── server.js       # Main server file
    ├── package.json
    ├── .env.example
    └── SETUP_GUIDE.md
```

## Features

### User Roles
- **Super Admin**: Manage all hospitals and systems
- **Hospital Admin**: Manage their specific hospital
- **Doctor**: Manage patient records and appointments
- **Patient**: View personal health records

### Core Functionality
- User authentication with JWT
- Role-based access control (RBAC)
- Multi-hospital management
- Doctor and patient management
- Appointment scheduling
- Patient records management
- Secure data storage in Google Sheets

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Google Account with API access

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

See [backend/SETUP_GUIDE.md](backend/SETUP_GUIDE.md) for detailed instructions.

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure Google Sheets credentials and add GOOGLE_SHEETS_ID

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "patient"
}
```

#### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "patient"
}
```

#### Verify Token
```
POST /api/auth/verify
Headers: Authorization: Bearer {token}
```

## Database Schema

The system uses Google Sheets as the database with the following sheets:

### Users Sheet
- ID
- Email
- Password (hashed)
- Name
- Role
- CreatedAt

### Additional Sheets (to be implemented)
- Hospitals
- Doctors
- Patients
- Appointments
- Medical Records

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- CORS enabled for frontend-backend communication
- Environment variables for sensitive data

## Development

### Frontend Technologies
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Router
- React Query

### Backend Technologies
- Node.js/Express
- Google Sheets API
- JWT Authentication
- bcryptjs for password hashing

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please check the documentation or create an issue in the repository.

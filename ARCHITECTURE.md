# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser / Frontend                           │
│  (React + TypeScript + Tailwind CSS)                             │
│  - Pages: Home, Login, Signup, Dashboards                       │
│  - Components: Reusable UI from Shadcn                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP REST API
                           │ (CORS Enabled)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Server                                │
│              (Node.js + Express.js)                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Routes                                                │    │
│  │  - POST /api/auth/signup                              │    │
│  │  - POST /api/auth/login                               │    │
│  │  - POST /api/auth/verify                              │    │
│  └────────────────────────────────────────────────────────┘    │
│           │                                                      │
│           ▼                                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Controllers (Business Logic)                          │    │
│  │  - authController.js                                  │    │
│  │    - signup(): Validate, hash password, save to DB    │    │
│  │    - login(): Verify credentials, generate JWT        │    │
│  │    - verify(): Validate JWT token                     │    │
│  └────────────────────────────────────────────────────────┘    │
│           │                                                      │
│           ▼                                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Middleware                                            │    │
│  │  - CORS configuration                                 │    │
│  │  - Error handler                                      │    │
│  │  - JSON parser                                        │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ Google Sheets API
                       │ (OAuth 2.0)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Google Sheets Database                              │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Users Sheet    │  │ Hospitals Sheet │  │  Doctors Sheet  │ │
│  │─────────────────│  │─────────────────│  │─────────────────│ │
│  │ ID              │  │ ID              │  │ ID              │ │
│  │ Email           │  │ Name            │  │ Name            │ │
│  │ Password        │  │ Address         │  │ Specialization  │ │
│  │ Name            │  │ Phone           │  │ License         │ │
│  │ Role            │  │ Status          │  │ Hospital        │ │
│  │ CreatedAt       │  │ Plan            │  │ Rating          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐  │
│  │ Patients Sheet  │  │  Appointments Sheet                  │  │
│  │─────────────────│  │──────────────────────────────────────│  │
│  │ ID              │  │ ID                                   │  │
│  │ Name            │  │ PatientID                            │  │
│  │ Email           │  │ DoctorID                             │  │
│  │ DOB             │  │ DateTime                             │  │
│  │ Phone           │  │ Status                               │  │
│  │ MedicalHistory  │  │ Notes                                │  │
│  └─────────────────┘  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Signup Flow
```
User fills form in browser
           │
           ▼
Frontend validates input
           │
           ▼
POST /api/auth/signup
    ├─ Email
    ├─ Password
    ├─ Name
    └─ Role
           │
           ▼
authController.signup()
    ├─ Validate input
    ├─ Check for duplicate email
    ├─ Hash password with bcryptjs
    ├─ Generate UUID
    └─ Append to Google Sheets
           │
           ▼
Generate JWT token
           │
           ▼
Response with token + user data
           │
           ▼
Frontend stores token in localStorage
           │
           ▼
Redirect to role-specific dashboard
```

### Login Flow
```
User enters credentials in browser
           │
           ▼
POST /api/auth/login
    ├─ Email
    ├─ Password
    └─ Role
           │
           ▼
authController.login()
    ├─ Get all users from Google Sheets
    ├─ Find user by email + role
    ├─ Compare password with hash
    └─ Generate JWT token
           │
           ▼
Response with token + user data
           │
           ▼
Frontend stores token in localStorage
           │
           ▼
Set Authorization header for future requests
           │
           ▼
Redirect to dashboard
```

## Authentication & Security

### Password Security
```
User Password
      │
      ▼
bcryptjs.hash(password, salt=10)
      │
      ▼
Hashed Password (stored in Google Sheets)
```

### JWT Token Flow
```
Login/Signup Success
      │
      ▼
Generate JWT Token
    - Payload: userId, email, role
    - Secret: process.env.JWT_SECRET
    - Expiry: 7 days
      │
      ▼
Send token to frontend
      │
      ▼
Store in localStorage
      │
      ▼
Include in Authorization header for protected routes
```

## Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
FRONTEND_URL=http://localhost:5173
GOOGLE_SHEETS_ID=your_spreadsheet_id
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Google Cloud Setup
```
Service Account JSON (credentials.json)
      │
      ├─ type: "service_account"
      ├─ client_id
      ├─ client_email
      ├─ private_key
      └─ (other OAuth fields)
```

## API Contracts

### Request/Response Format

**Signup Request:**
```typescript
POST /api/auth/signup
Content-Type: application/json

{
  email: string,        // user@example.com
  password: string,     // min 6 chars
  name: string,         // John Doe
  role: UserRole        // patient | doctor | hospital_admin | super_admin
}
```

**Signup Response:**
```typescript
201 Created
{
  message: string,
  user: {
    id: string,
    email: string,
    name: string,
    role: UserRole
  },
  token: string         // JWT token
}
```

**Error Response:**
```typescript
400/401/409/500
{
  error: string         // Error message
}
```

## Technology Stack

### Frontend
- **React** 18.3 - UI library
- **TypeScript** 5.8 - Type safety
- **Tailwind CSS** 3.4 - Styling
- **React Router** 6.30 - Navigation
- **React Query** 5.83 - Data fetching
- **Shadcn/ui** - UI components
- **Vite** 5.4 - Build tool

### Backend
- **Node.js** - Runtime
- **Express** 4.18 - Web framework
- **Google Sheets API** - Database
- **bcryptjs** 2.4 - Password hashing
- **jsonwebtoken** 9.0 - JWT
- **CORS** 2.8 - Cross-origin support
- **dotenv** 16.3 - Environment variables

### Database
- **Google Sheets** - No-SQL spreadsheet database

## Performance Considerations

### Frontend
- Code splitting with Vite
- Lazy loading of routes
- Component memoization
- Efficient state management

### Backend
- Stateless design (scalable)
- Connection pooling ready
- Error handling
- Request validation

### Database (Google Sheets)
- No need for server
- Automatic backups
- Real-time updates
- Limited to ~2 million cells

## Scalability Path

```
Current: Single Google Sheet
    │
    ▼
Option 1: Migrate to Cloud SQL/PostgreSQL
    - Better for large datasets
    - Better performance
    - More control
    │
    ▼
Option 2: Add caching layer (Redis)
    - Reduce API calls
    - Faster responses
    │
    ▼
Option 3: Microservices
    - Separate services per domain
    - Independent scaling
    - Better fault isolation
```

## Security Layers

```
1. CORS - Restrict API access by origin
2. HTTPS - Encrypt data in transit
3. JWT - Stateless authentication
4. Password Hashing - Bcryptjs with salt
5. Input Validation - Sanitize all inputs
6. Rate Limiting - Prevent brute force (TODO)
7. CSRF Protection - TODO
8. SQL Injection - N/A (Google Sheets)
```

## Error Handling

```
Frontend Error
    │
    ├─ Validation Error → Show inline message
    ├─ Network Error → Show connection error
    ├─ 400 Bad Request → Show field error
    ├─ 401 Unauthorized → Redirect to login
    ├─ 409 Conflict → Show duplicate error
    └─ 500 Server Error → Show generic error
```

## Deployment Strategy

### Frontend (Production)
```
npm run build
    │
    ▼
dist/ folder
    │
    ▼
Deploy to Netlify/Vercel/AWS S3 + CloudFront
```

### Backend (Production)
```
Node.js server
    │
    ├─ Deploy to Heroku/Railway/AWS EC2
    ├─ Set environment variables
    ├─ Use HTTPS with SSL certificate
    └─ Enable production logging
```

### Database (Production)
```
Google Sheets
    ├─ Shared with service account
    ├─ Enable version history
    ├─ Set up sharing rules
    └─ Monitor usage quotas
```

## Monitoring & Logging

### Frontend
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Web Vitals)

### Backend
- Request logging
- Error logging
- Performance metrics
- Database query logging

## API Rate Limiting (Future)

```
Endpoint: /api/auth/signup
  - 5 requests per hour per IP
  - 10 requests per day per email

Endpoint: /api/auth/login
  - 10 attempts per 15 minutes per email
  - Lock account after 5 failed attempts
```

# Deployment Guide - Hospital Management System

## Overview

This guide covers deploying the Hospital Management System to production. The application consists of:
- **Frontend**: React + Vite (static files)
- **Backend**: Node.js + Express (API server)
- **Database**: Google Sheets (via Google API)

---

## Pre-Deployment Checklist

- [ ] Update `VITE_API_URL` in frontend to production backend URL
- [ ] Update `FRONTEND_URL` in backend .env to production frontend URL
- [ ] Set strong `JWT_SECRET` in backend .env
- [ ] Configure Google Sheets credentials
- [ ] Test all features locally
- [ ] Run production build
- [ ] Set `NODE_ENV=production` in backend

---

## Environment Setup

### 1. Frontend Environment (.env)

Create `.env` file in root directory:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

This tells your frontend where to find the backend API in production.

### 2. Backend Environment (backend/.env)

Create `backend/.env` file:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Google Sheets Configuration
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key

# JWT Secret (MUST be long and random in production!)
JWT_SECRET=generate-a-long-random-string-here-minimum-32-characters
JWT_EXPIRE=7d
```

---

## Building for Production

### Frontend Build

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

### Backend

Backend runs as-is. No build needed, just install dependencies:

```bash
cd backend
npm install
```

---

## Deployment Options

### Option 1: Heroku Deployment

#### Frontend (Heroku)

1. Create Heroku app:
```bash
heroku create your-app-frontend
```

2. Set environment variable:
```bash
heroku config:set VITE_API_URL=https://your-app-api.herokuapp.com/api
```

3. Deploy frontend:
```bash
npm run build
git subtree push --prefix dist heroku main
```

#### Backend (Heroku)

1. Create Heroku app:
```bash
heroku create your-app-api
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-long-random-secret
heroku config:set FRONTEND_URL=https://your-app-frontend.herokuapp.com
heroku config:set GOOGLE_SHEET_ID=your-sheet-id
heroku config:set GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
heroku config:set GOOGLE_PRIVATE_KEY=your-private-key
```

3. Deploy backend:
```bash
cd backend
git push heroku main
```

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`
3. Deploy automatically

#### Backend (Railway or Render)

**Railway:**
1. Connect GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy

**Render:**
1. Create new Web Service
2. Connect GitHub repo
3. Set Start Command: `npm start`
4. Add environment variables
5. Deploy

### Option 3: Self-Hosted (VPS/AWS/DigitalOcean)

#### Prerequisites
- Server with Node.js installed
- Domain name pointed to server
- SSL certificate (Let's Encrypt recommended)

#### Setup

1. Clone repository on server:
```bash
git clone your-repo-url
cd "Hospital management"
```

2. Install dependencies:
```bash
npm install
cd backend
npm install
cd ..
```

3. Build frontend:
```bash
npm run build
```

4. Create backend/.env with production values

5. Use PM2 for backend process management:
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name "hospital-api"
pm2 startup
pm2 save
```

6. Serve frontend with Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Google Sheets Configuration for Production

1. **Create Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable Google Sheets API
   - Create Service Account
   - Create and download JSON key

2. **Share Google Sheet:**
   - Share the spreadsheet with service account email
   - Grant Editor access

3. **Update .env:**
   - Copy Service Account Email
   - Copy Private Key
   - Copy Spreadsheet ID (from URL)

---

## Security Best Practices

- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL in production
- [ ] Set strong `JWT_SECRET` (minimum 32 characters, random)
- [ ] Enable CORS only for your domain
- [ ] Use rate limiting on API endpoints
- [ ] Keep dependencies updated
- [ ] Never commit `.env` files to Git
- [ ] Use `.env.example` for reference only

---

## Monitoring & Logging

### Backend Logs (PM2)
```bash
pm2 logs hospital-api
```

### Health Check
```bash
curl https://yourdomain.com/api/health
```

### Error Tracking (Optional)
Consider using:
- Sentry for error tracking
- LogRocket for frontend monitoring
- Google Cloud Logging for comprehensive logs

---

## Domain & SSL Setup

### Using Let's Encrypt (Free SSL)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Update Nginx Config
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Troubleshooting

### Frontend not connecting to backend
- Check `VITE_API_URL` is correct
- Verify backend CORS settings
- Check browser console for errors

### Backend returning 401 Unauthorized
- Verify JWT_SECRET is set correctly
- Check token expiration
- Verify Google Sheets credentials

### Google Sheets not syncing
- Verify GOOGLE_SHEET_ID is correct
- Check service account has Editor access
- Verify GOOGLE_PRIVATE_KEY format (multiline key)

### Port conflicts
- Change PORT environment variable
- Use `lsof -i :3001` to check port usage

---

## Post-Deployment

1. Test all features in production
2. Monitor error logs
3. Set up automated backups of Google Sheets
4. Configure email notifications
5. Monitor performance metrics
6. Schedule regular security updates

---

## Rollback Procedure

If issues occur:

**Heroku:**
```bash
heroku releases
heroku rollback v123
```

**Self-Hosted:**
```bash
cd backend
pm2 restart hospital-api
# Or revert to previous commit and rebuild
```

---

## Support & Maintenance

- Monitor Google Sheets quotas (depends on plan)
- Update Node.js dependencies monthly
- Review JWT expiration settings
- Backup credentials securely
- Test disaster recovery procedures

---

## Environment Reference

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key
JWT_SECRET=your-long-random-secret-32-chars-min
JWT_EXPIRE=7d
```

---

**Last Updated:** January 18, 2026

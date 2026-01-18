# Deployment Commands Cheat Sheet

## 🐳 Docker (Recommended)

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

**Access:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- Health: http://localhost:3001/api/health

---

## 🟣 Heroku

### Initial Setup
```bash
# Install Heroku CLI
npm install -g heroku
heroku login

# Create frontend app
heroku create your-app-frontend

# Create backend app
heroku create your-app-backend
```

### Set Environment Variables
```bash
# Frontend
heroku config:set VITE_API_URL=https://your-app-backend.herokuapp.com/api --app your-app-frontend

# Backend
heroku config:set NODE_ENV=production --app your-app-backend
heroku config:set JWT_SECRET=your-secret --app your-app-backend
heroku config:set GOOGLE_SHEET_ID=your-id --app your-app-backend
heroku config:set GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email --app your-app-backend
heroku config:set GOOGLE_PRIVATE_KEY=your-key --app your-app-backend
```

### Deploy
```bash
# Frontend
npm run build
git subtree push --prefix dist heroku main

# Backend
cd backend
git push heroku main
cd ..
```

### Monitor
```bash
heroku logs -f --app your-app-backend
heroku open --app your-app-frontend
```

---

## ⚡ Vercel (Frontend) + Railway (Backend)

### Vercel Frontend
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect GitHub to Vercel
# Go to vercel.com → Import Project

# 3. Add Environment Variable in Vercel dashboard
# VITE_API_URL: https://your-railway-backend.up.railway.app/api

# 4. Deploy automatically
```

### Railway Backend
```bash
# 1. Go to railway.app
# 2. Create new project
# 3. Connect GitHub repo
# 4. Add environment variables in dashboard
# 5. Deploy automatically
```

---

## 🖥️ Self-Hosted (Ubuntu/Debian)

### Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
sudo apt-get install nginx -y

# Install PM2
sudo npm install -g pm2

# Install SSL (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx -y
```

### Setup Application
```bash
# Clone repository
git clone your-repo-url
cd "Hospital management"

# Install dependencies
npm install
cd backend && npm install && cd ..

# Create .env files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit environment variables
nano .env
nano backend/.env

# Build frontend
npm run build
```

### Start Services
```bash
# Start backend with PM2
cd backend
pm2 start src/server.js --name "hospital-api"
pm2 startup
pm2 save
cd ..

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/default

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### SSL Certificate
```bash
# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Renew automatically (cron job)
sudo certbot renew --quiet
```

### Monitor
```bash
# Backend logs
pm2 logs hospital-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System monitoring
pm2 monit
```

---

## 📱 Docker Commands Reference

```bash
# View containers
docker-compose ps

# View logs
docker-compose logs frontend
docker-compose logs backend

# Restart services
docker-compose restart
docker-compose restart backend

# Rebuild images
docker-compose build --no-cache

# Remove everything
docker-compose down -v

# Run command in container
docker-compose exec backend npm test

# SSH into container
docker-compose exec backend sh
docker-compose exec frontend sh
```

---

## 🔍 Testing After Deployment

```bash
# Test health check
curl https://yourdomain.com/api/health

# Test signup
curl -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!",
    "name":"Test User"
  }'

# Test login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!"
  }'

# Test frontend
curl https://yourdomain.com | grep -i hospital
```

---

## 🚨 Emergency Restart

### Docker
```bash
docker-compose down
docker-compose up -d
```

### Heroku
```bash
heroku restart --app your-app
# Or rollback:
heroku releases --app your-app
heroku rollback v123 --app your-app
```

### Self-Hosted
```bash
# Backend
pm2 restart hospital-api
# Or revert code:
git revert HEAD
npm run build

# Frontend
sudo systemctl restart nginx
```

---

## 📊 Monitoring Commands

### Docker
```bash
# Real-time stats
docker stats

# Resource usage
docker-compose ps --all

# Volume usage
docker volume ls
```

### PM2
```bash
# List processes
pm2 list

# Monitor
pm2 monit

# Logs
pm2 logs

# Delete logs
pm2 flush
```

### Nginx
```bash
# Status
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Reload config
sudo systemctl reload nginx

# Test config
sudo nginx -t
```

---

## 🔐 Environment Variables Setup

```bash
# Create .env from template
cp .env.example .env

# Edit with your editor
nano .env
code .env
# Or use your IDE

# Verify it's in .gitignore
grep ".env" .gitignore
```

---

## 📋 Pre-Deployment Verification

```bash
# Build verification
npm run build

# Output folder check
ls -la dist/

# Backend health check (local)
npm start

# API response check
curl http://localhost:3001/api/health

# Google Sheets connectivity
# Check backend logs for sheet initialization
```

---

## 🆘 Troubleshooting

### Port in use
```bash
# Linux/Mac
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Docker permission error
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### Nginx not reloading
```bash
sudo nginx -t  # Check config
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log  # Check errors
```

### Backend not connecting
```bash
# Check if backend is running
pm2 list

# Check logs
pm2 logs hospital-api

# Check port
netstat -an | grep 3001
```

---

**Keep this handy for quick reference!** 🚀

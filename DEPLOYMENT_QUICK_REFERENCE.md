# 🚀 Production Deployment Guide - Quick Reference

## Files Created for Deployment

✅ **Configuration Files:**
- `.env.example` - Frontend environment variables template
- `backend/.env.example` - Backend environment variables template
- `docker-compose.yml` - Docker containerization setup
- `Dockerfile.frontend` - Frontend container configuration
- `backend/Dockerfile` - Backend container configuration
- `nginx.conf` - Nginx proxy configuration

✅ **Documentation:**
- `DEPLOYMENT.md` - Complete deployment guide (all platforms)
- `DEPLOYMENT_CHECKLIST.md` - Pre/post deployment verification
- `deploy.sh` - Linux/Mac deployment automation script
- `deploy.bat` - Windows deployment automation script

✅ **Build Optimization:**
- `vite.config.ts` - Updated with production build settings
- `.gitignore` - Enhanced with sensitive file exclusions
- `package.json` - Updated with project metadata

---

## Quick Start - Pick Your Platform

### 🐳 **Docker Deployment** (Easiest - Recommended)

```bash
# 1. Copy environment template
cp .env.example .env
cp backend/.env.example backend/.env

# 2. Edit .env files with your credentials
# Update VITE_API_URL, JWT_SECRET, Google Sheets credentials

# 3. Build and run
docker-compose up -d

# 4. Verify
docker-compose logs -f
curl http://localhost:3001/api/health
```

**Requires:** Docker & Docker Compose installed

---

### ☁️ **Heroku Deployment** (Easy)

**Frontend:**
```bash
heroku create your-app-frontend
heroku config:set VITE_API_URL=https://your-app-api.herokuapp.com/api
npm run build
git subtree push --prefix dist heroku main
```

**Backend:**
```bash
heroku create your-app-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-here
heroku config:set GOOGLE_SHEET_ID=your-sheet-id
heroku config:set GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
heroku config:set GOOGLE_PRIVATE_KEY=your-private-key
cd backend
git push heroku main
```

**Requires:** Heroku account & CLI

---

### 🖥️ **Self-Hosted (VPS/AWS/DigitalOcean)** (Full Control)

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone and setup
git clone your-repo-url
cd "Hospital management"
npm install
cd backend && npm install && cd ..

# 4. Create environment files
cp .env.example .env
cp backend/.env.example backend/.env
# Edit both files with production values

# 5. Build frontend
npm run build

# 6. Install PM2 and start backend
sudo npm install -g pm2
cd backend
pm2 start src/server.js --name "hospital-api"
pm2 startup
pm2 save
cd ..

# 7. Install and configure Nginx
sudo apt-get install nginx
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo systemctl restart nginx

# 8. Enable SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

**Requires:** VPS with Ubuntu/Debian, SSH access

---

### ⚡ **Vercel (Frontend) + Railway (Backend)** (No-Code Friendly)

**Frontend (Vercel):**
1. Push to GitHub
2. Connect GitHub to Vercel
3. Set environment variable: `VITE_API_URL=https://your-railway-app.up.railway.app/api`
4. Deploy

**Backend (Railway):**
1. Create new service on Railway
2. Connect GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy automatically

---

## Environment Variables Quick Reference

### Frontend (.env)
```env
# Change to your production API URL
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Google Sheets (get from Google Cloud Console)
GOOGLE_SHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key-with-newlines-preserved

# JWT (generate random string, min 32 chars)
JWT_SECRET=your-long-random-secret-key-here
JWT_EXPIRE=7d
```

---

## Pre-Deployment Checklist

- [ ] `.env` files created and filled with production values
- [ ] Google Sheets credentials tested
- [ ] JWT_SECRET is strong and unique (min 32 chars)
- [ ] VITE_API_URL updated to production backend
- [ ] FRONTEND_URL updated to production frontend
- [ ] `npm run build` succeeds without errors
- [ ] All tests pass
- [ ] Tested on production-like environment

---

## Deployment Commands

| Platform | Command |
|----------|---------|
| Docker | `docker-compose up -d` |
| Windows Local | `deploy.bat` |
| Linux/Mac Local | `bash deploy.sh` |
| Heroku | `git push heroku main` |
| Vercel | Connected via GitHub |
| Self-Hosted | `npm start` (backend) + `systemctl start nginx` |

---

## Post-Deployment Verification

```bash
# 1. Test health check
curl https://yourdomain.com/api/health

# 2. Test frontend loads
curl https://yourdomain.com

# 3. Test signup
curl -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# 4. Check Google Sheets for data
# (Open your Google Sheet and verify new data appears)
```

---

## Monitoring & Logs

### Docker
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Heroku
```bash
heroku logs -f --app your-app-api
```

### Self-Hosted (PM2)
```bash
pm2 logs hospital-api
pm2 monit
```

### Railway
Use Railway dashboard

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Frontend not found | Check dist folder built, Nginx config correct |
| 502 Backend error | Check backend running, port accessible, CORS enabled |
| JWT auth fails | Verify JWT_SECRET same on frontend & backend |
| Google Sheets not syncing | Verify credentials, sheet ID, service account email |
| CORS errors | Check FRONTEND_URL matches frontend domain |

---

## Important Security Notes

🔒 **NEVER commit:**
- `.env` files
- `credentials.json`
- Private keys
- JWT secrets

✅ **DO:**
- Use environment variables
- Enable HTTPS/SSL
- Set strong JWT_SECRET (32+ chars)
- Keep dependencies updated
- Monitor error logs

---

## Support Resources

- 📖 Full guide: `DEPLOYMENT.md`
- ✅ Verification: `DEPLOYMENT_CHECKLIST.md`
- 🔧 API docs: `DASHBOARD_FUNCTIONALITY.md`
- 💡 Testing: `TESTING_CHECKLIST.md`
- 🎯 Overview: `COMPLETE_IMPLEMENTATION.md`

---

## Need Help?

1. Check relevant documentation file
2. Review error logs
3. Verify environment variables
4. Test API endpoints with curl
5. Check Google Sheets for data persistence

---

**Ready to deploy? Start with Docker!** 🚀

# 🚀 Vercel Deployment Guide - Hospital Management System

## Overview

Deploy your Hospital Management System on **Vercel (Frontend) + Railway (Backend)**

- **Frontend:** React app on Vercel (free tier available)
- **Backend:** Node.js API on Railway (paid, low cost ~$5-10/month)
- **Database:** Google Sheets (free)

---

## Prerequisites

1. **GitHub Account** - Required for deployment
2. **Vercel Account** - Free at https://vercel.com
3. **Railway Account** - Free at https://railway.app
4. **Google Sheets Credentials** - Already configured
5. **Your Repository** - GitHub repo with Hospital Management code

---

## Step 1: Prepare Your GitHub Repository

### 1a. Push Your Code to GitHub
```bash
cd "d:\projects\Hospital management"

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Hospital Management System - Production Ready"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/hospital-management.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1b. Verify These Files Are in Your Repo
✅ `package.json` (frontend)
✅ `vite.config.ts`
✅ `.env.example`
✅ `backend/package.json`
✅ `backend/.env.example`
✅ `backend/src/server.js`
✅ All source files

### 1c. Add `.vercelignore` (Optional but Recommended)
```
node_modules
.env
.env.local
.env.*.local
credentials.json
dist
build
```

---

## Step 2: Deploy Backend on Railway

### 2a. Create Railway Account
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub

### 2b. Deploy Backend Service
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your hospital-management repo
4. Select "Backend Directory" → point to `/backend` folder
5. Railway will auto-detect Node.js

### 2c. Add Environment Variables in Railway

In Railway dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add these variables:

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
GOOGLE_SHEET_ID=YOUR_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key-with-escaped-newlines
JWT_SECRET=your-long-random-secret-min-32-chars
JWT_EXPIRE=7d
```

### 2d. Get Your Backend URL
After deployment:
1. Go to Railway project settings
2. Copy the "Public URL" (looks like: `https://railway-app-name.up.railway.app`)
3. **Save this URL** - you'll need it for Vercel

### 2e. Verify Backend is Running
```bash
curl https://your-railway-url.up.railway.app/api/health
# Should return: {"status":"ok"}
```

---

## Step 3: Deploy Frontend on Vercel

### 3a. Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize Vercel to access your GitHub

### 3b. Import Your Project
1. In Vercel dashboard, click "New Project"
2. Click "Import Git Repository"
3. Search for `hospital-management`
4. Click "Import"

### 3c. Configure Project
**Build Settings:**
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Root Directory:** (leave blank or set to `.`)

### 3d. Add Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add new variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-railway-url.up.railway.app/api`

### 3e. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Vercel will give you a URL like: `https://hospital-management.vercel.app`

### 3f. Verify Frontend is Running
Open https://your-vercel-domain.vercel.app in browser
- Should see landing page
- Should be able to navigate
- Should connect to backend API

---

## Step 4: Update Backend FRONTEND_URL

Now that you have your Vercel domain:

1. Go back to Railway
2. Edit Environment Variable: `FRONTEND_URL`
3. Set to: `https://your-vercel-domain.vercel.app`
4. Redeploy

---

## Step 5: Test Complete Flow

### Test Signup
```bash
curl -X POST https://your-railway-url.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!",
    "name":"Test User",
    "role":"patient"
  }'
```

### Test Login
```bash
curl -X POST https://your-railway-url.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!"
  }'
```

### Test Hospitals
```bash
curl https://your-railway-url.up.railway.app/api/hospitals/list
```

### Test in Browser
1. Open https://your-vercel-domain.vercel.app
2. Try signup
3. Try login
4. Try adding hospital/doctor/appointment
5. Check Google Sheets for data

---

## Environment Variables Reference

### For Railway (Backend)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-domain.vercel.app
GOOGLE_SHEET_ID=your-sheet-id-from-google
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key-escaped
JWT_SECRET=generate-strong-random-string-32-chars-min
JWT_EXPIRE=7d
```

### For Vercel (Frontend)
```env
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

---

## Troubleshooting

### Frontend Won't Load
- **Check:** Vercel build logs in deployment tab
- **Check:** Correct Node.js version
- **Check:** All dependencies installed
- **Fix:** Rebuild and redeploy

### API Calls Failing (CORS)
- **Check:** FRONTEND_URL in Railway matches Vercel domain
- **Check:** VITE_API_URL in Vercel matches Railway URL
- **Fix:** Update environment variables and redeploy both

### Google Sheets Not Syncing
- **Check:** GOOGLE_SHEET_ID is correct
- **Check:** Service account has Editor access
- **Check:** Credentials are valid
- **Fix:** Test with curl command, check server logs

### 401 Authentication Error
- **Check:** JWT_SECRET is same on both services
- **Check:** Token expiration not exceeded
- **Fix:** Clear cookies, login again

### Backend Returns 502
- **Check:** Railway service is running
- **Check:** PORT environment variable is set
- **Check:** Server logs for errors
- **Fix:** Check Railway logs, restart service

---

## Monitoring After Deployment

### Vercel Monitoring
1. Go to Vercel dashboard
2. Click on your project
3. View "Deployments" tab for latest deployment
4. View "Analytics" for performance metrics
5. View "Functions" logs if needed

### Railway Monitoring
1. Go to Railway dashboard
2. Click on your project
3. View "Deploy" tab for deployment history
4. View "Logs" tab for server output
5. View "Metrics" for performance

### Health Check
```bash
# Should respond with 200 OK
curl -I https://your-railway-url.up.railway.app/api/health

# Should load frontend
curl -I https://your-vercel-domain.vercel.app
```

---

## Custom Domain (Optional)

### For Vercel Frontend
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS instructions
5. Point to Vercel nameservers

### For Railway Backend
1. Go to Railway project settings
2. Under "Networking", add custom domain
3. Update DNS records
4. Update Vercel VITE_API_URL to use custom domain

---

## Redeploy Changes

### When You Update Code

**For Frontend:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-redeploys
```

**For Backend:**
```bash
cd backend
git add .
git commit -m "Update backend"
cd ..
git push origin main
# Railway auto-redeploys
```

---

## Costs

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel | ✅ Yes (generous) | $20/month |
| Railway | Limited | $5-10/month+ |
| Google Sheets | ✅ Free | - |
| **Total** | ✅ Mostly Free | ~$10-15/month |

---

## Performance Tips

1. **Enable Caching** in Vercel
   - Settings → Caching
   - Enable "Cache Build Outputs"

2. **Optimize Images** - Use next-gen formats
3. **Enable Compression** - Both services do this
4. **Monitor Performance** - Check Vercel Analytics
5. **Check API Response Times** - Railway Metrics

---

## Scaling

Both services auto-scale:
- **Vercel:** Auto-scales based on traffic
- **Railway:** Can set min/max replicas

If you get high traffic:
- Upgrade Railway plan
- Configure auto-scaling in Railway

---

## Support

- **Vercel Support:** https://vercel.com/support
- **Railway Support:** https://railway.app/support
- **Google Sheets API:** https://developers.google.com/sheets

---

## Checklist

Pre-Deployment:
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Google Sheets credentials ready

Deployment:
- [ ] Backend deployed on Railway
- [ ] Backend environment variables set
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] Backend FRONTEND_URL updated

Testing:
- [ ] API health check works
- [ ] Frontend loads
- [ ] Signup works
- [ ] Login works
- [ ] Data appears in Google Sheets

---

## Next Steps

1. ✅ Create GitHub account & push code
2. ✅ Create Railway account & deploy backend
3. ✅ Create Vercel account & deploy frontend
4. ✅ Set environment variables
5. ✅ Test everything
6. ✅ Share your domain!

---

**You're live!** 🎉 Your app is now deployed and accessible worldwide!

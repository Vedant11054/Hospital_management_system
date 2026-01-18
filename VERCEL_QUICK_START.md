# ⚡ Vercel Quick Start - 30 Minutes to Production

## What You'll Get

✅ Frontend live on Vercel (your-app.vercel.app)
✅ Backend live on Railway (your-api.up.railway.app)
✅ Everything connected and working
✅ Costs: ~$10-15/month

---

## Prerequisites (5 minutes)

- [ ] GitHub account (free at github.com)
- [ ] Vercel account (free at vercel.com)
- [ ] Railway account (free at railway.app)
- [ ] Your code pushed to GitHub

### Push Your Code to GitHub Now

If not done yet:
```bash
cd "d:\projects\Hospital management"
git init
git add .
git commit -m "Hospital Management System"
git remote add origin https://github.com/YOUR_USERNAME/hospital-management.git
git branch -M main
git push -u origin main
```

---

## Step 1: Deploy Backend on Railway (10 minutes)

### 1. Go to Railway
1. Open https://railway.app
2. Click "Start Project"
3. Click "Deploy from GitHub repo"
4. Select your `hospital-management` repo
5. Click "Deploy"

Railway will auto-detect it's a Node.js project ✅

### 2. Set Environment Variables
In Railway dashboard → Variables tab:

```
NODE_ENV = production
PORT = 3001
JWT_SECRET = generate-a-random-32-character-string-here
GOOGLE_SHEET_ID = your-google-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL = your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = your-private-key-here
JWT_EXPIRE = 7d
FRONTEND_URL = https://YOUR-VERCEL-DOMAIN.vercel.app
```

⚠️ Don't set FRONTEND_URL yet - you'll update it after Vercel is deployed

### 3. Wait for Deployment
Railway will build and deploy. Click "View Logs" to see progress.

When done, you'll see:
```
Server running on http://localhost:3001
```

### 4. Copy Your Railway URL
In Railway dashboard:
- Go to "Networking"
- Copy the public URL (looks like: `https://railway-abc123.up.railway.app`)
- **Save this URL** - you'll need it in 10 minutes!

### 5. Test Backend
```bash
curl https://your-railway-url.up.railway.app/api/health
# Should return: {"status":"ok"}
```

✅ Backend is live!

---

## Step 2: Deploy Frontend on Vercel (10 minutes)

### 1. Go to Vercel
1. Open https://vercel.com
2. Click "Sign Up" → "Sign up with GitHub"
3. In dashboard, click "New Project"
4. Click "Import Git Repository"
5. Search for `hospital-management`
6. Click "Import"

### 2. Configure Build Settings
Vercel should auto-detect Vite:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Click "Deploy" ✅

### 3. Set Environment Variable
While Vercel is building:
1. Go to "Settings" → "Environment Variables"
2. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
   - (Use the Railway URL you copied earlier!)
3. Click "Save"
4. Go back to "Deployments"
5. Click the three dots on latest deployment
6. Click "Redeploy"

### 4. Copy Your Vercel URL
When deployment completes, you'll see:
- **Production URL:** `https://your-app-name.vercel.app`
- **Save this URL** - you need it in the next step!

### 5. Test Frontend
Open `https://your-vercel-domain.vercel.app` in browser
- Should see the landing page ✅

---

## Step 3: Update Backend FRONTEND_URL (2 minutes)

Now update Railway with your Vercel domain:

1. Go to Railway dashboard
2. Click on your project
3. Go to "Variables"
4. Edit `FRONTEND_URL`
5. Change to: `https://your-vercel-domain.vercel.app`
6. Click "Save"
7. Click "Redeploy" (three dots on latest deployment)

---

## Step 4: Test Everything (5 minutes)

### Test 1: Frontend Loads
```
Open: https://your-vercel-domain.vercel.app
Expect: Landing page with navigation
```

### Test 2: Signup Works
```
Click "Sign Up"
Fill in form
Click Submit
Expect: Success message or redirect to dashboard
```

### Test 3: Check Google Sheets
```
Open your Google Sheet
Expect: New user row added with your email
```

### Test 4: Backend Health
```bash
curl https://your-railway-url.up.railway.app/api/health
Expect: {"status":"ok"}
```

### Test 5: All Features
```
✅ Login
✅ Add Hospital (if Super Admin)
✅ Add Doctor (if Hospital Admin)
✅ Book Appointment (if Patient)
✅ View Appointments (if Doctor)
✅ Check Google Sheets for all data
```

✅ Everything works!

---

## Your Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://your-vercel-domain.vercel.app |
| **Backend** | https://your-railway-url.up.railway.app |
| **Backend Health** | https://your-railway-url.up.railway.app/api/health |

---

## Environment Variables Summary

### Frontend (.env) - Vercel
```env
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

### Backend (.env) - Railway
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-domain.vercel.app
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key
JWT_SECRET=your-random-32-char-secret
JWT_EXPIRE=7d
```

---

## Troubleshooting

### "API calls failing" / CORS errors
1. Check VITE_API_URL in Vercel is correct
2. Check FRONTEND_URL in Railway is correct
3. Redeploy both services
4. Check browser console for exact error

### "Can't see my changes"
1. In Vercel → Deployments → Redeploy latest
2. In Railway → Deployments → Redeploy latest
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### "Google Sheets empty"
1. Check GOOGLE_SHEET_ID is correct
2. Check credentials are correct
3. Check service account has Editor access
4. Restart Railway service

### "Backend returns 502"
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Restart the service
4. Check PORT is 3001

### "Frontend not loading"
1. Check Vercel build logs
2. Verify build command succeeded
3. Check VITE_API_URL is set
4. Redeploy

---

## Next Steps

### Share Your App
```
Send to users: https://your-vercel-domain.vercel.app
```

### Monitor Performance
- **Vercel:** Dashboard → Analytics
- **Railway:** Dashboard → Metrics

### Scale When Needed
- Both services auto-scale for free tier
- Upgrade Railway if hitting limits

### Custom Domain (Optional)
1. Buy domain (Vercel or elsewhere)
2. In Vercel: Settings → Domains → Add
3. In Railway: Settings → Networking → Add
4. Follow DNS instructions

---

## Costs

| Service | Free Tier | Cost If Upgrading |
|---------|-----------|------------------|
| Vercel | ✅ Generous free | $20/month |
| Railway | Limited free | $5-10/month |
| Google Sheets | ✅ Free | - |
| **Monthly Cost** | ✅ $0 | ~$10-20 |

---

## Success! 🎉

Your Hospital Management System is now:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Auto-scaling
- ✅ Production-ready

**Share your app!** 🚀

---

## Cheat Sheet (Quick Reference)

```bash
# Update code and redeploy:
git add .
git commit -m "Update"
git push origin main
# Both Vercel and Railway auto-redeploy!

# Test backend:
curl https://your-railway-url.up.railway.app/api/health

# Check Vercel logs:
vercel logs

# Check Railway logs:
# Go to Railway dashboard → Logs tab
```

---

**Questions?** Check `VERCEL_DEPLOYMENT.md` for detailed instructions.

# Production Deployment Checklist

## Pre-Deployment (Before Going Live)

### Environment Configuration
- [ ] Create `.env` file from `.env.example`
- [ ] Set `VITE_API_URL` to production backend URL
- [ ] Create `backend/.env` from `backend/.env.example`
- [ ] Set `NODE_ENV=production` in backend
- [ ] Generate strong `JWT_SECRET` (min 32 characters, random)
- [ ] Verify `FRONTEND_URL` matches your domain
- [ ] Confirm Google Sheets credentials are valid

### Backend Setup
- [ ] Run `npm install` in backend directory
- [ ] Verify all dependencies installed correctly
- [ ] Test backend locally: `npm run dev`
- [ ] Check `/api/health` endpoint responds
- [ ] Verify Google Sheets integration works
- [ ] Test authentication endpoints
- [ ] Test all API endpoints with sample data

### Frontend Build
- [ ] Run `npm install` in root directory
- [ ] Run `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Check build size is reasonable
- [ ] Test production build locally: `npm run preview`
- [ ] Verify all routes work
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

### Security Review
- [ ] Verify no `.env` files in git history
- [ ] Check `.gitignore` includes sensitive files
- [ ] Review CORS settings in backend
- [ ] Verify JWT expiration is set appropriately
- [ ] Confirm Google credentials not hardcoded
- [ ] Enable HTTPS/SSL certificate
- [ ] Set security headers (X-Frame-Options, CSP, etc.)
- [ ] Enable rate limiting on API endpoints

### Google Sheets Setup
- [ ] Verify Google Sheet ID is correct
- [ ] Confirm service account has Editor access
- [ ] Test reading/writing to spreadsheet
- [ ] Verify all required sheets exist (Users, Hospitals, Doctors, Appointments)
- [ ] Check Google API quota limits
- [ ] Enable backups for the spreadsheet

---

## Deployment

### Option A: Docker (Recommended)
- [ ] Install Docker and Docker Compose
- [ ] Build images: `docker-compose build`
- [ ] Create `.env` file with production variables
- [ ] Start services: `docker-compose up -d`
- [ ] Verify both containers running: `docker-compose ps`
- [ ] Check logs: `docker-compose logs -f`
- [ ] Test endpoints

### Option B: Self-Hosted (VPS)
- [ ] SSH into server
- [ ] Install Node.js 18+
- [ ] Install nginx
- [ ] Clone repository
- [ ] Install dependencies (frontend and backend)
- [ ] Build frontend: `npm run build`
- [ ] Create `backend/.env`
- [ ] Install PM2: `npm install -g pm2`
- [ ] Start backend: `pm2 start backend/src/server.js --name hospital-api`
- [ ] Configure nginx to proxy requests
- [ ] Enable SSL with Let's Encrypt
- [ ] Start nginx: `systemctl start nginx`

### Option C: Heroku
- [ ] Create Heroku apps (frontend and backend)
- [ ] Add buildpacks for Node.js
- [ ] Set environment variables in Heroku dashboard
- [ ] Deploy using `git push heroku main`
- [ ] Monitor deployment logs

### Option D: Vercel (Frontend) + Railway/Render (Backend)
- [ ] Connect GitHub to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy frontend
- [ ] Create backend service on Railway/Render
- [ ] Set environment variables
- [ ] Deploy backend

---

## Post-Deployment Testing

### Frontend Tests
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Can signup
- [ ] Can login
- [ ] Dashboard displays correctly
- [ ] All buttons functional
- [ ] Forms submit properly
- [ ] Error messages display
- [ ] Network requests succeed

### Backend Tests
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Signup works: `POST /api/auth/signup`
- [ ] Login works: `POST /api/auth/login`
- [ ] Add hospital works: `POST /api/hospitals/add`
- [ ] List hospitals works: `GET /api/hospitals/list`
- [ ] Add doctor works: `POST /api/doctors/add`
- [ ] Book appointment works: `POST /api/appointments/book`
- [ ] Get appointments works: `GET /api/appointments/patient/:id`
- [ ] CORS headers present
- [ ] Error handling works (400, 401, 500)

### Data Verification
- [ ] Data appears in Google Sheets
- [ ] User registration saves to Users sheet
- [ ] Hospital creation saves to Hospitals sheet
- [ ] Doctor creation saves to Doctors sheet
- [ ] Appointments save to Appointments sheet
- [ ] All timestamps are correct
- [ ] IDs are unique and valid

### Performance
- [ ] Page load time < 3 seconds
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] No memory leaks
- [ ] Images load properly
- [ ] CSS applies correctly

### Security
- [ ] HTTPS enforced
- [ ] JWT tokens work
- [ ] Unauthorized requests rejected
- [ ] No sensitive data in logs
- [ ] No credentials exposed
- [ ] Rate limiting active

---

## Monitoring & Maintenance

### Daily (First Week)
- [ ] Monitor error logs
- [ ] Check user activity
- [ ] Verify Google Sheets syncing
- [ ] Monitor server performance
- [ ] Test critical workflows

### Weekly
- [ ] Review error logs
- [ ] Check Google Sheets quota usage
- [ ] Verify backups
- [ ] Monitor uptime

### Monthly
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Check SSL certificate expiration
- [ ] Backup Google Sheets
- [ ] Review performance metrics

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature requests review
- [ ] Update documentation

---

## Rollback Plan

### If Issues Occur:

**For Docker:**
```bash
docker-compose down
# Fix the issue
docker-compose up -d
```

**For Heroku:**
```bash
heroku releases
heroku rollback v123
```

**For Self-Hosted:**
```bash
pm2 restart hospital-api
# Or revert to previous code version and rebuild
```

---

## Communication

### Notify Users
- [ ] Inform users about deployment
- [ ] Provide login credentials if needed
- [ ] Share access documentation
- [ ] Provide support contact info

### Documentation
- [ ] Update README with deployment info
- [ ] Document any environment-specific setup
- [ ] Create runbook for operations team
- [ ] Document emergency procedures

---

## Final Sign-Off

- [ ] Product Owner approval
- [ ] QA sign-off
- [ ] Security approval
- [ ] Operations approval
- [ ] Deployment complete and verified

---

## Critical Contacts

- DevOps: [Your contact]
- Security: [Your contact]
- Support: [Your contact]
- Emergency: [Your contact]

---

**Deployment Date:** _________________
**Deployed By:** _________________
**Verified By:** _________________

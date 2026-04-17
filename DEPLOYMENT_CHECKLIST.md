# HostelEase Deployment Checklist

## Pre-Deployment ✓
- [ ] Backend `.gitignore` created
- [ ] Frontend `.env.production` created
- [ ] Both pushed to GitHub

## MongoDB Atlas Setup ✓
- [ ] Account created
- [ ] Cluster created & ready
- [ ] Database user created
- [ ] Network access enabled (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Connection string format: `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/hostelease?retryWrites=true&w=majority`

## Backend (Render) Deployment ✓
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] New Web Service created
- [ ] Backend repo connected
- [ ] Environment variables set:
  - [ ] MONGO_URI
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] SUPPORT_EMAIL
  - [ ] NODE_ENV = production
  - [ ] FRONTEND_URL (update after Netlify)
- [ ] Backend deployed successfully
- [ ] Backend URL copied (e.g., https://hostelease-backend.onrender.com)
- [ ] Health check passed (/api/health returns success)

## Frontend (Netlify) Deployment ✓
- [ ] Netlify account created
- [ ] GitHub connected to Netlify
- [ ] Frontend repo imported
- [ ] Build settings:
  - [ ] Base directory: frontend
  - [ ] Build command: npm run build
  - [ ] Publish directory: frontend/dist
- [ ] Environment variables set:
  - [ ] VITE_API_BASE_URL = https://hostelease-backend.onrender.com/api
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted (e.g., https://hostelease-app.netlify.app)

## Post-Deployment ✓
- [ ] Backend FRONTEND_URL updated to Netlify URL
- [ ] Backend redeployed
- [ ] All API endpoints tested
- [ ] CORS working (no origin errors)
- [ ] Authentication working (JWT tokens)
- [ ] Frontend-Backend communication verified
- [ ] All features tested in production

## Important URLs
- Backend: https://hostelease-backend.onrender.com
- Frontend: https://hostelease-app.netlify.app
- Database: MongoDB Atlas Cluster
- Admin Panel: Render dash → Services
- Site Admin: Netlify dash → Sites

## Troubleshooting
- 504 errors: Backend taking too long, check Render logs
- CORS errors: Check FRONTEND_URL in backend .env
- API 404: Check VITE_API_BASE_URL in frontend
- Blank page: Check build folder (dist/) was created
- Database errors: Verify MongoDB connection string & IP whitelist

## Redeployment
1. Make changes locally
2. Commit & push to GitHub
3. Render & Netlify auto-redeploy on push
4. Check deployment logs if issues occur

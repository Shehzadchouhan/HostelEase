# Reset Password Fix - Deployment Guide

## Problem That Was Fixed

When users clicked the reset password link from the email, they got a **404: NOT_FOUND** error instead of being taken to the reset password page.

### Root Cause
The backend wasn't using the correct frontend URL when generating reset links. In production, it was trying to use `http://localhost:5173` (the local dev URL) instead of the actual deployed frontend URL.

---

## What Was Fixed

### 1. Backend Improvements (`backend/routes/authRoutes.js`)
✅ Added `getFrontendURL()` function that intelligently determines the correct frontend URL:
   - Checks `FRONTEND_URL` environment variable (highest priority)
   - Falls back to `FRONTEND_DOMAIN` environment variable (auto-adds `https://`)
   - Uses production URL as fallback if available
   - Uses `http://localhost:5173` for local development

✅ Added new validation endpoint: `GET /api/auth/validate-reset-token/:token`
   - Validates token before user lands on reset page
   - Returns proper error message if token is invalid or expired

### 2. Frontend Improvements (`frontend/src/pages/ResetPassword.jsx`)
✅ Added token validation on component mount
✅ Shows loading state while validating
✅ Shows error message with "Back to Login" link if token is invalid
✅ Better UX with proper disabled state on submit button

---

## Deployment Setup Instructions

### Option A: Using `FRONTEND_URL` (Recommended for Production)

1. **On Render.com (Backend):**
   - Go to your Backend service settings
   - Find "Environment" section
   - Add/Update environment variable:
     ```
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Replace with your actual frontend URL
   - Redeploy the backend

2. **Example:**
   ```
   FRONTEND_URL=https://hostel-ease-sigma.vercel.app
   ```

### Option B: Using `FRONTEND_DOMAIN` (Alternative)

If you prefer not to include `https://` in the variable:

1. **On Render.com (Backend):**
   ```
   FRONTEND_DOMAIN=your-frontend-url.vercel.app
   ```

The backend will automatically prepend `https://`

### Local Development (No Changes Needed)
✅ Already works! Uses `http://localhost:5173` by default

---

## Testing the Fix

### Local Testing:
1. Start backend: `npm run dev` (from backend folder)
2. Start frontend: `npm run dev` (from frontend folder)
3. Go to login page → "Forgot Password"
4. Enter email → Check email for reset link
5. Click link → Should load reset password page

### Production Testing:
1. Make sure `FRONTEND_URL` or `FRONTEND_DOMAIN` is set on Render
2. Redeploy backend
3. Go to your production frontend
4. Follow the same flow
5. Reset link should work correctly

---

## Environment Variables Summary

### Backend `.env` (for production deployment):

```env
# Production Setup
PORT=5000
NODE_ENV=production

# Database (use your Render MongoDB or Atlas connection string)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/hostelease

# **IMPORTANT: Set this to your production frontend URL**
FRONTEND_URL=https://hostel-ease-sigma.vercel.app

# Email settings
EMAIL_USER=supporthosteleaze@gmail.com
EMAIL_PASSWORD=hxax sros fpyu scmb
SUPPORT_EMAIL=supporthosteleaze@gmail.com
```

### Frontend `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-render-url.onrender.com/api
```

---

## Troubleshooting

### Still Getting 404 Error?

1. **Check Backend Environment Variables:**
   - Go to Render → Your Backend Service → Environment
   - Verify `FRONTEND_URL` is set correctly
   - Make sure there are no typos

2. **Check if Backend Redeployed:**
   - After changing env vars, backend must be redeployed
   - Go to Deployments → Click "Deploy" on latest commit

3. **Check Email Content:**
   - The reset link in the email should point to your production frontend URL
   - Example: `https://hostel-ease-sigma.vercel.app/reset-password?token=...`

4. **Check Frontend Routes:**
   - Make sure `/reset-password` route exists in frontend
   - Verify Navbar/navbar doesn't have issues loading on that page

5. **Check CORS:**
   - Make sure your frontend URL is in CORS allowedOrigins in `server.js`
   - Frontend should be able to make API calls to backend

### Validation Endpoint Returns Error?

- The endpoint `GET /api/auth/validate-reset-token/:token` validates the token
- If it returns error, the token is either:
  - **Invalid**: Token doesn't exist in database
  - **Expired**: Token was created more than 1 hour ago
  - **Already used**: Token was already used for a password reset

---

## New API Endpoints

### Validate Reset Token
```
GET /api/auth/validate-reset-token/:token

Response (Success):
{
  "success": true,
  "message": "Token is valid"
}

Response (Error):
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## Files Modified

1. ✅ `backend/routes/authRoutes.js` - Added URL handling & validation endpoint
2. ✅ `backend/.env.example` - Updated with production instructions
3. ✅ `frontend/src/pages/ResetPassword.jsx` - Added token validation & better UX

---

## Next Steps

1. **Update your Render backend environment:**
   ```
   FRONTEND_URL=https://hostel-ease-sigma.vercel.app
   ```

2. **Redeploy backend service**

3. **Test the password reset flow**

4. **Monitor Render logs for any errors**

---

**Need Help?** Check:
- Render dashboard logs: https://dashboard.render.com
- Backend console for "Password reset link:" logs
- Email spam folder (sometimes reset emails end up there)

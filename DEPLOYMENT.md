# Deployment Guide

## Prerequisites

1. **Email Service**: Gmail account with App Password (or another SMTP service)
2. **Database**: PostgreSQL database (Render provides free tier)
3. **Hosting**: Vercel account for frontend, Render account for backend

## Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - Name: `biologic-db`
   - Database: `biologic`
   - User: `biologic_user`
4. Click "Create Database"
5. Copy the "External Database URL" - you'll need this

### Step 2: Setup Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Create new app password for "Mail"
5. Copy the generated password

### Step 3: Deploy Backend

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in:
   - Name: `biologic-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=<your-postgres-external-url>
   JWT_SECRET=<generate-a-random-32-char-string>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-gmail-address>
   EMAIL_PASS=<your-app-password>
   FRONTEND_URL=https://your-app.vercel.app
   PORT=5000
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://biologic-backend.onrender.com`)

### Step 4: Initialize Database

Once backend is deployed, run migrations:

```bash
# SSH into your Render service or use Render Shell
npm run init-db
npm run create-demo-users
```

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://biologic-backend.onrender.com
   ```
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 2: Update Backend FRONTEND_URL

1. Go back to Render Dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` with your Vercel URL
5. Save and redeploy

## Post-Deployment

### Test Email Functionality

1. Go to your Vercel URL
2. Click "Register" tab
3. Create a new account
4. Check your email for verification link
5. Click verification link
6. You should be logged in automatically

### Test Password Reset

1. On login page, click "Forgot password?"
2. Enter your email
3. Check email for reset link
4. Click link and set new password
5. Login with new password

## Troubleshooting

### Emails Not Sending

1. Check Gmail App Password is correct
2. Verify 2-Step Verification is enabled
3. Check Render logs for errors: `Logs` tab in your service

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check if database is active in Render
3. Try running migrations manually

### CORS Errors

Make sure your backend has correct CORS configuration in `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Demo Accounts

After running `create-demo-users`, you can login with:

- **Admin**: admin@demo.com / demo123
- **Worker**: worker@demo.com / demo123
- **Viewer**: viewer@demo.com / demo123

## Environment Variables Reference

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:port/db |
| JWT_SECRET | Secret key for JWT tokens | random-32-character-string |
| EMAIL_HOST | SMTP server host | smtp.gmail.com |
| EMAIL_PORT | SMTP server port | 587 |
| EMAIL_USER | Email address for sending | your-email@gmail.com |
| EMAIL_PASS | Email password/app password | your-app-password |
| FRONTEND_URL | Frontend application URL | https://your-app.vercel.app |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | https://biologic-backend.onrender.com |

## Updating Your Deployment

### Backend Updates

```bash
git push origin main
```

Render will automatically redeploy.

### Frontend Updates

```bash
git push origin main
```

Vercel will automatically redeploy.

## Important Security Notes

1. **Never commit** `.env` files to git
2. **Always use** strong JWT_SECRET (32+ characters)
3. **Use App Passwords** for Gmail, not your actual password
4. **Keep dependencies updated** regularly
5. **Monitor logs** for suspicious activity

## Need Help?

- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/docs
- Gmail App Passwords: https://support.google.com/accounts/answer/185833


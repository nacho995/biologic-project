# 🚀 Deployment Guide - Vercel & Render

## 📦 Vercel (Frontend)

### Environment Variables for Vercel:

```bash
# API Backend URL (your Render backend URL)
VITE_API_URL=https://your-backend-name.onrender.com
```

**Steps:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add the environment variable above in Settings → Environment Variables

---

## 🖥️ Render (Backend)

### Create PostgreSQL Database First:
1. Go to https://render.com
2. New → PostgreSQL
3. Name: `biologic-db`
4. Database: `biologic_db`
5. User: `postgres`
6. Region: Choose closest to your users
7. Instance Type: Free (or paid for production)
8. **Copy the "Internal Database URL"** after creation

### Create Web Service:
1. New → Web Service
2. Connect your GitHub repository
3. Root Directory: `backend`
4. Environment: **Docker**
5. Dockerfile Path: `Dockerfile.backend`
6. Instance Type: Free (or paid for production)

### Environment Variables for Render Backend:

```bash
# Database (use the Internal Database URL from your PostgreSQL)
DATABASE_URL=postgresql://postgres:password@dpg-xxxxx-a/biologic_db

# JWT Secret (generate a random 32+ character string)
# Use this command to generate: openssl rand -base64 32
JWT_SECRET=YOUR_RANDOM_32_CHARACTER_STRING_HERE

# Email Configuration (Gmail with App Password)
# To get App Password: https://myaccount.google.com/apppasswords
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# Frontend URL (your Vercel deployment URL)
FRONTEND_URL=https://your-app-name.vercel.app

# Server Configuration
PORT=5000
NODE_ENV=production
```

---

## 🔐 How to Generate Secure Secrets

### JWT Secret:
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Gmail App Password:
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Copy the 16-digit password
4. Use this in `EMAIL_PASS`

---

## 📝 Demo Users (Already Created)

After deployment, you can login with:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| worker@demo.com | demo123 | Worker |
| viewer@demo.com | demo123 | Viewer |

---

## ✅ Deployment Checklist

### Backend (Render):
- [ ] Create PostgreSQL database on Render
- [ ] Copy Internal Database URL
- [ ] Create Web Service with Docker
- [ ] Add all environment variables
- [ ] Wait for deployment (5-10 minutes)
- [ ] Test API: `https://your-backend.onrender.com/health`

### Frontend (Vercel):
- [ ] Import GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Add `VITE_API_URL` environment variable with your Render backend URL
- [ ] Deploy (2-3 minutes)
- [ ] Test login with demo users

### Final Steps:
- [ ] Update `FRONTEND_URL` in Render backend with your Vercel URL
- [ ] Redeploy backend on Render
- [ ] Test complete flow: Login → Upload Image → View Dashboard

---

## 🆘 Troubleshooting

### CORS Errors:
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Redeploy backend after updating `FRONTEND_URL`

### Email Not Sending:
- Verify Gmail App Password is correct
- Check that 2FA is enabled on your Google account
- App Passwords only work with 2FA enabled

### Database Connection Error:
- Use **Internal Database URL** (not External)
- Make sure PostgreSQL database is in the same region as backend

### Images Not Loading:
- Render Free tier restarts after inactivity
- Uploaded images are lost on restart
- Upgrade to paid tier or use S3/Cloudinary for persistence

---

## 📞 Support

For issues, check:
- Backend logs: Render Dashboard → Your Service → Logs
- Frontend logs: Browser Console (F12)
- Database: Render Dashboard → PostgreSQL → Connections


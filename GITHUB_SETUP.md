# GitHub Setup for CI/CD

This guide will help you configure GitHub Actions for automatic deployment to Vercel and Render.

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with authentication system"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/your-username/biologic-project.git

# Push to main branch
git push -u origin main
```

## Step 2: Get Vercel Credentials

### 2.1 Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions"
4. Click "Create"
5. **Copy the token** (you won't see it again!)

### 2.2 Get Vercel Org ID and Project ID

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
cd frontend
vercel link

# This will create a .vercel/project.json file
# Open it to see your Org ID and Project ID
cat .vercel/project.json
```

Example output:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Step 3: Get Render Deploy Hook

1. Go to https://dashboard.render.com/
2. Open your backend service
3. Go to "Settings" tab
4. Scroll to "Deploy Hook"
5. Click "Create Deploy Hook"
6. Copy the URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)

## Step 4: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each of these secrets:

### Required Secrets:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `VERCEL_TOKEN` | Your Vercel token | Step 2.1 |
| `VERCEL_ORG_ID` | Your Vercel org ID | Step 2.2 (from .vercel/project.json) |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Step 2.2 (from .vercel/project.json) |
| `RENDER_DEPLOY_HOOK` | Your Render deploy hook URL | Step 3 |
| `VITE_API_URL` | Your backend URL | https://your-backend.onrender.com |

### How to Add Each Secret:

For each secret above:
1. Click **"New repository secret"**
2. Enter the **Name** (e.g., `VERCEL_TOKEN`)
3. Enter the **Value** (paste the actual value)
4. Click **"Add secret"**

## Step 5: Test the CI/CD Pipeline

### Automatic Test (Recommended)

```bash
# Make a small change
echo "# Test CI/CD" >> README.md

# Commit and push
git add README.md
git commit -m "test: trigger CI/CD pipeline"
git push origin main
```

### Watch the Pipeline

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You should see a workflow running
4. Click on it to see the progress

Expected output:
```
✅ Backend Test
✅ Frontend Test  
✅ Deploy Production
   ✅ Deploy to Vercel (Frontend)
   ✅ Trigger Render Deploy (Backend)
```

## Step 6: Verify Deployment

### Check Frontend

```bash
# Open your Vercel URL
open https://your-app.vercel.app
```

You should see the login page.

### Check Backend

```bash
# Test backend health endpoint
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

## Troubleshooting

### Pipeline Fails at "Deploy to Vercel"

**Error**: `Error: No token found`

**Solution**:
- Verify `VERCEL_TOKEN` is correct
- Make sure you copied the entire token
- Try creating a new token

### Pipeline Fails at "Trigger Render Deploy"

**Error**: `404 Not Found`

**Solution**:
- Verify `RENDER_DEPLOY_HOOK` URL is correct
- Make sure the service is active on Render
- Check if the deploy hook is still valid (recreate if needed)

### Build Fails

**Error**: `Module not found` or `npm ERR!`

**Solution**:
```bash
# Update package-lock.json
cd backend
npm install
cd ../frontend
npm install

# Commit and push
git add .
git commit -m "fix: update package-lock.json"
git push
```

### Vercel Deployment Succeeds but App Shows Errors

**Solution**:
- Check if `VITE_API_URL` is set correctly in GitHub Secrets
- Go to Vercel dashboard → Your project → Settings → Environment Variables
- Add `VITE_API_URL` with your backend URL if not present
- Redeploy

## Advanced Configuration

### Deploy on Pull Requests (Preview Deployments)

The current workflow already supports preview deployments on PRs.

When you create a PR, it will:
- ✅ Run tests
- ✅ Build the app
- ❌ NOT deploy to production (safe!)

### Branch Protection Rules

Recommended settings:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### Notifications

Get notified of deployment status:

1. Go to **Settings** → **Notifications**
2. Enable **Actions** notifications
3. You'll get emails for:
   - ✅ Successful deployments
   - ❌ Failed deployments

## Workflow Summary

Here's what happens automatically:

```
1. You push code to GitHub
   ↓
2. GitHub Actions starts
   ↓
3. Runs tests (backend + frontend)
   ↓
4. Builds the application
   ↓
5. If tests pass and branch is 'main':
   ├─→ Deploys frontend to Vercel
   └─→ Triggers backend deploy on Render
   ↓
6. You get a notification
   ↓
7. Your app is live! 🎉
```

## Quick Reference

### Useful Commands

```bash
# Check GitHub Actions status
gh run list

# View logs of latest run
gh run view --log

# Manually trigger workflow
gh workflow run ci-cd.yml

# Check deployment status
vercel inspect https://your-app.vercel.app
```

### Important URLs

- GitHub Actions: `https://github.com/your-username/biologic-project/actions`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Render Dashboard: `https://dashboard.render.com/`
- Your App: `https://your-app.vercel.app`
- Your API: `https://your-backend.onrender.com`

## Next Steps

After successful deployment:

1. ✅ Test user registration
2. ✅ Test email verification
3. ✅ Test password reset
4. ✅ Upload sample TIFF images
5. ✅ Try all viewing modes
6. ✅ Check analytics dashboard

## Need Help?

- 📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide
- 🐛 [Open an Issue](https://github.com/your-username/biologic-project/issues) if something doesn't work
- 💬 Check [GitHub Actions docs](https://docs.github.com/en/actions) for workflow questions

---

**You're all set! Happy deploying! 🚀**


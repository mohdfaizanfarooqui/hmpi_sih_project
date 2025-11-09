# 🚀 Quick Start Guide - Deploy HMPI to Vercel

## Step 1: MongoDB Atlas Setup (5 minutes)

### Create Account & Cluster:
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (FREE - no credit card)
3. Click "Build a Database" → Choose **FREE** tier
4. Select region closest to you
5. Click "Create"

### Create User:
1. Username: `hmpi-admin`
2. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
3. Click "Create User"

### Allow Access:
1. Click "Add IP Address"
2. Click "Allow Access from Anywhere"
3. Click "Confirm"

### Get Connection String:
1. Click "Connect" → "Connect your application"
2. Copy the connection string
3. Replace `<password>` with your saved password
4. Add `/hmpi` before the `?`:
   ```
   mongodb+srv://hmpi-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hmpi?retryWrites=true&w=majority
   ```

## Step 2: Test Locally (Optional)

Create `server/.env`:
```
MONGODB_URI=mongodb+srv://hmpi-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hmpi?retryWrites=true&w=majority
```

Test:
```bash
cd server
npm start
```

Should see: "MongoDB connected successfully"

## Step 3: Deploy to Vercel

### Option A: CLI (Fastest)
```bash
npm install -g vercel
vercel login
vercel
```

When prompted for environment variables:
- Variable name: `MONGODB_URI`
- Value: Your MongoDB connection string

Then deploy to production:
```bash
vercel --prod
```

### Option B: GitHub + Vercel Dashboard

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hmpi-monitor.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repo
   - Add Environment Variable:
     - Name: `MONGODB_URI`
     - Value: Your connection string
   - Click "Deploy"

## Step 4: Done! 🎉

Your site will be live at:
```
https://your-project-name.vercel.app
```

## Troubleshooting

### "MongoDB connection error"
- Check your connection string
- Verify password (no spaces)
- Ensure IP whitelist includes 0.0.0.0/0

### "Module not found"
- Run `npm install` in server folder
- Redeploy

### Need Help?
Check detailed guides:
- `MONGODB_SETUP.md` - Detailed MongoDB setup
- `DEPLOYMENT.md` - Full deployment guide

## What's Next?

- Add custom domain in Vercel settings
- Monitor usage in MongoDB Atlas dashboard
- Share your site!

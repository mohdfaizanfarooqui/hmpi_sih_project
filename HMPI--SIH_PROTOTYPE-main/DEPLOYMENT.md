# Deploying HMPI to Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Fastest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **hmpi-monitor** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. Deploy to production:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub (Recommended for continuous deployment)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/hmpi-monitor.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect settings
6. Click "Deploy"

## Important Notes

### Database Setup (REQUIRED)
✅ **MongoDB Atlas Configured**: Your app now uses MongoDB Atlas for persistent storage.

**Before deploying, you MUST:**
1. Follow `MONGODB_SETUP.md` to create your free MongoDB Atlas cluster
2. Get your connection string
3. Add to Vercel environment variables

### Environment Variables (REQUIRED)
Add these in Vercel dashboard (Settings > Environment Variables):
- `MONGODB_URI` - Your MongoDB Atlas connection string
  - Example: `mongodb+srv://user:pass@cluster.mongodb.net/hmpi?retryWrites=true&w=majority`

## After Deployment

Your site will be live at:
- **Production**: `https://your-project-name.vercel.app`
- **API**: `https://your-project-name.vercel.app/api`

## Custom Domain (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

## Updating Your Site

### Via CLI:
```bash
vercel --prod
```

### Via GitHub:
Just push to your main branch - auto-deploys!

## Troubleshooting

- **Database not persisting**: Expected with SQLite on Vercel. Upgrade to cloud database.
- **API errors**: Check Vercel logs in dashboard
- **Build fails**: Check build logs for missing dependencies

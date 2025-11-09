# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free (no credit card required)
3. Verify your email

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (closest to you)
4. Cluster Name: `hmpi-cluster` (or any name)
5. Click "Create"

## Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hmpi-admin` (or your choice)
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Whitelist IP Address

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, use specific IPs
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string:
   ```
   mongodb+srv://hmpi-admin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name: `mongodb+srv://hmpi-admin:yourpassword@cluster.mongodb.net/hmpi?retryWrites=true&w=majority`

## Step 6: Configure Your Application

### For Local Development:

Create `server/.env` file:
```bash
MONGODB_URI=mongodb+srv://hmpi-admin:yourpassword@cluster.mongodb.net/hmpi?retryWrites=true&w=majority
PORT=3000
```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://hmpi-admin:yourpassword@cluster.mongodb.net/hmpi?retryWrites=true&w=majority`
4. Click "Save"

## Step 7: Test Connection

Restart your server:
```bash
cd server
npm install
npm start
```

You should see: "MongoDB connected successfully"

## Troubleshooting

### Connection Timeout
- Check Network Access whitelist
- Verify password (no special characters issues)
- Check firewall settings

### Authentication Failed
- Verify username and password
- Make sure user has correct permissions

### Database Not Found
- MongoDB creates database automatically on first write
- Just start using the API

## Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use environment variables** - Different for dev/prod
3. **Rotate passwords regularly**
4. **Restrict IP access** in production
5. **Use separate databases** for dev/staging/prod

## Free Tier Limits

- 512 MB storage
- Shared RAM
- No backups (upgrade for backups)
- Perfect for development and small projects

## Next Steps

Once configured:
1. Test API endpoints locally
2. Deploy to Vercel with environment variable
3. Your data will persist across deployments!

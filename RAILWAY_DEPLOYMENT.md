# Deploy Everything on Railway - Complete Guide

Railway can host your entire stack: Frontend (Next.js), Backend (NestJS), and Database (MySQL).

## 🚀 Quick Start

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository

### Step 3: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will create a MySQL database automatically
4. **Copy the connection details** (you'll need them for the backend)

### Step 4: Deploy Backend

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"** → Choose your repository again
3. **Configure the service:**
   - **Name**: `backend` (or `api`)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this!**
   - Railway will auto-detect Node.js from `package.json`
   - **Build Command**: (auto-detected) `npm install && npm run build`
   - **Start Command**: (auto-detected) `npm run start:prod`
   
   **Note**: If build fails, make sure:
   - Root Directory is set to `backend`
   - `backend/package.json` exists
   - `backend/nixpacks.toml` exists (already created)

5. **Add Environment Variables:**
   - Click on the backend service
   - Go to **"Variables"** tab
   - Add these variables:

   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   ```

   **Note**: Railway automatically provides MySQL connection variables. Use the `${{MySQL.VARIABLE}}` syntax to reference them.

6. **Generate Public URL:**
   - Click **"Settings"** → **"Generate Domain"**
   - Copy the URL (e.g., `https://your-backend.railway.app`)

### Step 5: Deploy Frontend

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"** → Choose your repository
3. **Configure the service:**
   - **Name**: `frontend`
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT: Set this!**
   - Railway will auto-detect Node.js from `package.json`
   - **Build Command**: (auto-detected) `npm install && npm run build`
   - **Start Command**: (auto-detected) `npm run start`
   
   **Note**: If build fails, make sure:
   - Root Directory is set to `frontend`
   - `frontend/package.json` exists
   - `frontend/nixpacks.toml` exists (already created)

4. **Add Environment Variables:**
   - Click on the frontend service
   - Go to **"Variables"** tab
   - Add:

   ```
   NEXT_PUBLIC_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
   NODE_ENV=production
   PORT=3001
   ```

   **Note**: `${{backend.RAILWAY_PUBLIC_DOMAIN}}` automatically references your backend's public URL.

5. **Generate Public URL:**
   - Click **"Settings"** → **"Generate Domain"**
   - Your frontend will be available at this URL!

## 📋 Environment Variables Summary

### Backend Service Variables:
```
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

### Frontend Service Variables:
```
NEXT_PUBLIC_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
PORT=3001
```

## 🔧 Railway-Specific Configuration

### Backend Configuration

Railway will automatically:
- Detect Node.js
- Run `npm install`
- Use the `start` script from `package.json`

Make sure your `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "build": "nest build"
  }
}
```

### Frontend Configuration

Railway will:
- Detect Next.js
- Run `npm install && npm run build`
- Use the `start` script

Make sure your `frontend/package.json` has:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p $PORT"
  }
}
```

## 🎯 Custom Domain (Optional)

1. In Railway, go to your service
2. Click **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Add your domain and follow DNS instructions

## 💰 Railway Pricing

- **Free Tier**: $5 credit/month (enough for small projects)
- **Hobby**: $5/month (after free tier)
- **Pro**: $20/month

## 🐛 Troubleshooting

### ❌ "npm: command not found" Error

**This is the most common error!** It means Railway can't find Node.js.

**Solution:**
1. **Check Root Directory** (CRITICAL!):
   - Go to your service → **Settings** → **Root Directory**
   - Backend must be: `backend`
   - Frontend must be: `frontend`
   - If it's empty or set to `.`, change it!

2. **Verify nixpacks.toml exists:**
   - `backend/nixpacks.toml` should exist
   - `frontend/nixpacks.toml` should exist
   - These files tell Railway to use Node.js

3. **Redeploy:**
   - After fixing Root Directory, click **"Redeploy"**
   - Or push a new commit to trigger auto-deploy

### Backend won't connect to database
- Check that MySQL service is running
- Verify environment variables use `${{MySQL.VARIABLE}}` syntax
- Check backend logs in Railway dashboard
- Ensure MySQL service is in the same project

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Use `${{backend.RAILWAY_PUBLIC_DOMAIN}}` for automatic reference
- Check CORS settings in backend
- Make sure backend has a public domain generated

### Build fails
- Check build logs in Railway
- Ensure all dependencies are in `package.json`
- Verify Root Directory is set correctly
- Check that `nixpacks.toml` files exist
- Verify Node.js version (Railway uses Node.js 20 via nixpacks.toml)

## 📊 Monitoring

Railway provides:
- Real-time logs for each service
- Metrics (CPU, memory, network)
- Deployment history
- Automatic deployments on git push

## ✅ After Deployment

1. Test your frontend URL
2. Test login/register functionality
3. Verify database connections
4. Check backend API endpoints

Your app is now live! 🎉


# Deployment Guide

## Architecture Overview

Your app has 3 parts:
1. **Frontend (Next.js)** → Can deploy on Vercel ✅
2. **Backend (NestJS)** → Needs Node.js server (Railway, Render, Fly.io)
3. **Database (MySQL)** → Needs database service (PlanetScale, Railway, or Docker)

## Option 1: Vercel (Frontend) + Railway (Backend + Database) - Recommended

### Frontend on Vercel

1. **Push to GitHub** (if not done)
2. **Go to Vercel**: https://vercel.com
3. **Import your GitHub repository**
4. **Configure**:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

### Backend + Database on Railway

1. **Go to Railway**: https://railway.app
2. **Create New Project**
3. **Add MySQL Service** (for database)
4. **Add Node.js Service** (for backend)
5. **Configure Backend**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment Variables:
     ```
     DB_HOST=your-mysql-host
     DB_PORT=3306
     DB_USERNAME=root
     DB_PASSWORD=your-password
     DB_DATABASE=budget_manager
     PORT=3000
     JWT_SECRET=your-secret-key-here
     ```

## Option 2: Vercel (Frontend) + Render (Backend) + PlanetScale (Database)

### Frontend on Vercel
Same as above.

### Backend on Render

1. **Go to Render**: https://render.com
2. **New Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment: Node

### Database on PlanetScale

1. **Go to PlanetScale**: https://planetscale.com
2. **Create database**
3. **Get connection string**
4. **Update backend environment variables**

## Option 3: All-in-One: Railway

Deploy everything on Railway:
- Frontend (Next.js)
- Backend (NestJS)
- Database (MySQL)

## Quick Setup for Vercel Frontend

### 1. Update frontend/.env.local (for local dev)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Create vercel.json (optional)
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install"
}
```

### 3. Deploy
- Connect GitHub repo to Vercel
- Set root directory to `frontend`
- Add environment variable: `NEXT_PUBLIC_API_URL`

## Important Notes

⚠️ **CORS Configuration**: Make sure your backend allows requests from your Vercel domain:
```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://your-app.vercel.app'
  ],
  credentials: true,
});
```

⚠️ **Environment Variables**: Never commit `.env` files. Set them in your hosting platform.

⚠️ **Database**: For production, use a managed database service, not Docker.

## Recommended Stack

- **Frontend**: Vercel (free tier available)
- **Backend**: Railway (free tier available) or Render
- **Database**: PlanetScale (free tier) or Railway MySQL


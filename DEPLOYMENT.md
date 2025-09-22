# Vercel Deployment Guide

This project has been successfully converted from Express.js to Vercel serverless functions.

## What was changed

### 1. API Routes Migration
- Moved all Express routes from `server/routes.ts` to individual Vercel API functions in `api/` directory
- Converted Express middleware to function-level authentication
- Changed from `NextApiRequest/NextApiResponse` to `VercelRequest/VercelResponse`

### 2. Directory Structure
```
api/
├── _lib/
│   └── auth-middleware.ts     # Shared JWT authentication
├── auth/
│   ├── signup.ts             # POST /api/auth/signup
│   ├── login.ts              # POST /api/auth/login
│   └── me.ts                 # GET /api/auth/me
├── dashboard/
│   └── stats.ts              # GET /api/dashboard/stats
├── crops/
│   ├── index.ts              # GET/POST /api/crops
│   └── [id].ts               # PUT/DELETE /api/crops/:id
├── fields/
│   └── index.ts              # GET/POST /api/fields
├── drones/
│   ├── index.ts              # GET/POST /api/drones
│   └── [id].ts               # PUT /api/drones/:id
├── health-records/
│   └── index.ts              # GET/POST /api/health-records
├── pesticide-applications/
│   ├── index.ts              # GET/POST /api/pesticide-applications
│   └── [id].ts               # PUT /api/pesticide-applications/:id
└── contact/
    └── index.ts              # POST /api/contact
```

### 3. Configuration Files
- `vercel.json`: Vercel deployment configuration
- Updated `package.json` build script to build client only
- Added `@vercel/node` dependency

## Deployment Steps

### 1. Environment Variables
Set these environment variables in your Vercel project:
```
SESSION_SECRET=your-jwt-secret-key
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### 3. Verify Deployment
After deployment, test these endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth header)
- `GET /api/dashboard/stats` - Dashboard statistics (requires auth)
- `GET /api/crops` - Get user's crops (requires auth)
- `POST /api/contact` - Contact form submission

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Frontend Integration
No changes needed to frontend code - all API endpoints remain the same paths and functionality.

## Storage
The project uses in-memory storage (MemStorage) which will reset on each serverless function cold start. For production, consider migrating to a persistent database solution like PostgreSQL with Drizzle ORM (already configured in the project).

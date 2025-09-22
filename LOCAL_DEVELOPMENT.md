# Local Development Guide

This guide will help you run the project locally after the Vercel conversion.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **Vercel CLI** (installed globally)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env.local` file in the project root:
```bash
# Copy and paste this into .env.local
SESSION_SECRET=local-development-jwt-secret-key-change-in-production
NODE_ENV=development
```

### 3. Start Development Server
```bash
# This will start both the client (Vite) and API (Vercel dev) simultaneously
npm run dev
```

This command runs:
- **Frontend**: `http://localhost:5173` (Vite dev server)
- **API**: `http://localhost:3001` (Express dev server)

## Alternative Development Methods

### Option 1: Run Client and API Separately

**Terminal 1 - Start the client:**
```bash
npm run dev:client
# Frontend will run on http://localhost:5173
```

**Terminal 2 - Start the API:**
```bash
npm run dev:api
# API will run on http://localhost:3000
```

### Option 2: API Only (if frontend is already built)
```bash
npm start
# This runs 'vercel dev' which serves both built frontend and API
```

## Testing the API Locally

Once running, you can test the API endpoints:

### Authentication Endpoints
```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get current user (replace TOKEN with the JWT from login)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Other Endpoints (require authentication)
```bash
# Get dashboard stats
curl -X GET http://localhost:3001/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Get crops
curl -X GET http://localhost:3001/api/crops \
  -H "Authorization: Bearer TOKEN"

# Contact form (no auth required)
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Test message"}'
```

## Frontend Integration

The frontend should automatically connect to the local API. Make sure your frontend API calls point to:
- Development: `http://localhost:3000/api/...`
- Or use relative URLs: `/api/...` (recommended)

## Troubleshooting

### Port Conflicts
If port 3000 is in use, Vercel will automatically use the next available port. Check the terminal output for the actual port.

### Environment Variables Not Loading
Make sure your `.env.local` file is in the project root and contains:
```
SESSION_SECRET=your-secret-key
```

### API Routes Not Found
Ensure the `api/` directory structure is correct and all files export a default function.

### CORS Issues
If you encounter CORS issues, the API functions may need CORS headers. This is typically handled by Vercel automatically in development.

## Development Workflow

1. **Make API changes**: Edit files in the `api/` directory
2. **Make frontend changes**: Edit files in the `client/src/` directory
3. **Both will hot-reload automatically**

## Building for Production

```bash
# Build the client
npm run build

# Test production build locally
vercel dev --prod
```

## Database Development

Currently using in-memory storage. For persistent data during development:

1. Set up a local PostgreSQL database
2. Update the connection string in your environment variables
3. The Drizzle ORM schema is already configured in `shared/schema.ts`

## Next Steps

- Test all API endpoints with your frontend
- Set up a persistent database for development
- Configure any additional environment variables needed

# Render Deployment Guide

This guide will help you deploy the AgriSmart application to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub (already done)

## Deployment Steps

### 1. Connect GitHub Repository

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub account if not already connected
4. Select the repository: `rishavafk/KisanBuddy`

### 2. Configure the Web Service

Use these settings:

- **Name**: `agrismart-app` (or any name you prefer)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free` (or upgrade if needed)

### 3. Environment Variables

Add these environment variables in the Render dashboard:

- `NODE_ENV`: `production`
- `SESSION_SECRET`: Generate a secure random string (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `PORT`: `3000` (Render will set this automatically, but it's good to have)

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Deploy it

### 5. Access Your Application

Once deployed, you'll get a URL like: `https://agrismart-app.onrender.com`

## Features Available After Deployment

- ✅ User authentication (login/signup)
- ✅ Dashboard with statistics
- ✅ Drone connection management
- ✅ Field mapping and management
- ✅ Plant health monitoring
- ✅ Pesticide application tracking

## Default Login Credentials

- **Username**: `farmer1`
- **Password**: `password123`

## Troubleshooting

### Build Issues
- Ensure all dependencies are in `package.json`
- Check that the build command completes successfully
- Verify Node.js version compatibility

### Runtime Issues
- Check environment variables are set correctly
- Verify the start command is correct
- Check Render logs for error messages

### Database
- Currently using in-memory storage
- For production, consider setting up a PostgreSQL database
- Update the connection string in environment variables

## Custom Domain (Optional)

1. Go to your service settings in Render
2. Click "Custom Domains"
3. Add your domain and configure DNS settings

## Monitoring

- View logs in the Render dashboard
- Monitor performance and usage
- Set up alerts for downtime

## Scaling

- Free plan has limitations
- Upgrade to paid plans for better performance
- Consider using Render's database services for production

## Security Notes

- Change the default `SESSION_SECRET` in production
- Use HTTPS (automatically provided by Render)
- Consider implementing rate limiting
- Add input validation and sanitization

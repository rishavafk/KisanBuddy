#!/bin/bash

echo "🚀 KisanBuddy Vercel Deployment Script"
echo "======================================"

# Check if logged in to Vercel
echo "📋 Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Vercel authentication confirmed"

# Check if SESSION_SECRET environment variable exists
echo "🔐 Checking environment variables..."
if ! vercel env ls | grep -q "SESSION_SECRET"; then
    echo "⚠️  SESSION_SECRET not found. Setting up environment variable..."
    echo "Please enter a secure random string for SESSION_SECRET:"
    echo "💡 You can generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    vercel env add SESSION_SECRET
else
    echo "✅ SESSION_SECRET environment variable exists"
fi

# Build and deploy
echo "🏗️  Building and deploying to production..."
vercel --prod

echo "🎉 Deployment complete!"
echo "📱 Your app should be available at your Vercel domain"
echo "🔗 Check your deployment at: https://vercel.com/dashboard"


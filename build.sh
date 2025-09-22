#!/bin/bash

echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Check if client directory exists
if [ ! -d "client" ]; then
    echo "Error: client directory not found!"
    ls -la
    exit 1
fi

# Install client dependencies and build
echo "Installing client dependencies..."
cd client
npm install

echo "Building client..."
npx vite build

# Go back to root
cd ..

echo "Build completed successfully!"

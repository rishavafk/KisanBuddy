#!/bin/bash

# Install root dependencies
npm install

# Install client dependencies and build
cd client
npm install
npx vite build

# Go back to root
cd ..

echo "Build completed successfully!"

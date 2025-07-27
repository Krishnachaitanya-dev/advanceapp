
#!/bin/bash

# Build script for Netlify deployment
echo "Building Advancewashing app for Netlify deployment..."

# Clean previous build
rm -rf dist

# Install dependencies
npm ci

# Build the project
npm run build

echo "Build completed! The 'dist' folder is ready for Netlify deployment."
echo "You can now upload the 'dist' folder contents to Netlify."

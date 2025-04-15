#!/bin/bash
# Deployment script for alwaysdata.com

echo "Starting deployment process for alwaysdata.com..."

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
  echo "Creating data directory..."
  mkdir -p data
  chmod 755 data
  echo "Data directory created."
else
  echo "Data directory already exists."
fi

# Install dependencies
echo "Installing dependencies..."
npm install
echo "Dependencies installed."

# Build the application
echo "Building application..."
npm run build
echo "Build completed."

# Print success message
echo "Deployment preparation complete!"
echo "Please make sure your site is configured with the following settings in alwaysdata.com dashboard:"
echo "- Command: node dist/index.js"
echo "- Working directory: your current directory"
echo "- Environment variables: NODE_ENV=production"
echo ""
echo "Your application should be ready to start on alwaysdata.com!"
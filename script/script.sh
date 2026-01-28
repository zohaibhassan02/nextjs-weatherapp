#!/bin/bash

set -e
set -o pipefail

GIT_REPO="https://github.com/k8snative/nextjs-weatherapp.git"
WORKDIR="nextjs-weatherapp"

# Remove existing directory if present
[ -d "$WORKDIR" ] && rm -rf "$WORKDIR"

# Clone the repository
git clone "$GIT_REPO"

# Copy environment variables
cp .env.local "$WORKDIR"

# Enter the working directory
cd "$WORKDIR"

# Add Node.js to PATH (adjust path if needed)
export PATH="/home/ubuntu/.nvm/versions/node/v20.19.1/bin:$PATH"

# Install dependencies
npm install

# Install PM2 globally if not already installed
command -v pm2 >/dev/null 2>&1 || npm install -g pm2

# Build the application
npm run build

# Start or restart the app with PM2
if pm2 describe weather-app > /dev/null 2>&1; then
    echo "Process 'weather-app' already exists. Restarting it..."
    pm2 restart weather-app
else
    echo "Starting 'weather-app' with PM2..."
    pm2 start npm --name "weather-app" -- start
fi

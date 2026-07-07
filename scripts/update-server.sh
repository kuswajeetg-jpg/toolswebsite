#!/bin/bash
set -e

# Configuration
PROJECT_DIR="/var/www/toolswebsite"

echo "=========================================================="
echo "      Smart Document Tools Auto-Update Script"
echo "=========================================================="
echo ""

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Error: Project directory $PROJECT_DIR does not exist."
  exit 1
fi

cd "$PROJECT_DIR"

echo "--> 1. Pulling latest changes from Git..."
# Clean local changes just in case, but usually not needed
git reset --hard
git pull

echo ""
echo "--> 2. Installing npm packages..."
npm install

echo ""
echo "--> 3. Updating Database Schema..."
npx prisma db push

echo "--> 3.5 Stopping PM2 process to free memory..."
pm2 stop toolswebsite || true

echo ""
echo "--> 4. Building Next.js application..."
NODE_OPTIONS="--max-old-space-size=512" npm run build

echo ""
echo "--> 5. Starting PM2 process..."
pm2 start toolswebsite || pm2 start npm --name "toolswebsite" -- start

echo ""
echo "=========================================================="
echo " Update Completed Successfully!"
echo " PM2 Status:"
pm2 status
echo "=========================================================="

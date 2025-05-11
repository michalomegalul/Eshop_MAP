#!/bin/bash
# Deployment script for pagination fixes

set -e

cd /home/michal/cum/Eshop_MAP

echo "Deploying pagination fixes to frontend..."

# Check if the frontend directory exists
if [ ! -d "frontend" ]; then
    echo "Error: frontend directory not found!"
    exit 1
fi

# Make a backup of modified files
echo "Backing up files..."
cp -f frontend/src/services/api.ts frontend/src/services/api.ts.bak
cp -f tests/startup_products.py tests/startup_products.py.bak

echo "Applying pagination fixes..."
# Apply the updated files
# The api.ts and startup_products.py should already be modified by this point

# Build and restart the frontend
cd frontend
echo "Building frontend..."
npm run build

echo "Restarting services..."
# Add any service restart commands here if needed
# For example: systemctl restart nginx

echo "Pagination fixes deployed successfully!"

cd ..
echo "Done!"

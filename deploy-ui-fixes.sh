#!/bin/bash
# Script to deploy UI fixes for the Dieselpower e-commerce application

set -e

cd /home/michal/cum/Eshop_MAP

echo "===== Deploying UI fixes to Dieselpower e-commerce app ====="

# Make backups of modified files
echo "Creating backups..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/ui_fixes_$TIMESTAMP"
mkdir -p $BACKUP_DIR

cp -f frontend/src/components/Layout.tsx $BACKUP_DIR/
cp -f frontend/src/pages/HomePage.tsx $BACKUP_DIR/
cp -f frontend/src/pages/ProductDetailPage.tsx $BACKUP_DIR/
cp -f frontend/src/services/api.ts $BACKUP_DIR/

echo "===== Building frontend with fixes ====="
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building frontend..."
npm run build

echo "===== Restarting services ====="
cd ..

# You may need to adjust these commands based on your deployment setup
if [ -f "docker-compose.yml" ]; then
  echo "Restarting Docker containers..."
  docker-compose down frontend || true
  docker-compose up -d frontend
else
  echo "Please restart your frontend service manually"
fi

echo "===== UI fixes deployed successfully! ====="
echo "Done!"

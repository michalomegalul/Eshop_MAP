#!/bin/bash

echo "🚀 Deploying token refresh logic fixes..."
cd /home/michal/cum/Eshop_MAP

echo "🔄 Rebuilding the frontend to apply the changes..."
cd frontend
npm run build

echo "📂 Ensuring public assets are available in dist..."
if [ ! -f "dist/logo-placeholder.svg" ] && [ -f "public/logo-placeholder.svg" ]; then
  echo "📋 Copying public assets to dist directory..."
  cp -r public/* dist/
fi

echo "🐳 Rebuilding and restarting Docker containers..."
cd ..
docker-compose down
docker-compose up -d --build

echo "✅ Token refresh logic fixes deployed successfully!"
echo "🔍 The application will now avoid unnecessary refresh token attempts when users aren't logged in."

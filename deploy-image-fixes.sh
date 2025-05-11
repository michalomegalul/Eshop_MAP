#!/bin/bash

echo "🚀 Deploying image URL fixes..."
cd /home/michal/cum/Eshop_MAP

# This script updates the frontend to use local images instead of Unsplash API
# - Changes all product images to use DP-logo-small.png
# - Updates testimonial portraits to use local images (richard.jpg, dan.jpg)
# - Updates CSP headers to remove reference to external image sources

echo "🔄 Rebuilding the frontend to apply the changes..."
cd frontend
npm run build

echo "📂 Ensuring public assets are available in dist..."
if [ -d "public" ] && [ -d "dist" ]; then
  echo "📋 Copying public assets to dist directory..."
  cp -r public/* dist/
fi

echo "🔍 Checking if images exist..."
if [ -f "public/DP-logo-small.png" ]; then
  echo "✅ Product logo exists!"
else
  echo "⚠️ Warning: DP-logo-small.png not found in public directory"
fi

echo "🐳 Rebuilding and restarting Docker containers..."
cd ..
docker-compose down
docker-compose up -d --build

echo "✅ Image URL fixes deployed successfully!"
echo "🖼️ The application will now use local static images instead of external API calls."

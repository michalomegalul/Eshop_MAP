#!/bin/bash

# Script to troubleshoot static asset issues in the Dieselpower frontend

echo "🔍 Starting asset troubleshooting for Dieselpower frontend..."

# 1. Check if frontend container is running
echo "Checking if frontend container is running..."
if docker-compose ps | grep -q "frontend.*Up"; then
  echo "✅ Frontend container is running"
  CONTAINER_ID=$(docker-compose ps -q frontend)
else
  echo "❌ Frontend container is NOT running"
  echo "Starting the frontend container..."
  docker-compose up -d frontend
  sleep 5
  CONTAINER_ID=$(docker-compose ps -q frontend)
  if [ -z "$CONTAINER_ID" ]; then
    echo "❌ Failed to start frontend container"
    exit 1
  fi
fi

# 2. Check if assets directory exists in nginx html directory
echo "Checking for assets directory in container..."
if docker exec $CONTAINER_ID ls -la /usr/share/nginx/html/assets > /dev/null 2>&1; then
  echo "✅ Assets directory exists in container"
  echo "Assets in container:"
  docker exec $CONTAINER_ID ls -la /usr/share/nginx/html/assets
else
  echo "❌ Assets directory does NOT exist in nginx html directory!"
  echo "Checking build directory for assets..."
  if [ -d "./frontend/dist/assets" ]; then
    echo "✅ Assets directory found in build directory"
    echo "Contents of build assets:"
    ls -la ./frontend/dist/assets
  else
    echo "❌ Assets directory not found in build directory either!"
    echo "The build process may have failed or the directory structure is incorrect."
  fi
fi

# 3. Check if public files exist
echo "Checking for public files in container..."
if docker exec $CONTAINER_ID ls -la /usr/share/nginx/html/logo-placeholder.svg > /dev/null 2>&1; then
  echo "✅ Public files exist in container"
else
  echo "❌ Public files are NOT in the nginx html directory!"
  echo "Checking the source public directory..."
  if [ -f "./frontend/public/logo-placeholder.svg" ]; then
    echo "✅ Public files found in source directory. They need to be copied to the build."
  else
    echo "❌ Public files not found in source directory either!"
  fi
fi

# 4. Check nginx configuration
echo "Checking nginx configuration in container..."
docker exec $CONTAINER_ID nginx -t

# 5. Check nginx logs for any errors
echo "Checking nginx logs for errors..."
docker exec $CONTAINER_ID tail -n 50 /var/log/nginx/error.log

echo ""
echo "📋 Recommended next steps:"
echo "1. Make sure the frontend/build-and-deploy.sh script copies public files to dist"
echo "2. Rebuild the frontend container with: docker-compose build frontend"
echo "3. Restart the container: docker-compose up -d frontend"
echo "4. Check the frontend at https://dobsinskym.com"
echo ""
echo "If issues persist, try clearing the browser cache or use incognito mode."

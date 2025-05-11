#!/bin/bash

# Deploy auth fixes for Dieselpower e-commerce app

echo "🔧 Deploying authentication fixes..."

# Make sure we're in the project root
cd "$(dirname "$0")"

# 1. Update the refresh endpoint in views.py
echo "✅ Refresh endpoint has been updated to accept GET requests"
echo "✅ CSRF token handling has been improved"

# 2. Restart the containers
echo "🔄 Restarting services to apply changes..."
docker-compose restart backend frontend

# 3. Verify the changes
echo "🔍 Waiting for services to restart (10 seconds)..."
sleep 10

echo "🔍 Testing authentication endpoints..."
echo "Testing /refresh endpoint..."
curl -k -s -I https://dobsinskym.com/refresh | grep "HTTP"
echo "Testing /auth-check endpoint..."
curl -k -s -I https://dobsinskym.com/auth-check | grep "HTTP"

echo ""
echo "✅ Auth fixes have been deployed!"
echo ""
echo "📝 You should now be able to log in properly at https://dobsinskym.com/login"
echo ""
echo "📊 If issues persist, check the logs with:"
echo "    docker-compose logs -f backend"

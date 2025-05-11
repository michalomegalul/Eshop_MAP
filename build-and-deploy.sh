#!/bin/bash

# Build and deploy script for Dieselpower e-commerce application

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting build and deployment process for Dieselpower..."

# Make sure we're in the project root
cd "$(dirname "$0")"

# 1. Check if SSL certificates exist
echo "📄 Checking SSL certificates..."
mkdir -p ssl
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
  echo "ℹ️ SSL certificates not found in the ssl/ directory."
  echo "   Checking /etc/letsencrypt for certificates..."
  
  if [ -f "/etc/letsencrypt/live/dobsinskym.com/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/dobsinskym.com/privkey.pem" ]; then
    echo "✅ Found certificates in letsencrypt directory, copying them..."
    cp /etc/letsencrypt/live/dobsinskym.com/fullchain.pem ssl/
    cp /etc/letsencrypt/live/dobsinskym.com/privkey.pem ssl/
    chmod 644 ssl/*.pem
  else
    echo "❌ SSL certificates not found. Please ensure they are in ssl/ directory or in /etc/letsencrypt/live/dobsinskym.com/"
    exit 1
  fi
else
  echo "✅ SSL certificates found in ssl/ directory."
fi

# 2. Update server_name in nginx configs
echo "🛠️ Updating Nginx configurations with domain name..."
sed -i 's/server_name localhost;/server_name dobsinskym.com www.dobsinskym.com;/g' frontend/nginx.conf
sed -i 's/server_name localhost;/server_name dobsinskym.com www.dobsinskym.com;/g' nginx.conf

# 3. Fix the backend Flask app
echo "🔧 Fixing Flask app initialization..."
if grep -q "CCORS" ./app/__init__.py; then
  echo "⚠️ Found 'CCORS' typo in __init__.py, fixing..."
  sed -i 's/CCORS/CORS/g' ./app/__init__.py
fi

# Check if app is properly initialized
if ! grep -q "app = Flask(__name__)" ./app/__init__.py; then
  echo "⚠️ Flask app not properly initialized, fixing..."
  sed -i 's/def create_app():/def create_app():\n    app = Flask(__name__)/g' ./app/__init__.py
fi

# 4. Fix TypeScript configuration
echo "🔧 Setting TypeScript configuration for compatibility..."
if grep -q '"verbatimModuleSyntax": true' ./frontend/tsconfig.app.json; then
  echo "⚠️ Found verbatimModuleSyntax: true, setting to false..."
  sed -i 's/"verbatimModuleSyntax": true/"verbatimModuleSyntax": false/g' ./frontend/tsconfig.app.json
fi

# 5. Build the frontend
echo "🏗️ Building the frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Build the frontend
echo "🔨 Building the frontend application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Frontend build failed!"
  exit 1
else
  echo "✅ Frontend built successfully."
fi

# Make sure public assets are available in dist
if [ ! -f "dist/logo-placeholder.svg" ] && [ -f "public/logo-placeholder.svg" ]; then
  echo "📂 Copying public assets to dist directory..."
  cp -r public/* dist/
fi

cd ..

# 4. Build and start Docker containers
echo "🐳 Building Docker containers..."
docker-compose build

echo "🚢 Starting Docker containers..."
docker-compose up -d

# 5. Verify the deployment
echo "🔍 Verifying the deployment..."
sleep 10  # Give containers time to start

# Check if containers are running
docker_status=$(docker-compose ps)
echo "📊 Container status:"
echo "$docker_status"

# Check if website is accessible
echo "🌐 Testing website accessibility..."
if curl -k -s --head https://dobsinskym.com | grep "200 OK" > /dev/null; then
  echo "✅ Website is accessible over HTTPS!"
else
  echo "⚠️ Website might not be accessible, please check logs."
  echo "   Running docker-compose logs for troubleshooting:"
  docker-compose logs nginx
fi

echo "🎉 Deployment process completed!"
echo ""
echo "📝 Next steps:"
echo "1. Visit your website at https://dobsinskym.com"
echo "2. Check for any errors in the logs with: docker-compose logs -f"
echo "3. If you encounter issues, run: docker-compose down && docker-compose up -d"
echo ""
echo "🔒 Your secure e-commerce site is ready!"

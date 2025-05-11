#!/bin/bash

# This script verifies that SSL certificates are properly configured in Docker containers

echo "===== SSL Certificate Deployment Verification ====="

# Check if the ssl directory exists and contains certificates
echo -n "Checking for SSL certificates in ./ssl directory: "
if [ -d "./ssl" ] && [ -f "./ssl/fullchain.pem" ] && [ -f "./ssl/privkey.pem" ]; then
  echo "FOUND"
  echo "  - fullchain.pem: $(stat -c %s ./ssl/fullchain.pem) bytes"
  echo "  - privkey.pem: $(stat -c %s ./ssl/privkey.pem) bytes"
else
  echo "MISSING"
  echo "  ERROR: SSL certificates not found in ./ssl directory!"
  echo "  Please ensure you have fullchain.pem and privkey.pem in the ./ssl directory."
  exit 1
fi

# Check nginx configuration for SSL
echo -e "\nChecking nginx.conf for SSL configuration:"
if grep -q "ssl_certificate" ./nginx.conf; then
  echo "  - SSL certificate path configured in nginx.conf: OK"
else
  echo "  - SSL certificate path not found in nginx.conf: WARNING"
fi

# Check if nginx container can access the certificates
echo -e "\nChecking if nginx container can access SSL certificates:"
echo "  - Starting a test container to verify certificate access..."
if docker run --rm -v $(pwd)/ssl:/etc/nginx/ssl:ro nginx:alpine ls -la /etc/nginx/ssl; then
  echo "  - Certificate volume mount test: SUCCESS"
else
  echo "  - Certificate volume mount test: FAILED"
  echo "  ERROR: Docker cannot mount or access the certificate files."
  exit 1
fi

echo -e "\n===== SSL Certificate Information ====="
docker run --rm -v $(pwd)/ssl:/etc/nginx/ssl:ro nginx:alpine sh -c "cat /etc/nginx/ssl/fullchain.pem | openssl x509 -noout -text | grep -A2 'Validity' -B1"
echo -e "\nIssued by:"
docker run --rm -v $(pwd)/ssl:/etc/nginx/ssl:ro nginx:alpine sh -c "cat /etc/nginx/ssl/fullchain.pem | openssl x509 -noout -issuer"

echo -e "\n===== SSL Deployment Check Complete ====="
echo "Your SSL certificates appear to be properly configured for deployment."
echo "Once deployed, you can run ./ssl-check.sh to verify the live certificate."

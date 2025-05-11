#!/bin/bash

# SSL Certificate Status Check Script
# This script checks the SSL certificate configuration for your site

# Set your domain name
DOMAIN="dobsinskym.com"

echo "===== SSL Certificate Status Check for $DOMAIN ====="

# Check expiration date
echo -n "Checking SSL certificate expiration: "
EXPIRATION=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)

if [ -n "$EXPIRATION" ]; then
  echo "Certificate expires on: $EXPIRATION"
  
  # Convert to seconds since epoch
  EXPIRY_DATE=$(date -d "$EXPIRATION" +%s)
  CURRENT_DATE=$(date +%s)
  DAYS_LEFT=$(( ($EXPIRY_DATE - $CURRENT_DATE) / 86400 ))
  
  echo "$DAYS_LEFT days remaining until expiration"
  
  if [ $DAYS_LEFT -lt 30 ]; then
    echo "WARNING: Certificate expires in less than 30 days!"
  fi
else
  echo "Failed to retrieve certificate expiration"
fi

# Check SSL protocols and cipher
echo -e "\n=== Testing SSL Protocol Support ==="
for PROTOCOL in ssl2 ssl3 tls1 tls1_1 tls1_2 tls1_3; do
  echo -n "Testing $PROTOCOL: "
  RESULT=$(timeout 3s openssl s_client -$PROTOCOL -connect $DOMAIN:443 2>&1 </dev/null)
  if echo "$RESULT" | grep -q "Secure Renegotiation" ; then
    echo "Supported (CAUTION: VERIFY THIS IS INTENDED)"
  else
    echo "Not supported"
  fi
done

# Check HSTS
echo -e "\n=== Checking HSTS (HTTP Strict Transport Security) ==="
curl -s -D- https://$DOMAIN | grep -i strict-transport-security

# Check SSL certificate information
echo -e "\n=== Certificate Information ==="
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -text | grep -A2 "Authority Information" -B2

echo -e "\n=== Checking for Common SSL Issues ==="

# Check for Heartbleed vulnerability
echo -n "Heartbleed vulnerability check: "
OUTPUT=$(echo "Q" | timeout 3s openssl s_client -connect $DOMAIN:443 -tlsextdebug 2>&1 | grep "TLS server extension \"heartbeat\"")
if [ -z "$OUTPUT" ]; then
  echo "Not vulnerable (or heartbeat extension not enabled)"
else
  echo "WARNING: Heartbeat extension is enabled. Further testing recommended."
fi

# Check for TLS compression (CRIME vulnerability)
echo -n "CRIME vulnerability check (TLS compression): "
CRIME=$(echo | openssl s_client -connect $DOMAIN:443 2>&1 | grep -i "Compression:")
echo "$CRIME"

echo -e "\n=== Security Headers Check ==="
curl -s -I https://$DOMAIN | grep -E 'Content-Security-Policy:|X-Frame-Options:|X-XSS-Protection:|X-Content-Type-Options:|Referrer-Policy:'

echo -e "\nSSL certificate check complete!"

#!/bin/bash

# This script sets up the initial Let's Encrypt certificates for your domain
# Based on https://github.com/wmnnd/nginx-certbot

# Variables that you might want to modify
domains=(dobsinskym.com www.dobsinskym.com)
rsa_key_size=4096
email="your-email@example.com" # Adding a valid address is recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

# Automatically create the necessary directories
mkdir -p ./certbot/www
mkdir -p ./certbot/conf/live/$domains

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p ./certbot/conf/live/$domains
mkdir -p ./certbot/www

# Create dummy certificate
openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
  -keyout ./certbot/conf/live/$domains/privkey.pem \
  -out ./certbot/conf/live/$domains/fullchain.pem \
  -subj "/CN=localhost"

echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot

echo "### Requesting Let's Encrypt certificate for $domains ..."
# Join $domains to -d arguments
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot

echo "### Reloading nginx ..."
docker-compose exec nginx nginx -s reload

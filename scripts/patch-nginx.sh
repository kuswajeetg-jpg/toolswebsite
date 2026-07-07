#!/bin/bash
set -e

CONFIG_FILE="/etc/nginx/sites-available/toolswebsite"

echo "--> Patching Nginx configuration file..."

# Create a clean configuration for port 80 with acme-challenge path
cat << 'EOF' > "$CONFIG_FILE"
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name valuehostings.site www.valuehostings.site;

    # Serve Let's Encrypt validation files locally
    location /.well-known/acme-challenge/ {
        root /var/www/toolswebsite/public;
    }

    # Fallback proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name valuehostings.site www.valuehostings.site;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # Serve Let's Encrypt validation files locally
    location /.well-known/acme-challenge/ {
        root /var/www/toolswebsite/public;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

echo "--> Testing Nginx configuration..."
nginx -t

echo "--> Reloading Nginx..."
systemctl restart nginx

echo "--> Nginx patched successfully!"

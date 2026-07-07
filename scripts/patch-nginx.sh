#!/bin/bash
set -e

CONFIG_FILE="/etc/nginx/sites-available/toolswebsite"

echo "--> Patching Nginx configuration file..."

# Create the directory under /var/www/html and set permissions
mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html/.well-known

# Create a clean configuration for port 80 with acme-challenge path
cat << 'EOF' > "$CONFIG_FILE"
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name valuehostings.site www.valuehostings.site;

    # Serve Let's Encrypt validation files locally from public html
    location /.well-known/acme-challenge/ {
        root /var/www/html;
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

    # Serve Let's Encrypt validation files locally from public html
    location /.well-known/acme-challenge/ {
        root /var/www/html;
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

echo "--> Symlinking site configuration to sites-enabled..."
ln -sf /etc/nginx/sites-available/toolswebsite /etc/nginx/sites-enabled/toolswebsite

echo "--> Testing Nginx configuration..."
nginx -t

echo "--> Reloading Nginx..."
systemctl restart nginx

echo "--> Nginx patched and enabled successfully!"

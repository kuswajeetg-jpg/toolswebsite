#!/bin/bash
set -e

# Configuration
PROJECT_DIR="/var/www/toolswebsite"

echo "=========================================================="
echo "      Smart Document Tools Auto-Deployment Script"
echo "=========================================================="
echo ""

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (sudo)."
  exit 1
fi

# Set up Swap Memory to handle Next.js builds on low memory (1GB) VPS instances
echo ""
echo "--> Setting up Swap Memory (for low RAM instances)..."
if [ ! -f /swapfile ]; then
  (fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048) && \
  chmod 600 /swapfile && \
  mkswap /swapfile && \
  (swapon /swapfile || true) && \
  (echo '/swapfile none swap sw 0 0' >> /etc/fstab || true)
  echo "Swap setup completed (or skipped if not permitted by container host)."
else
  echo "Swap file already exists."
fi


# Ask for domain
read -p "Enter your domain name (e.g., example.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
  echo "Domain is required."
  exit 1
fi

# Ask for Git Repository
read -p "Enter your GitHub Repository HTTPS URL: " GIT_REPO
if [ -z "$GIT_REPO" ]; then
  echo "Git repository URL is required."
  exit 1
fi

echo ""
echo "--> 1. Updating system packages..."
apt update && apt upgrade -y

echo ""
echo "--> 2. Installing Curl, Git, and Build Essentials..."
apt install -y curl git build-essential

echo ""
echo "--> 3. Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo ""
echo "--> 4. Installing Nginx, Certbot, and PM2..."
apt install -y nginx certbot python3-certbot-nginx
npm install -g pm2

echo ""
echo "--> 5. Cloning repository to $PROJECT_DIR..."
rm -rf "$PROJECT_DIR"
git clone "$GIT_REPO" "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo ""
echo "--> 6. Setting up environment variables..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="https://$DOMAIN"

read -p "Enter Google AdSense Client ID (press enter to keep default): " ADSENSE_ID
ADSENSE_ID=${ADSENSE_ID:-"ca-pub-XXXXXXXXXXXXXXXX"}

read -p "Enter Exchange Rate API Key (press enter to keep default): " EXCHANGE_KEY
EXCHANGE_KEY=${EXCHANGE_KEY:-"YOUR_FREE_EXCHANGE_RATE_API_KEY"}

cat <<EOF > .env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="$NEXTAUTH_URL"
NEXT_PUBLIC_ADSENSE_CLIENT_ID="$ADSENSE_ID"
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY="$EXCHANGE_KEY"
EOF
echo ".env file created successfully."

echo ""
echo "--> 7. Installing npm packages..."
npm install

echo ""
echo "--> 8. Initializing database..."
npx prisma db push

echo ""
echo "--> 9. Building the Next.js application..."
npm run build

echo ""
echo "--> 10. Starting application with PM2..."
pm2 delete toolswebsite || true
pm2 start npm --name "toolswebsite" -- start
pm2 startup
pm2 save

echo ""
echo "--> 11. Configuring Nginx Reverse Proxy..."
NGINX_CONF="/etc/nginx/sites-available/toolswebsite"

cat <<EOF > "$NGINX_CONF"
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo ""
echo "--> 12. Securing with SSL (Let's Encrypt Certbot)..."
echo "Make sure your domain ($DOMAIN) DNS A records point to this server IP before running SSL setup!"
read -p "Would you like to configure SSL now? (y/n): " RUN_SSL
if [ "$RUN_SSL" = "y" ] || [ "$RUN_SSL" = "Y" ]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN"
  systemctl restart nginx
fi

echo "=========================================================="
echo " Deployment Complete!"
echo " PM2 Status:"
pm2 status
echo "=========================================================="

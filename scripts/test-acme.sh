#!/bin/bash
set -e

DIR="/var/www/toolswebsite/public/.well-known/acme-challenge"
mkdir -p "$DIR"
echo "acme-test-content" > "$DIR/test.txt"
chmod -R 755 /var/www/toolswebsite/public/.well-known

echo "--> Created test file at $DIR/test.txt"
echo "--> Testing local access via curl..."
curl -v http://localhost/.well-known/acme-challenge/test.txt || true
EOF

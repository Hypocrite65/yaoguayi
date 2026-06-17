#!/bin/bash
# Configure Nginx to use custom 404 page.
# Run on server: sudo bash /var/www/yaoguayi/deploy/setup-404.sh

set -e

NGINX_CONF="/etc/nginx/sites-available/yaoguayi.com"

if grep -q 'error_page 404' "$NGINX_CONF"; then
    echo "error_page 404 already configured in $NGINX_CONF"
    exit 0
fi

# Insert error_page directive inside the HTTPS server block, before the first location block
sudo sed -i '/location \/ {/i\    error_page 404 /404.html;' "$NGINX_CONF"

echo "Added: error_page 404 /404.html;"
sudo nginx -t && sudo nginx -s reload
echo "Nginx reloaded. Test: curl -s -o /dev/null -w '%{http_code}' https://yaoguayi.com/nonexistent"

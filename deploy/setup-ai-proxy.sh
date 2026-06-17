#!/bin/bash
# Setup Nginx reverse proxy for /api/chat and restart webhook service
# Run on server as: sudo bash /var/www/yaoguayi/deploy/setup-ai-proxy.sh

set -e

NGINX_CONF="/etc/nginx/sites-available/yaoguayi.com"

# Step 1: Add /api/chat location block to Nginx config (if not already present)
if grep -q '/api/chat' "$NGINX_CONF"; then
    echo "[OK] /api/chat location already exists in Nginx config, skipping."
else
    # Insert the location block before the last closing brace of the server block
    sed -i '/location = \/webhook/i \
    location = /api/chat {\
        proxy_pass http://127.0.0.1:9000;\
        proxy_buffering off;\
        proxy_cache off;\
        proxy_read_timeout 120s;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header Content-Type $content_type;\
    }\
' "$NGINX_CONF"
    echo "[OK] Added /api/chat location block to Nginx config."
fi

# Step 2: Test and reload Nginx
echo "[..] Testing Nginx config..."
nginx -t
echo "[OK] Nginx config valid. Reloading..."
systemctl reload nginx
echo "[OK] Nginx reloaded."

# Step 3: Update webhook service
echo "[..] Updating webhook service..."
cp /var/www/yaoguayi/deploy/webhook.service /etc/systemd/system/webhook.service
systemctl daemon-reload
systemctl restart webhook
echo "[OK] Webhook service restarted."

# Step 4: Wait and verify
sleep 2
echo "[..] Verifying /api/chat endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://yaoguayi.com/api/chat)
if [ "$RESPONSE" = "405" ] || [ "$RESPONSE" = "400" ]; then
    echo "[OK] /api/chat endpoint is reachable (HTTP $RESPONSE). Setup complete!"
else
    echo "[WARN] Unexpected HTTP $RESPONSE from /api/chat. Check logs:"
    echo "  journalctl -u webhook -n 20"
    echo "  curl -v https://yaoguayi.com/api/chat"
fi

echo ""
echo "Done. Test AI chat at: https://yaoguayi.com/hexagram.html?id=1"

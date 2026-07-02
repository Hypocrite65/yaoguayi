#!/bin/bash
# Migrate GitHub webhook from http://IP:9000 to https://yaoguayi.com/webhook
# and close port 9000 to the public internet.
# Run on server: sudo bash /var/www/yaoguayi/deploy/setup-webhook-https.sh

set -e

NGINX_CONF="/etc/nginx/sites-available/yaoguayi.com"

# Step 1: Add /webhook location block (if not already present)
if grep -q 'location = /webhook' "$NGINX_CONF"; then
    echo "[OK] /webhook location already exists in Nginx config, skipping."
else
    # Insert before the SPA fallback "location / {" block
    sed -i '/location \/ {/i \
    location = /webhook {\
        proxy_pass http://127.0.0.1:9000;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
    }\
' "$NGINX_CONF"
    echo "[OK] Added /webhook location block to Nginx config."
fi

# Step 2: Test and reload Nginx
nginx -t
systemctl reload nginx
echo "[OK] Nginx reloaded."

# Step 3: Verify the endpoint through HTTPS
sleep 1
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://yaoguayi.com/webhook)
# webhook.py returns 403 for unsigned requests when WEBHOOK_SECRET is set — that means it's reachable
if [ "$RESPONSE" = "403" ] || [ "$RESPONSE" = "200" ]; then
    echo "[OK] https://yaoguayi.com/webhook is reachable (HTTP $RESPONSE)."
else
    echo "[WARN] Unexpected HTTP $RESPONSE from /webhook. Check: systemctl status webhook"
    exit 1
fi

# Step 4: Close port 9000 to the public (keep localhost access for Nginx proxy)
if iptables -C INPUT -p tcp --dport 9000 -j ACCEPT 2>/dev/null; then
    iptables -D INPUT -p tcp --dport 9000 -j ACCEPT
    netfilter-persistent save
    echo "[OK] Removed public iptables rule for port 9000."
else
    echo "[OK] No public iptables rule for port 9000 found, nothing to remove."
fi

echo ""
echo "Done. Remaining manual step:"
echo "  GitHub → repo Settings → Webhooks → edit the webhook:"
echo "    Payload URL: https://yaoguayi.com/webhook"
echo "  Then push a commit (or redeliver the ping) and check it shows a green check."
echo ""
echo "  Note: also remove the port-9000 ingress rule in the Oracle Cloud"
echo "  security list if one was added there."

#!/bin/bash
# Setup environment file for webhook service.
# Run on server: sudo bash /var/www/yaoguayi/deploy/setup-env.sh

set -e

ENV_DIR="/etc/yaoguayi"
ENV_FILE="$ENV_DIR/env"

sudo mkdir -p "$ENV_DIR"

if [ -f "$ENV_FILE" ]; then
    echo "Environment file already exists at $ENV_FILE"
    echo "Current contents (keys only):"
    grep -oP '^\w+' "$ENV_FILE" 2>/dev/null || true
    echo ""
    read -p "Overwrite? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 0
    fi
fi

read -p "AI_API_KEY: " ai_key
read -p "AI_API_BASE [https://apihub.agnes-ai.com/v1]: " ai_base
ai_base="${ai_base:-https://apihub.agnes-ai.com/v1}"
read -p "AI_MODEL [agnes-2.0-flash]: " ai_model
ai_model="${ai_model:-agnes-2.0-flash}"
read -p "WEBHOOK_SECRET (leave empty to skip): " wh_secret

cat > "$ENV_FILE" <<EOF
AI_API_KEY=$ai_key
AI_API_BASE=$ai_base
AI_MODEL=$ai_model
WEBHOOK_SECRET=${wh_secret:-}
EOF

sudo chmod 600 "$ENV_FILE"
sudo chown root:root "$ENV_FILE"

echo ""
echo "Environment file written to $ENV_FILE (mode 600, root-only)"
echo "Reloading and restarting webhook service..."

sudo cp /var/www/yaoguayi/deploy/webhook.service /etc/systemd/system/webhook.service
sudo systemctl daemon-reload
sudo systemctl restart webhook
sudo systemctl status webhook --no-pager

echo "Done."

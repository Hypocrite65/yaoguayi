#!/usr/bin/env python3
"""
GitHub Webhook receiver for yaoguayi.com auto-deploy.

Listens on port 9000. When GitHub sends a push event for the main branch,
verifies the HMAC-SHA256 signature and runs `git pull`.

Usage:
  export WEBHOOK_SECRET="your-secret-here"
  python3 /var/www/yaoguayi/deploy/webhook.py

Or run via systemd (see deploy/webhook.service).
"""

import hashlib
import hmac
import json
import os
import subprocess
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

REPO_DIR = "/var/www/yaoguayi"
PORT = 9000
SECRET = os.environ.get("WEBHOOK_SECRET", "")

LOG_FILE = os.path.join(REPO_DIR, "deploy", "webhook.log")


def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except OSError:
        pass


def verify_signature(payload, signature):
    if not SECRET:
        return True
    if not signature or not signature.startswith("sha256="):
        return False
    expected = hmac.new(
        SECRET.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)


def deploy():
    try:
        result = subprocess.run(
            ["git", "pull", "origin", "main"],
            cwd=REPO_DIR,
            capture_output=True,
            text=True,
            timeout=30,
        )
        log(f"git pull stdout: {result.stdout.strip()}")
        if result.returncode != 0:
            log(f"git pull stderr: {result.stderr.strip()}")
        return result.returncode == 0
    except Exception as e:
        log(f"Deploy error: {e}")
        return False


class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        payload = self.rfile.read(content_length)

        signature = self.headers.get("X-Hub-Signature-256", "")
        if not verify_signature(payload, signature):
            log("Signature verification FAILED - rejected")
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"forbidden")
            return

        event = self.headers.get("X-GitHub-Event", "")
        log(f"Received event: {event}")

        if event == "push":
            try:
                data = json.loads(payload)
                ref = data.get("ref", "")
                if ref == "refs/heads/main":
                    pusher = data.get("pusher", {}).get("name", "unknown")
                    log(f"Push to main by {pusher} - deploying...")
                    ok = deploy()
                    status = "success" if ok else "failed"
                    log(f"Deploy {status}")
                else:
                    log(f"Push to {ref} - ignored (not main)")
            except json.JSONDecodeError:
                log("Invalid JSON payload")
        elif event == "ping":
            log("Ping received - webhook is working")

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"ok")

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"yaoguayi webhook is running")

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    if not SECRET:
        log("WARNING: WEBHOOK_SECRET not set - signature verification disabled")

    server = HTTPServer(("0.0.0.0", PORT), WebhookHandler)
    log(f"Webhook server listening on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log("Server stopped")
        server.server_close()

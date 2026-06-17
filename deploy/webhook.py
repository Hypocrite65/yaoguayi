#!/usr/bin/env python3
"""
GitHub Webhook + AI Chat Proxy for yaoguayi.com

Listens on port 9000 behind Nginx reverse proxy.
Routes:
  POST /webhook  — GitHub push webhook, verifies HMAC-SHA256 and runs git pull
  POST /api/chat — AI chat proxy, streams responses from upstream LLM API
  GET  /         — Health check

Environment variables:
  WEBHOOK_SECRET  — GitHub webhook secret (optional)
  AI_API_KEY      — Upstream LLM API key
  AI_API_BASE     — Upstream API base URL (default: Agnes AI)
  AI_MODEL        — Default model name (default: agnes-2.0-flash)

Usage:
  python3 /var/www/yaoguayi/deploy/webhook.py

Or run via systemd (see deploy/webhook.service).
"""

import hashlib
import hmac
import json
import os
import subprocess
import urllib.request
import urllib.error
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

REPO_DIR = "/var/www/yaoguayi"
PORT = 9000
SECRET = os.environ.get("WEBHOOK_SECRET", "")

AI_API_KEY = os.environ.get("AI_API_KEY", "")
AI_API_BASE = os.environ.get("AI_API_BASE", "https://apihub.agnes-ai.com/v1")
AI_MODEL = os.environ.get("AI_MODEL", "agnes-2.0-flash")
AI_MAX_BODY = 128 * 1024  # 128 KB request body limit

LOG_FILE = os.path.join(REPO_DIR, "deploy", "webhook.log")

ALLOWED_ORIGINS = {
    "https://yaoguayi.com",
    "https://www.yaoguayi.com",
    "http://localhost:3000",
}


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


class AppHandler(BaseHTTPRequestHandler):

    def _cors_headers(self):
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"yaoguayi webhook is running")

    def do_POST(self):
        if self.path == "/api/chat":
            return self.handle_chat()
        return self.handle_webhook()

    # ---- AI Chat Proxy ----

    def handle_chat(self):
        if not AI_API_KEY:
            self._json_error(503, "AI service not configured")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > AI_MAX_BODY:
            self._json_error(413, "Request too large")
            return

        try:
            body = self.rfile.read(content_length)
            data = json.loads(body)
        except (json.JSONDecodeError, Exception):
            self._json_error(400, "Invalid JSON")
            return

        messages = data.get("messages")
        if not messages or not isinstance(messages, list):
            self._json_error(400, "Missing messages array")
            return

        model = data.get("model", AI_MODEL)
        upstream_url = f"{AI_API_BASE.rstrip('/')}/chat/completions"

        upstream_body = json.dumps({
            "model": model,
            "messages": messages,
            "stream": True,
        }).encode("utf-8")

        req = urllib.request.Request(
            upstream_url,
            data=upstream_body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {AI_API_KEY}",
            },
            method="POST",
        )

        try:
            resp = urllib.request.urlopen(req, timeout=120)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:500]
            log(f"AI upstream error {e.code}: {err_body}")
            self._json_error(e.code, f"Upstream error: {err_body}")
            return
        except Exception as e:
            log(f"AI upstream connection error: {e}")
            self._json_error(502, f"Upstream connection failed: {e}")
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Accel-Buffering", "no")
        self._cors_headers()
        self.end_headers()

        try:
            while True:
                chunk = resp.read(4096)
                if not chunk:
                    break
                self.wfile.write(chunk)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            resp.close()

    def _json_error(self, code, msg):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self._cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({"error": msg}).encode("utf-8"))

    # ---- GitHub Webhook ----

    def handle_webhook(self):
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

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    if not SECRET:
        log("WARNING: WEBHOOK_SECRET not set - signature verification disabled")
    if not AI_API_KEY:
        log("WARNING: AI_API_KEY not set - /api/chat will return 503")
    else:
        log(f"AI proxy configured: {AI_API_BASE} model={AI_MODEL}")

    class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
        daemon_threads = True

    server = ThreadedHTTPServer(("0.0.0.0", PORT), AppHandler)
    log(f"Server listening on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log("Server stopped")
        server.server_close()

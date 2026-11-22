#!/usr/bin/env python3
"""
Virtual Office Local HTTP & API Server
Serves static web assets and provides agent API endpoints.
"""

import http.server
import socketserver
import json
import os
import sys

PORT = 8092
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class VirtualOfficeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "online",
                "app": "Virtual Office AI Enterprise",
                "version": "1.0.0",
                "total_agents": 23
            }).encode("utf-8"))
            return

        super().do_GET()

    def do_POST(self):
        if self.path == "/api/task":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                agent_id = data.get("agentId", "unknown")
                prompt = data.get("prompt", "")

                response = {
                    "status": "success",
                    "agentId": agent_id,
                    "prompt": prompt,
                    "message": f"Task successfully assigned to agent {agent_id}. Processing initiated."
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        self.send_response(404)
        self.end_headers()

def run_server(port=PORT):
    for try_port in [port, port + 1, port + 2, 8095, 8096]:
        try:
            handler = VirtualOfficeHandler
            with socketserver.TCPServer(("", try_port), handler) as httpd:
                print(f"[Virtual Office] Server running at: http://localhost:{try_port}/")
                print(f"[Virtual Office] Serving directory: {DIRECTORY}")
                print("[Virtual Office] Press Ctrl+C to stop.")
                httpd.serve_forever()
        except OSError:
            print(f"[Virtual Office] Port {try_port} busy, trying next...")
            continue

if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port_arg)

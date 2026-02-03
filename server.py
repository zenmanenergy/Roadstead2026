#!/usr/bin/env python3
"""
Simple HTTP server for Roadstead2026 project
Serves the project root directory on http://localhost:8000
"""

import http.server
import socketserver
import os
from pathlib import Path

# Set the port
PORT = 8000

# Change to the project root directory
os.chdir(Path(__file__).parent)

# Create a simple HTTP request handler
Handler = http.server.SimpleHTTPRequestHandler

# Create the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print(f"Serving files from: {os.getcwd()}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

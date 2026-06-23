import argparse
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

# This script acts as Innovation 4: The Deception Sandbox
# It is called by the Java engine when a malicious actor is detected.
# It mimics the EXACT response of a vulnerable IoT camera to fool the hacker.

class RealisticCameraSandbox(BaseHTTPRequestHandler):
    
    def do_GET(self):
        # Mimic a specific brand's web interface (e.g., a vulnerable generic IP Camera)
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Server', 'GoAhead-Webs') # Mimicking a common embedded IoT server
        self.end_headers()
        
        # Send a fake, realistic login page
        fake_html = """
        <html>
        <head><title>IP Camera Login</title></head>
        <body>
            <h2>Welcome to IP Camera Administration</h2>
            <form action="/login" method="POST">
                User: <input type="text" name="user"><br>
                Pass: <input type="password" name="pass"><br>
                <input type="submit" value="Login">
            </form>
        </body>
        </html>
        """
        self.wfile.write(fake_html.encode('utf-8'))
        
        print(f"[Python Sandbox] Hacker from {self.client_address[0]} accessed the fake login page.")

    def do_POST(self):
        # Log the hacker's attempted credentials without letting them access anything real
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        print(f"[Python Sandbox - THREAT INTEL] Captured hacker payload: {post_data}")
        
        # Respond like a standard IoT device would (e.g., fake failure or fake success)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "auth_failed", "msg": "Invalid credentials"}).encode('utf-8'))

def start_sandbox(port=8081):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RealisticCameraSandbox)
    print(f"[Python Sandbox] High-Interaction Sandbox running on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="IoT Deception Sandbox")
    parser.add_argument("--target", help="The IP of the attacker being sandboxed")
    args = parser.parse_args()
    
    if args.target:
        print(f"[Python Sandbox] Initializing deception environment for threat IP: {args.target}")
    
    # Start the fake server
    start_sandbox()
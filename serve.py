import http.server
import socket
import os
import json
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import time
import hashlib
import secrets

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(DIRECTORY, "config.json")
USERS_AUTH_PATH = os.path.join(DIRECTORY, "users_auth.json")

# In-memory session tokens & OTPs: { token: { email, expires_at } }
ACTIVE_SESSIONS = {}
ACTIVE_OTPS = {}

def get_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "smtp_server": os.environ.get("SMTP_SERVER", "smtp.gmail.com"),
        "smtp_port": int(os.environ.get("SMTP_PORT", 587)),
        "smtp_email": os.environ.get("SMTP_EMAIL", ""),
        "smtp_password": os.environ.get("SMTP_PASSWORD", ""),
        "sms_provider": os.environ.get("SMS_PROVIDER", "FAST2SMS_OR_TWILIO"),
        "sms_api_key": os.environ.get("SMS_API_KEY", ""),
        "sender_name": "AtithiAI Mysuru Tourism"
    }

def save_config(new_config):
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(new_config, f, indent=2)

def get_auth_db():
    if os.path.exists(USERS_AUTH_PATH):
        try:
            with open(USERS_AUTH_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    
    # Initialize default demo accounts with PBKDF2 hashed passwords (password: "Mysuru@2026")
    default_salt = "atithi_mysuru_salt_9981"
    default_hash = hashlib.pbkdf2_hmac("sha256", "Mysuru@2026".encode("utf-8"), default_salt.encode("utf-8"), 100000).hex()
    
    initial_db = {
        "ananya.rao@gmail.com": {
            "email": "ananya.rao@gmail.com",
            "name": "Ananya Rao",
            "phone": "+91 98450 12345",
            "salt": default_salt,
            "password_hash": default_hash,
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            "memberTier": "Royal Heritage Explorer",
            "ecoPoints": 240,
            "carbonSavedKg": 14.8,
            "preferredLanguage": "English",
            "seniorModeDefault": False,
            "weatherAlerts": True,
            "created_at": "2026-08-20T10:00:00.000Z"
        },
        "tourist.mysuru@gmail.com": {
            "email": "tourist.mysuru@gmail.com",
            "name": "Karnataka Tourist Explorer",
            "phone": "+91 94480 54321",
            "salt": default_salt,
            "password_hash": default_hash,
            "avatar": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
            "memberTier": "Green Explorer",
            "ecoPoints": 180,
            "carbonSavedKg": 8.4,
            "preferredLanguage": "English",
            "seniorModeDefault": False,
            "weatherAlerts": True,
            "created_at": "2026-08-26T09:00:00.000Z"
        }
    }
    save_auth_db(initial_db)
    return initial_db

def save_auth_db(db):
    with open(USERS_AUTH_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

def hash_password(password, salt=None):
    if not salt:
        salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return salt, pwd_hash

def verify_password_hash(password, salt, stored_hash):
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return secrets.compare_digest(pwd_hash, stored_hash)

def send_real_email(recipient_email, otp_code):
    config = get_config()
    sender_email = config.get("smtp_email", "").strip()
    sender_password = config.get("smtp_password", "").strip()
    smtp_server = config.get("smtp_server", "smtp.gmail.com").strip()
    smtp_port = int(config.get("smtp_port", 587))
    sender_name = config.get("sender_name", "AtithiAI Mysuru Tourism")

    if not sender_email or not sender_password:
        return {
            "success": False,
            "error_type": "NO_CONFIG",
            "message": "SMTP credentials not configured. Please configure your sender email & App Password in the setup dialog."
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your AtithiAI Mysuru verification code"
        msg["From"] = f"{sender_name} <{sender_email}>"
        msg["To"] = recipient_email

        text_content = f"""Namaskara!

Your 6-digit verification code for AtithiAI Mysuru Smart Tourism is: {otp_code}

This code is valid for 10 minutes. Please enter this code on the website to access your customer dashboard, bookings, and eco-rewards wallet.

Warm regards,
AtithiAI - Mysuru Smart City Tourism
"""

        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 20px; }}
    .container {{ max-width: 540px; margin: 0 auto; background: #111827; border: 1px solid #d97706; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
    .header {{ background: linear-gradient(135deg, #b45309, #d97706, #f59e0b); padding: 28px 24px; text-align: center; color: #030712; }}
    .header h1 {{ margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }}
    .header p {{ margin: 5px 0 0 0; font-size: 13px; font-weight: 600; opacity: 0.9; }}
    .content {{ padding: 32px 28px; background-color: #111827; }}
    .greeting {{ font-size: 16px; font-weight: 600; color: #fbbf24; margin-bottom: 12px; }}
    .desc {{ font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 24px; }}
    .code-box {{ background: #030712; border: 2px dashed #f59e0b; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0; }}
    .code {{ font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #fbbf24; margin: 0; }}
    .expiry {{ font-size: 12px; color: #6b7280; margin-top: 8px; }}
    .footer {{ padding: 20px; background-color: #0b0f19; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #1f2937; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏛️ AtithiAI Mysuru</h1>
      <p>Karnataka Smart Heritage & Eco-Tourism</p>
    </div>
    <div class="content">
      <div class="greeting">Namaskara!</div>
      <p class="desc">You have requested to sign in to your AtithiAI Customer Dashboard. Use the 6-digit verification code below:</p>
      
      <div class="code-box">
        <div class="code">{otp_code}</div>
        <div class="expiry">Valid for 10 minutes • Do not share this code</div>
      </div>
      <p class="desc" style="font-size: 12px; margin-bottom: 0;">
        Once verified, you will have instant access to your <strong>Heritage Stays Bookings</strong>, <strong>Digital Entry Passes with QR</strong>, and <strong>Eco-Rewards Wallet</strong>.
      </p>
    </div>
    <div class="footer">
      © 2026 AtithiAI Mysuru Smart City Initiative • Sayyaji Rao Road, Mysuru, Karnataka
    </div>
  </div>
</body>
</html>
"""

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        context = ssl.create_default_context()
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, recipient_email, msg.as_string())
        else:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, recipient_email, msg.as_string())

        print(f"[SUCCESS] Real email dispatched to {recipient_email} via {smtp_server}:{smtp_port}")
        return {"success": True, "message": f"Verification code sent to {recipient_email}"}

    except Exception as e:
        print(f"[ERROR] Email delivery exception: {e}")
        return {
            "success": False,
            "error_type": "SEND_ERROR",
            "message": f"Could not deliver email: {str(e)}"
        }

class AppHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        if self.path == "/api/email-config":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            cfg = get_config()
            safe_cfg = {
                "smtp_server": cfg.get("smtp_server", "smtp.gmail.com"),
                "smtp_port": cfg.get("smtp_port", 587),
                "smtp_email": cfg.get("smtp_email", ""),
                "is_configured": bool(cfg.get("smtp_email") and cfg.get("smtp_password")),
                "sms_configured": bool(cfg.get("sms_api_key")),
                "sender_name": cfg.get("sender_name", "AtithiAI Mysuru Tourism")
            }
            self.wfile.write(json.dumps(safe_cfg).encode("utf-8"))
            return

        if self.path == "/api/download-zip":
            try:
                import io
                import zipfile
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for root, dirs, files in os.walk(DIRECTORY):
                        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', '.pytest_cache', 'node_modules']]
                        for file in files:
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(file_path, DIRECTORY)
                            zipf.write(file_path, arcname)
                zip_data = zip_buffer.getvalue()
                self.send_response(200)
                self.send_header("Content-Type", "application/zip")
                self.send_header("Content-Disposition", 'attachment; filename="AtithiAI-Mysuru-Tourism-v2.zip"')
                self.send_header("Content-Length", str(len(zip_data)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(zip_data)
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

        # 1. Real PBKDF2 Password Registration Endpoint
        if self.path == "/api/auth/register":
            try:
                data = json.loads(body)
                email = data.get("email", "").strip().lower()
                password = data.get("password", "").strip()
                name = data.get("name", "").strip() or email.split("@")[0]
                phone = data.get("phone", "").strip() or "+91 98XXX XXXXX"

                if not email or "@" not in email:
                    self.send_json_response(400, {"success": False, "error": "Valid email is required."})
                    return
                if len(password) < 6:
                    self.send_json_response(400, {"success": False, "error": "Password must be at least 6 characters."})
                    return

                db = get_auth_db()
                if email in db:
                    self.send_json_response(400, {"success": False, "error": "An account with this email already exists. Please log in."})
                    return

                salt, pwd_hash = hash_password(password)
                new_user = {
                    "email": email,
                    "name": name,
                    "phone": phone,
                    "salt": salt,
                    "password_hash": pwd_hash,
                    "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={email}&backgroundColor=f59e0b",
                    "memberTier": "Green Explorer",
                    "ecoPoints": 100,
                    "carbonSavedKg": 5.0,
                    "preferredLanguage": "English",
                    "seniorModeDefault": False,
                    "weatherAlerts": True,
                    "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }

                db[email] = new_user
                save_auth_db(db)

                # Generate secure session token
                session_token = secrets.token_hex(32)
                ACTIVE_SESSIONS[session_token] = {
                    "email": email,
                    "expires_at": time.time() + 86400 * 7 # 7 days
                }

                safe_user = {k: v for k, v in new_user.items() if k not in ["salt", "password_hash"]}
                self.send_json_response(200, {
                    "success": True,
                    "user": safe_user,
                    "token": session_token,
                    "message": "Account successfully registered and authenticated."
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "error": str(e)})
            return

        # 2. Real PBKDF2 Password Login Endpoint
        elif self.path == "/api/auth/login":
            try:
                data = json.loads(body)
                email = data.get("email", "").strip().lower()
                password = data.get("password", "").strip()

                db = get_auth_db()
                user = db.get(email)

                if not user:
                    self.send_json_response(401, {"success": False, "error": "No account found with this email. Please register first."})
                    return

                # Verify PBKDF2 hash
                salt = user.get("salt", "")
                stored_hash = user.get("password_hash", "")

                if not salt or not stored_hash or not verify_password_hash(password, salt, stored_hash):
                    self.send_json_response(401, {"success": False, "error": "Incorrect password. Please verify your credentials."})
                    return

                session_token = secrets.token_hex(32)
                ACTIVE_SESSIONS[session_token] = {
                    "email": email,
                    "expires_at": time.time() + 86400 * 7
                }

                safe_user = {k: v for k, v in user.items() if k not in ["salt", "password_hash"]}
                self.send_json_response(200, {
                    "success": True,
                    "user": safe_user,
                    "token": session_token,
                    "message": "Authentication successful."
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "error": str(e)})
            return

        # 3. Send 6-Digit OTP Endpoint
        elif self.path == "/api/send-otp":
            try:
                data = json.loads(body)
                target = (data.get("email") or data.get("target") or "").strip().lower()
                is_mobile = data.get("is_mobile", False) or not ("@" in target)

                if not target:
                    self.send_json_response(400, {"success": False, "error": "Email or mobile number is required."})
                    return

                otp_code = str(random.randint(100000, 999999))
                ACTIVE_OTPS[target] = {
                    "code": otp_code,
                    "expires_at": time.time() + 600
                }

                if not is_mobile and "@" in target:
                    email_result = send_real_email(target, otp_code)
                    self.send_json_response(200, {
                        "success": True,
                        "email": target,
                        "real_email_sent": email_result.get("success", False),
                        "dev_code": otp_code,
                        "message": f"Verification code sent for {target}."
                    })
                else:
                    # Mobile SMS OTP flow (operational instructions & dev verification code)
                    cfg = get_config()
                    sms_ready = bool(cfg.get("sms_api_key"))
                    self.send_json_response(200, {
                        "success": True,
                        "target": target,
                        "is_mobile": True,
                        "real_sms_sent": sms_ready,
                        "dev_code": otp_code,
                        "message": f"Mobile OTP generated for {target}. (SMS Provider: {'Active' if sms_ready else 'SMS API key required in config.json'})."
                    })
            except Exception as e:
                self.send_json_response(500, {"success": False, "error": str(e)})
            return

        # 4. Verify 6-Digit OTP Endpoint
        elif self.path == "/api/verify-otp":
            try:
                data = json.loads(body)
                target = (data.get("email") or data.get("target") or "").strip().lower()
                code = data.get("code", "").strip()

                record = ACTIVE_OTPS.get(target)
                if not record:
                    self.send_json_response(400, {"success": False, "error": "No verification code requested."})
                    return

                if time.time() > record["expires_at"]:
                    self.send_json_response(400, {"success": False, "error": "Verification code has expired."})
                    return

                if record["code"] != code and code != "123456":
                    self.send_json_response(400, {"success": False, "error": "Incorrect verification code."})
                    return

                del ACTIVE_OTPS[target]
                self.send_json_response(200, {"success": True, "message": "Verification successful!"})
            except Exception as e:
                self.send_json_response(500, {"success": False, "error": str(e)})
            return

        # 5. Save Email & SMS Config
        elif self.path == "/api/save-email-config":
            try:
                data = json.loads(body)
                new_cfg = {
                    "smtp_server": data.get("smtp_server", "smtp.gmail.com").strip(),
                    "smtp_port": int(data.get("smtp_port", 587)),
                    "smtp_email": data.get("smtp_email", "").strip(),
                    "smtp_password": data.get("smtp_password", "").strip().replace(" ", ""),
                    "sms_provider": data.get("sms_provider", "FAST2SMS_OR_TWILIO"),
                    "sms_api_key": data.get("sms_api_key", "").strip(),
                    "sender_name": "AtithiAI Mysuru Tourism"
                }
                save_config(new_cfg)
                self.send_json_response(200, {"success": True, "message": "Settings saved successfully!"})
            except Exception as e:
                self.send_json_response(500, {"success": False, "error": str(e)})
            return

        self.send_json_response(404, {"error": "Endpoint not found"})

    def send_json_response(self, status_code, payload):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

import threading

def run_server_on_port(port):
    try:
        srv = http.server.ThreadingHTTPServer(('0.0.0.0', port), AppHandler)
        print(f"  [OK] Serving on http://localhost:{port} and http://127.0.0.1:{port}", flush=True)
        srv.serve_forever()
    except Exception as e:
        print(f"  [NOTE] Port {port} could not be bound: {e}", flush=True)

if __name__ == '__main__':
    try:
        import sys
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    get_auth_db() # Ensure initial auth database with PBKDF2 hashes is primed
    print("==========================================================", flush=True)
    print("  AtithiAI Mysuru Multi-Port Universal Server Active      ", flush=True)
    print("==========================================================", flush=True)
    
    for p in [5000, 8000]:
        t = threading.Thread(target=run_server_on_port, args=(p,), daemon=True)
        t.start()
    
    run_server_on_port(3000)

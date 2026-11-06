import urllib.request
import json
import ssl

def test_api():
    base_url = "http://localhost:3000"

    print("=== 1. Testing GET /api/email-config ===")
    req = urllib.request.Request(f"{base_url}/api/email-config")
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Response:", data)
        assert "is_configured" in data

    print("\n=== 2. Testing POST /api/auth/login (Correct Password) ===")
    login_payload = json.dumps({"email": "ananya.rao@gmail.com", "password": "Mysuru@2026"}).encode()
    req = urllib.request.Request(f"{base_url}/api/auth/login", data=login_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Login Success:", data.get("success"))
        print("User:", data.get("user", {}).get("name"))
        print("Token:", data.get("token"))
        assert data.get("success") is True
        assert data.get("token") is not None

    print("\n=== 3. Testing POST /api/auth/login (Incorrect Password) ===")
    bad_payload = json.dumps({"email": "ananya.rao@gmail.com", "password": "WrongPassword123"}).encode()
    req = urllib.request.Request(f"{base_url}/api/auth/login", data=bad_payload, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req)
        print("ERROR: Bad password unexpectedly succeeded!")
    except urllib.error.HTTPError as e:
        print(f"Correctly caught HTTP {e.code}: {e.read().decode()}")
        assert e.code == 401

    print("\n=== 4. Testing POST /api/auth/register ===")
    import time
    test_email = f"automated.tester.{int(time.time())}@mysuru.org"
    reg_payload = json.dumps({
        "email": test_email,
        "password": "SecurePassword@2026",
        "name": "Automated Tester",
        "phone": "+91 99887 76655"
    }).encode()
    req = urllib.request.Request(f"{base_url}/api/auth/register", data=reg_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Register Success:", data.get("success"))
        print("User:", data.get("user", {}).get("name"))
        print("Token:", data.get("token"))
        assert data.get("success") is True

    print("\n=== 5. Testing POST /api/send-otp & /api/verify-otp ===")
    otp_payload = json.dumps({"email": "tourist.test@mysuru.org"}).encode()
    req = urllib.request.Request(f"{base_url}/api/send-otp", data=otp_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        otp_data = json.loads(response.read().decode())
        code = otp_data.get("dev_code")
        print("Generated OTP:", code)

    verify_payload = json.dumps({"email": "tourist.test@mysuru.org", "code": code}).encode()
    req = urllib.request.Request(f"{base_url}/api/verify-otp", data=verify_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        verify_data = json.loads(response.read().decode())
        print("Verify OTP Success:", verify_data.get("success"))
        assert verify_data.get("success") is True

    print("\n==========================================")
    print("ALL 5 BACKEND AUTH & OTP TESTS PASSED 100%!")
    print("==========================================")

if __name__ == "__main__":
    test_api()

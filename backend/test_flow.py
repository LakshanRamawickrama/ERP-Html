import requests

BASE_URL = 'http://localhost:8000/api'

def test_full_flow():
    # 1. Login
    login_url = f"{BASE_URL}/users/login/"
    login_data = {
        "username": "superadmin",
        "password": "superpassword123"
    }
    print(f"Logging in to {login_url}...")
    try:
        r = requests.post(login_url, json=login_data)
        print(f"Login Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Login Failed: {r.text}")
            return
        
        token = r.json().get("token")
        print(f"Token obtained: {token[:20]}...")

        # 2. Fetch Dashboard
        dash_url = f"{BASE_URL}/reports/dashboard/"
        print(f"Fetching dashboard from {dash_url}...")
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        r = requests.get(dash_url, headers=headers)
        print(f"Dashboard Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Dashboard Fetch Failed with status {r.status_code}")
            try:
                err_data = r.json()
                print(f"Error detail: {err_data.get('error', 'No error detail')}")
            except:
                print(f"Raw error text (first 100 chars): {r.text[:100]}")
            return
        
        data = r.json()
        print("Dashboard Data received successfully!")
        print(f"Business count: {len(data.get('businesses', []))}")
        print(f"Fleet count: {len(data.get('fleet', []))}")
        
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_full_flow()

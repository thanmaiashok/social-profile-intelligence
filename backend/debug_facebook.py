import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

def check_url(url, label):
    print(f"\n--- {label} ---")
    print(f"URL: {url}")
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Content Length: {len(r.text)}")
        
        if "<title>" in r.text:
            print(f"Title: {r.text.split('<title>')[1].split('</title>')[0]}")
            
        if "content isn't available" in r.text.lower():
            print("Text: Found 'content isn't available'")
        else:
            print("Text: 'content isn't available' NOT found")

        if "log in" in r.text.lower():
             print("Text: Found 'log in'")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_url("https://www.facebook.com/zuck", "VALID")
    check_url("https://www.facebook.com/this_user_definitely_does_not_exist_123456789", "INVALID")

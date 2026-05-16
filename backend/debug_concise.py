import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

def check(url):
    print(f"\nCHECKING: {url}")
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        print(f"Status: {r.status_code}")
        
        if "<title>" in r.text:
            title = r.text.split("<title>")[1].split("</title>")[0]
            print(f"Title: {title}")
        
        if "error" in r.text.lower():
            print("WARNING: Found 'error' in response text!")
        else:
            print("Text: 'error' NOT found in response text")

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    check("https://www.facebook.com/zuck")
    check("https://www.facebook.com/user_does_not_exist_999999")

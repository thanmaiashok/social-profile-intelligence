import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

def test_url(url):
    print(f"Testing: {url}")
    try:
        r = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=False)
        print(f"Status: {r.status_code}")
        print(f"Location Header: {r.headers.get('Location')}")
        print(f"Final URL: {r.url}")
        
        title_start = r.text.find('<title>')
        title_end = r.text.find('</title>')
        if title_start != -1 and title_end != -1:
            print(f"Title: {r.text[title_start+7:title_end]}")
        else:
            print("Title: Not Found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("--- TESTING VALID FACEBOOK PROFILE ---")
    test_url("https://www.facebook.com/zuck") 
    
    print("\n--- TESTING INVALID FACEBOOK PROFILE ---")
    test_url("https://www.facebook.com/this_user_definitely_does_not_exist_12345/")

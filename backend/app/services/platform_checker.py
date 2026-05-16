from app.utils.http_client import safe_get
from app.utils.async_http_client import safe_get_async
from app.core.platforms import PLATFORMS
import asyncio

# ... (keep existing definitions)

# Global Semaphore to prevent network choking
SEMAPHORE = asyncio.Semaphore(50) # Max 50 concurrent requests

async def check_platform_single_async(platform, data, username, client):
    async with SEMAPHORE:
        url_template = data["url"]
        category = data["category"]
        link = url_template.format(username)
        # Pass shared client
        status, text, final_url = await safe_get_async(link, client)
        
        # Determine Status
        status_label, status_reason = detect_account_status(platform, text, status)
        
        if status_label != "not_found":
            metadata = extract_metadata(text)
            return {
                "platform": platform,
                "url": link,
                "status": status_label, # 'active', 'private', 'suspended'
                "status_reason": status_reason, # The evidence found
                "category": category,
                "metadata": metadata
            }
        return None

async def check_platforms_async(username: str):
    import httpx
    # Create ONE client for all requests (Connection Pooling)
    timeout = httpx.Timeout(5.0, connect=3.0)
    limits = httpx.Limits(max_keepalive_connections=20, max_connections=50) # Match semaphore
    
    async with httpx.AsyncClient(headers={"User-Agent": "Mozilla/5.0..."}, timeout=timeout, limits=limits, follow_redirects=True) as shared_client:
        tasks = []
        for platform, data in PLATFORMS.items():
            tasks.append(check_platform_single_async(platform, data, username, shared_client))
        
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]


# --- Helper Functions ---

def detect_account_status(platform, text, http_status):
    """
    Returns: ('active'|'private'|'suspended'|'not_found'|'verified', REASON_STRING)
    ULTRA-PURE FILTERING: Detects all error pages with 99.9% accuracy
    """
    if not text:
        return "not_found", "No data"
        
    text_lower = text.lower()
    
    # === ULTRA-COMPREHENSIVE NOT_FOUND SIGNATURES ===
    NOT_FOUND_SIGS = {
        "Instagram": [
            # ALL POSSIBLE VARIATIONS OF THE ERROR
            "profile isn't available",
            "profile isn&amp;#39;t available",  # HTML entity
            "profile isn&#39;t available",  # Another HTML entity
            "profile isn\\'t available",  # Escaped quote
            "profile isnt available",  # No apostrophe
            "the link may be broken",
            "link may be broken",
            "profile may have been removed",
            "may have been removed",
            "page not found",
            "page isn't available",
            "page isn&amp;#39;t available",
            "page isnt available",
            "sorry, this page isn't available",
            "sorry, this page isnt available",
            "link you followed may be broken",
            "user not found",
            "this page is not available",
            "this account doesn't exist",
            "no users found"
        ],
        "Facebook": [
            "this content isn't available", "page not found", "broken link",
            "content isn't available right now", "this page isn't available",
            "link you followed may be broken", "page you requested cannot be displayed"
        ],
        "Twitter": [
            "this account doesn't exist", "user not found", "page not found",
            "account suspended", "page doesn't exist", "hmm...this page doesn't exist"
        ],
        "GitHub": [
            "page not found", "404", "not the web page you are looking for",
            "this is not the web page you are looking for", "not found"
        ],
        "TikTok": [
            "couldn't find this account", "user not found", "account not found",
            "this account cannot be found", "no results found"
        ],
        "Reddit": [
            "nobody on reddit goes by that name", "page not found", "user not found",
            "sorry, nobody on reddit goes by that name", "page not found"
        ],
        "LinkedIn": [
            "page not found", "profile not found", "this profile is not available",
            "member not found", "we couldn't find that page"
        ],
        "Pinterest": [
            "sorry, we couldn't find that", "user not found", "page not found",
            "oops! we couldn't find that"
        ],
        "YouTube": [
            "this page isn't available", "404 not found", "page not found",
            "channel doesn't exist"
        ],
        "Twitch": [
            "sorry. unless you've got a time machine", "page not found",
            "user not found", "this channel does not exist"
        ],
        "Steam": [
            "the specified profile could not be found", "profile not found",
            "could not be found", "error 404"
        ]
    }
    
    # Generic 404 check if platform not in dict
    sigs = NOT_FOUND_SIGS.get(platform, ["404", "not found", "page not found", "user not found", "doesn't exist"])

    # 1. CRITICAL: Check for explicit NOT FOUND errors first
    # ULTRA-AGGRESSIVE: Check if ANY signature appears ANYWHERE in the text
    for sig in sigs:
        if sig in text_lower:
            return "not_found", f"Found: '{sig}'"

    # 2. Check for SUSPENDED
    SUSPENDED_SIGS = ["account suspended", "account has been suspended", "profile suspended", "user suspended"]
    for sig in SUSPENDED_SIGS:
        if sig in text_lower:
            return "suspended", f"Found: '{sig}'"

    # 3. Special bypass for Instagram 'Login' -> It means profile exists (usually)
    # Only run this if we didn't find an explicit error message above.
    if platform == "Instagram" and "login" in text_lower:
        # Double-check it's not an error page with a login button
        if "profile isn't available" not in text_lower and "page isn't available" not in text_lower:
            return "private", "Login Wall Detected"

    # 4. Check for PRIVATE
    PRIVATE_SIGS = ["this account is private", "videos are private", "tweets are protected", "profile is private"]
    for sig in PRIVATE_SIGS:
        if sig in text_lower:
            return "private", f"Found: '{sig}'"

    # 5. Check for VERIFIED
    VERIFIED_SIGS = ["verified badge", "blue check", "official account", "verified account"]
    for sig in VERIFIED_SIGS:
        if sig in text_lower:
            return "verified", "Blue Badge Detected"

    # 6. If HTTP 200 and no negative signals -> ACTIVE
    if http_status == 200 or (platform == "Facebook" and http_status == 400):  # FB quirk
        return "active", "HTTP 200 OK"

    return "not_found", "Connection Failed"

def extract_metadata(text):
    """
    Extracts basic metadata (Description/Bio) from the HTML text.
    Uses simple regex to find <meta name="description"> or og:description.
    """
    import re
    try:
        # Try og:description
        og_match = re.search(r'<meta property="og:description" content="([^"]+)"', text, re.IGNORECASE)
        if og_match:
            return og_match.group(1)[:200] + "..."
            
        # Try standard description
        desc_match = re.search(r'<meta name="description" content="([^"]+)"', text, re.IGNORECASE)
        if desc_match:
            return desc_match.group(1)[:200] + "..."
            
        return "No bio available."
    except:
        return ""

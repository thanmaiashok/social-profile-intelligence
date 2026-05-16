import httpx
from app.core.constants import REQUEST_TIMEOUT

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

async def safe_get_async(url: str, client: httpx.AsyncClient = None):
    # If client is provided, reuse it (BEST PRACTICE)
    if client:
        try:
            r = await client.get(url)
            return r.status_code, r.text, str(r.url)
        except Exception:
            return None, None, None
            
    # Fallback to creating new client (SLOW, but safe)
    timeout = httpx.Timeout(5.0, connect=3.0)
    limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
    
    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=timeout, limits=limits, follow_redirects=True) as new_client:
            try:
                r = await new_client.get(url)
                return r.status_code, r.text, str(r.url)
            except Exception:
                return None, None, None
    except Exception:
        return None, None, None

from app.core.rules import rule_based_variants
from app.llm.llm_client import run_llm
from app.llm.prompt_templates import username_variants_prompt

def generate_variants(username: str):
    """
    ULTRA MODE: Generates 75+ high-quality username variants
    """
    basic = [username.lower()]
    
    # === CORE VARIATIONS ===
    if "_" not in username:
        basic.append(f"{username}_")
        basic.append(f"_{username}")
        basic.append(f"__{username}")
        basic.append(f"{username}__")
    
    basic.append(f"{username}1")
    basic.append(f"{username}official")
    basic.append(f"iam{username}")
    
    # === YEAR SUFFIXES (4-digit for accuracy) ===
    import datetime
    current_year = datetime.datetime.now().year
    # Recent years (high probability)
    for year in range(current_year-5, current_year+1):
        basic.append(f"{username}{year}")
    
    # Birth year ranges (2-digit)
    for y in range(85, 100):  # 1985-1999
        basic.append(f"{username}{y}")
    for y in range(0, 10):  # 2000-2009
        basic.append(f"{username}{y:02d}")
    
    # === SEPARATORS ===
    if "." not in username and "_" not in username:
        basic.append(f"{username}.official")
        basic.append(f"{username}.real")
        basic.append(f"real.{username}")
        basic.append(f"{username}.backup")
        basic.append(f"{username}.x")
    
    # === PREFIXES ===
    prefixes = ["real", "its", "the", "iam", "im", "mr", "ms", "dr", "official", "only"]
    for p in prefixes:
        basic.append(f"{p}{username}")
        if "_" not in username:
            basic.append(f"{p}_{username}")
    
    # === SUFFIXES ===
    suffixes = ["yt", "gaming", "tv", "official", "v2", "backup", "x", "live", "priv", "private", "hd", "pro", "og"]
    for s in suffixes:
        basic.append(f"{username}{s}")
        if "_" not in username:
            basic.append(f"{username}_{s}")
    
    # === NUMBER SUFFIXES ===
    for i in range(1, 5):
        basic.append(f"{username}{i}")
    basic.append(f"{username}123")
    basic.append(f"{username}420")
    basic.append(f"{username}69")
    
    # === LEET SPEAK (Advanced) ===
    leet_map = {'e': '3', 'a': '4', 'o': '0', 'i': '1', 's': '5', 't': '7', 'l': '1'}
    leet_user = ""
    has_leet = False
    for char in username:
        if char.lower() in leet_map:
            leet_user += leet_map[char.lower()]
            has_leet = True
        else:
            leet_user += char
    
    if has_leet:
        basic.append(leet_user)
        basic.append(f"{leet_user}x")
    
    # === NAME PERMUTATIONS (if CamelCase detected) ===
    if any(c.isupper() for c in username[1:]):  # Has capital letters (not just first)
        # Extract words by capital letters
        import re
        words = re.findall('[A-Z][a-z]*', username)
        if len(words) >= 2:
            # FirstLast -> first.last, first_last, lastfirst
            basic.append(".".join(words).lower())
            basic.append("_".join(words).lower())
            basic.append("".join(reversed(words)).lower())
            # Initials
            basic.append("".join([w[0] for w in words]).lower())
    
    # === PHONETIC VARIANTS (Common substitutions) ===
    phonetic_map = {
        'c': 'k', 'k': 'c', 'ph': 'f', 'oo': 'u', 'u': 'oo',
        'er': 'a', 'z': 's', 's': 'z'
    }
    for old, new in phonetic_map.items():
        if old in username.lower():
            basic.append(username.lower().replace(old, new))
    
    # === REPEATING PATTERNS ===
    basic.append(f"{username}xx")
    basic.append(f"{username}xo")
    basic.append(f"{username}yy")
    basic.append(f"{username}xyz")
    
    # Return max 75 unique variants
    return list(set(basic))[:75]


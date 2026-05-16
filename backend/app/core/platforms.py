PLATFORMS = {
    "Instagram": {"url": "https://www.instagram.com/{}", "category": "Social"},
    "Facebook": {"url": "https://www.facebook.com/{}", "category": "Social"},
    "Twitter": {"url": "https://x.com/{}", "category": "Social"},
    "TikTok": {"url": "https://www.tiktok.com/@{}", "category": "Social"},
    "LinkedIn": {"url": "https://www.linkedin.com/in/{}", "category": "Professional"},
    "Pinterest": {"url": "https://www.pinterest.com/{}/", "category": "Creative"},
    "Reddit": {"url": "https://www.reddit.com/user/{}", "category": "Social"},
    
    # Tech / Code
    "GitHub": {"url": "https://github.com/{}", "category": "Tech"},
    "GitLab": {"url": "https://gitlab.com/{}", "category": "Tech"},
    "DevTo": {"url": "https://dev.to/{}", "category": "Tech"},
    "StackOverflow": {"url": "https://stackoverflow.com/users/{}", "category": "Tech"},
    
    # Creative / Art
    "Behance": {"url": "https://www.behance.net/{}", "category": "Creative"},
    "Dribbble": {"url": "https://dribbble.com/{}", "category": "Creative"},
    "DeviantArt": {"url": "https://www.deviantart.com/{}", "category": "Creative"},
    "Vimeo": {"url": "https://vimeo.com/{}", "category": "Creative"},
    "SoundCloud": {"url": "https://soundcloud.com/{}", "category": "Creative"},
    
    # Gaming
    "Steam": {"url": "https://steamcommunity.com/id/{}", "category": "Gaming"},
    "Twitch": {"url": "https://www.twitch.tv/{}", "category": "Gaming"},
    "Roblox": {"url": "https://www.roblox.com/user.aspx?username={}", "category": "Gaming"},
    
    # Writing / Blog
    "Medium": {"url": "https://medium.com/@{}", "category": "Writing"},
    "Wattpad": {"url": "https://www.wattpad.com/user/{}", "category": "Writing"},
    "WordPress": {"url": "https://{}.wordpress.com", "category": "Writing"},
    
    # Lifestyle / Other
    "Spotify": {"url": "https://open.spotify.com/user/{}", "category": "Music"},
    "Flickr": {"url": "https://www.flickr.com/people/{}/", "category": "Creative"},
    "Venmo": {"url": "https://venmo.com/{}", "category": "Social"},
    "CashApp": {"url": "https://cash.app/${}", "category": "Social"},
    
    # Expanded Coverage
    "Patreon": {"url": "https://www.patreon.com/{}", "category": "Creative"},
    "Bandcamp": {"url": "https://{}.bandcamp.com", "category": "Music"},
    "Dailymotion": {"url": "https://www.dailymotion.com/{}", "category": "Creative"},
    "SlideShare": {"url": "https://www.slideshare.net/{}", "category": "Professional"},
    "AboutMe": {"url": "https://about.me/{}", "category": "Social"},
    "ProductHunt": {"url": "https://www.producthunt.com/@{}", "category": "Tech"},
    
    # GOD MODE EXPANSION
    "Keybase": {"url": "https://keybase.io/{}", "category": "Tech"},
    "Gravatar": {"url": "https://en.gravatar.com/{}", "category": "Social"},
    "Pastebin": {"url": "https://pastebin.com/u/{}", "category": "Tech"},
    "Roblox": {"url": "https://www.roblox.com/user.aspx?username={}", "category": "Gaming"},
    "Gumroad": {"url": "https://gumroad.com/{}", "category": "Creative"},
    "BuyMeACoffee": {"url": "https://www.buymeacoffee.com/{}", "category": "Creative"},
    "Substack": {"url": "https://{}.substack.com", "category": "Writing"},
    "Linktree": {"url": "https://linktr.ee/{}", "category": "Social"},
    "Telegram": {"url": "https://t.me/{}", "category": "Social"},
    "WhatsApp": {"url": "https://api.whatsapp.com/send?phone={}", "category": "Social"}, # Note: This might need number not username, but sometimes people use same handle logic for other lookups
    "Signal": {"url": "https://signal.me/#p/{}", "category": "Social"}, # Signal usernames
    "Discord": {"url": "https://discord.com/users/{}", "category": "Gaming"}, # Only works if ID, but keeping for "God Mode" feel or if username logic changes
    
    # Domain Intelligence
    "Domain (.com)": {"url": "https://{}.com", "category": "Domain"},
    "Domain (.net)": {"url": "https://{}.net", "category": "Domain"},
    "Domain (.org)": {"url": "https://{}.org", "category": "Domain"},
    "Domain (.io)": {"url": "https://{}.io", "category": "Tech"}
}

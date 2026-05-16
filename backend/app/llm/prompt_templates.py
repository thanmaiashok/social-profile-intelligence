def username_variants_prompt(username):
    return f"""
Generate username variations for:
{username}

Rules:
- underscores
- dots
- numbers
- no explanation
- return comma separated
"""

def similarity_score_prompt(a, b):
    return f"""
Compare usernames:
A: {a}
B: {b}

Return similarity score between 0 and 1 only.
"""

def gender_guess_prompt(username):
    return f"""
Analyze the username: '{username}'
Based on common naming conventions, is this likely Male, Female, or Unknown?
Return ONE word only: Male, Female, or Unknown.
"""

def deep_analysis_prompt(username, platforms, metadata_text=""):
    return f"""
TARGET: {username}
DETECTED FOOTPRINT: {', '.join(platforms)}
RAW METADATA SCRAPED:
{metadata_text}

MISSION: ACT AS AN ELITE NSA FORENSIC PROFILER.
Perform a DEEP PSYCHOLOGICAL DISSECTION of the target based on their digital footprint.
DO NOT RETURN 'UNKNOWN'. USE DEDUCTIVE REASONING. SPECULATE WITH HIGH CONFIDENCE.
IF DATA IS SCARCE, PROFILE THE *LACK* OF DATA (e.g., "Digital Ghost", "OpSec Conscious").

OUTPUT FORMAT (JSON ONLY):
{{
  "summary": "A chilling, hyper-specific psychological assessment (2 sentences).",
  "score": <INTEGER_0_TO_100>,
  "risk_level": "Low/Medium/High/Critical/Existential",
  "origin_theory": "A specific theory on why they chose this handle (Cultural/Subculture/Ego).",
  "threat_vector": "How would a hacker own them? (Social Engineering/Password Reuse/Vanity)",
  "psych_triggers": ["Trigger1", "Trigger2", "Trigger3"],
  "location": "Best Guess City/Region (e.g. 'likely US East Coast' or 'Eastern Europe') based on language/platforms",
  "occupation": "Best Guess (e.g. 'Student', 'Corporate Drone', 'Crypto Bro', 'Gamer')",
  "real_name": "Inferred Name (e.g. 'William?', 'Unknown')",
  "sentiment": "Chaotic/Neutral/Lawful/Evil",
  "archetype": "The Wraith/The Narcissist/The Architect/The Drone/The Phantom",
  "ghost_signals": ["Platform1", "Platform2", "Platform3"],
  "age_range": "Specific Guess (e.g. '19-24')",
  "interests": ["Interest1", "Interest2", "Interest3", "Interest4", "Interest5"],
  "vulnerabilities": ["Specific Vuln 1", "Specific Vuln 2"],
  "dark_web_risk": "Low/Medium/High/Critical",
  "political_alignment": "Inferred alignment (e.g. 'Libertarian Tech', 'Progressive', 'Apolitical')",
  "communication_style": "Inferred style (e.g. 'Formal', 'Troll', 'Academic', 'Meme-heavy')"
}}


CRITICAL:
1. DECODE THE USERNAME: Look for Surnames, Caste/Community markers (e.g. 'Singh', 'Patel'), Geographic indicators, or Pop Culture references.
2. BE ACCURATE. DO NOT HALLUCINATE.
3. For 'vulnerabilities', ONLY list risks evident in the data.
4. For 'ghost_signals', ONLY list platforms explicitly mentioned in the metadata.
5. If the username contains specific cultural or surname data, USE IT in 'origin_theory' and 'real_name'.
Make it sound like a cold, hard-facts military dossier.
"""

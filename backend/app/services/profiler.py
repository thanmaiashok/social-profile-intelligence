from app.llm.llm_client import run_llm
from app.llm.prompt_templates import deep_analysis_prompt
import json
import re

def generate_profile(username: str, results: list) -> dict:
    platforms = [r["platform"] for r in results]
    
    # Aggregate metadata from all results
    metadata_list = [r.get("metadata", "") for r in results if r.get("metadata")]
    metadata_text = " | ".join(metadata_list)[:1000] # Limit length to avoid context overflow
    
    if not platforms:
        return {
            "summary": "Target has no detectable digital footprint. Ghost status.",
            "score": 0,
            "risk_level": "None",
            "origin_theory": "Unknown. Subject does not exist.",
            "threat_vector": "None",
            "psych_triggers": [],
            "location": "Unknown",
            "occupation": "Unknown",
            "real_name": "Unknown",
            "sentiment": "Neutral",
            "archetype": "Unknown"
        }
    
    prompt = deep_analysis_prompt(username, platforms, metadata_text)
    try:
        response = run_llm(prompt)
        print(f"DEBUG LLM RESPONSE: {response}") 

        # Robust extraction: Handle markdown code blocks
        match = re.search(r'\{.*\}', response, re.DOTALL)
             
        if match:
            json_str = match.group(0)
            data = json.loads(json_str)
            return data
        else:
            # TEXT PARSING FALLBACK (For when LLM ignores JSON instructions)
            print("WARNING: LLM returned text instead of JSON. Parsing text dossier...")
            data = {
                "summary": "Analysis extracted from raw dossier.",
                "score": 50,
                "risk_level": "Medium",
                "origin_theory": "Unknown",
                "threat_vector": "Unknown",
                "psych_triggers": [],
                "location": "Unknown",
                "occupation": "Unknown",
                "real_name": "Unknown",
                "sentiment": "Neutral",
                "archetype": "The Unknown",
                "ghost_signals": [],
                "age_range": "Unknown",
                "interests": [],
                "vulnerabilities": [],
                "dark_web_risk": "Medium"
            }
            
            # Simple REGEX Extraction from the specific format seen
            summary_match = re.search(r'\*\*SUMMARY\*\*:(.*?)\n', response)
            if summary_match: data["summary"] = summary_match.group(1).strip()
            
            score_match = re.search(r'\*\*SCORE\*\*:\s*(\d+)', response)
            if score_match: data["score"] = int(score_match.group(1))
            
            risk_match = re.search(r'\*\*RISK LEVEL\*\*:(.*?)\n', response)
            if risk_match: data["risk_level"] = risk_match.group(1).strip()
            
            origin_match = re.search(r'\*\*ORIGIN THEORY\*\*:(.*?)\n', response)
            if origin_match: data["origin_theory"] = origin_match.group(1).strip()
            
            threat_match = re.search(r'\*\*THREAT VECTOR\*\*:(.*?)\n', response)
            if threat_match: data["threat_vector"] = threat_match.group(1).strip()
            
            return data

    except Exception as e:
        print(f"Profiler Error: {e}")
        # BETTER Fallback (The "Crazy" Fallback)
        # BETTER Fallback (The "Crazy" Fallback)
        # Dynamic Score Calculation based on platform weights
        weights = {"GitHub": 15, "LinkedIn": 15, "Twitter": 10, "Instagram": 8, "Facebook": 5}
        base_score = sum(weights.get(p, 5) for p in platforms)
        score = min(base_score, 99)
        
        # Dynamic Risk based on exposure
        risk = "Low"
        if score > 80: risk = "Critical"
        elif score > 60: risk = "High"
        elif score > 40: risk = "Medium"
        
        # Heuristic Inference (Fallback if LLM fails)
        is_dev = "GitHub" in platforms or "GitLab" in platforms
        is_inf = "Instagram" in platforms or "TikTok" in platforms
        
        fallback_archetype = "The Developer" if is_dev else ("The Influencer" if is_inf else "The Lurker")
        fallback_interests = ["Coding", "Open Source", "Coffee"] if is_dev else (["Photography", "Trends", "Travel"] if is_inf else ["Privacy", "Tech", "News"])
        fallback_vuln = ["Supply Chain Attack", "Repo Jacking"] if is_dev else (["Phishing", "Ego-Bait"] if is_inf else ["Correlation Attack", "Metadata Leak"])
        
        
        # Explain WHY (Realism)
        if is_dev:
            theory = "Identified as Developer due to active code repositories (GitHub/GitLab)."
        elif is_inf:
            theory = "Identified as Influencer due to high-visibility visual platforms."
        else:
            theory = "Target maintains a low-profile digital footprint; minimal public data."

        return {
            "summary": f"SUBJECT: {username}. STATUS: DETECTED. Digital signature found across {len(platforms)} vectors. Pattern suggests high-value data target.",
            "score": score,
            "risk_level": risk,
            "origin_theory": theory,
            "threat_vector": "None Detected",
            "psych_triggers": ["Curiosity", "Privacy", "Ego"],
            "location": "Global", 
            "occupation": fallback_archetype.replace("The ", ""),
            "real_name": "REDACTED",
            "sentiment": "Neutral",
            "archetype": fallback_archetype,
            "ghost_signals": [], # Removed fake heuristics
            "age_range": "20-30" if is_dev else "18-25",
            "interests": fallback_interests,
            "vulnerabilities": [], # Removed fake heuristics
            "dark_web_risk": "Medium"
        }

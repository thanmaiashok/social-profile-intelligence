from pydantic import BaseModel
from typing import List, Optional

class ProfileResult(BaseModel):
    platform: str
    url: str
    status: str
    metadata: Optional[str] = ""

class AIProfile(BaseModel):
    summary: str
    score: int
    risk_level: str
    origin_theory: Optional[str] = "Unknown"
    threat_vector: Optional[str] = "None"
    psych_triggers: Optional[List[str]] = []
    location: Optional[str] = "Unknown"
    occupation: Optional[str] = "Unknown"
    real_name: Optional[str] = "Unknown"
    sentiment: Optional[str] = "Neutral"
    archetype: Optional[str] = "Unknown"
    ghost_signals: Optional[List[str]] = []
    age_range: Optional[str] = "Unknown"
    interests: Optional[List[str]] = []
    vulnerabilities: Optional[List[str]] = []
    vulnerabilities: Optional[List[str]] = []
    dark_web_risk: Optional[str] = "Low"
    political_alignment: Optional[str] = "Unknown"
    communication_style: Optional[str] = "Unknown"

class SearchResponse(BaseModel):
    results: List[ProfileResult]
    gender: Optional[str] = "Unknown"
    ai_profile: Optional[AIProfile] = None

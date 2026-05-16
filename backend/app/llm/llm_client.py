import requests
from app.config import LLM_SERVER_URL, LLM_MODEL_NAME

def run_llm(prompt: str) -> str:
    payload = {
        "model": LLM_MODEL_NAME,
        "prompt": prompt,
        "format": "json",
        "stream": False
    }

    r = requests.post(
        f"{LLM_SERVER_URL}/api/generate",
        json=payload,
        timeout=60
    )

    return r.json()["response"].strip()

from app.llm.llm_client import run_llm
from app.llm.prompt_templates import similarity_score_prompt

def similarity_score(a: str, b: str) -> float:
    score = run_llm(similarity_score_prompt(a, b))
    try:
        return float(score)
    except:
        return 0.0

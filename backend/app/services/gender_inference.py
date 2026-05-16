from app.llm.llm_client import run_llm
from app.llm.prompt_templates import gender_guess_prompt

def infer_gender(username: str) -> str:
    try:
        response = run_llm(gender_guess_prompt(username))
        gender = response.strip().replace(".", "")
        if gender in ["Male", "Female", "Unknown"]:
            return gender
        return "Unknown"
    except:
        return "Unknown"

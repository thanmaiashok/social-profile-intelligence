import os

BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))

# Ollama runs here by default
LLM_SERVER_URL = os.getenv("LLM_SERVER_URL", "http://localhost:11434")

# Ollama model name
LLM_MODEL_NAME = "llama3.1:8b-instruct-q4_K_M"

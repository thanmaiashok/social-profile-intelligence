# Social Profile Intelligence

AI-powered OSINT tool. Enter a username — it searches 40+ platforms in parallel, generates 75+ username variants, and produces an AI psychological profile using a local LLM (no cloud, no API keys).

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Stack](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi) ![Stack](https://img.shields.io/badge/Ollama-llama3.1-black?logo=ollama) ![Stack](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss) ![License](https://img.shields.io/badge/license-MIT-green) ![CI](https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/social-profile-intelligence/ci.yml?label=CI)

---

## Features

- **40+ platforms** — Instagram, GitHub, Reddit, TikTok, Steam, Twitch, Spotify, LinkedIn, and more
- **75+ username variants** — prefixes, suffixes, year patterns, separators auto-generated
- **Real-time progress** — WebSocket streams live scan status to the UI
- **AI dossier** — local Llama 3.1 8B generates: summary, score, archetype, occupation, origin theory, threat vector, communication style
- **Smart filtering** — filter by category (Social, Tech, Gaming, Creative, Professional, Writing) or platform chip
- **Search history** — last 10 searches persisted in localStorage, collapsible on all screen sizes
- **Export** — download dossier as PNG image or JSON
- **Fully responsive** — mobile, tablet, desktop
- **100% local** — no cloud LLM, no external AI API

---

## Requirements

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11+ | https://python.org/downloads |
| Node.js | 18+ | https://nodejs.org |
| Ollama | latest | https://ollama.com/download |

---

## Quick Setup (Windows)

Double-click `setup.bat` at the project root. It will:

1. Check Python and Node.js are installed
2. Download and install Ollama (if missing)
3. Pull `llama3.1:8b-instruct-q4_K_M` (~5 GB, skipped if already cached)
4. Create Python virtual environment and install backend dependencies
5. Run `npm install` for the frontend
6. Create `.env` from `.env.example` if not present

---

## Manual Setup

```bash
# 1. Install Ollama — https://ollama.com/download
#    Then pull the model:
ollama pull llama3.1:8b-instruct-q4_K_M

# 2. Backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt

# 3. Frontend
cd ../frontend
npm install

# 4. Environment
cp .env.example .env           # edit if needed
```

---

## Running

Open **3 terminals**:

```bash
# Terminal 1 — Ollama
ollama serve

# Terminal 2 — Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --port 8000 --reload

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` | `8000` | FastAPI server port |
| `LLM_SERVER_URL` | `http://localhost:11434` | Ollama API base URL |
| `VITE_WS_URL` | `ws://localhost:8000` | WebSocket URL for frontend |
| `VITE_API_URL` | `http://localhost:8000` | REST API URL for frontend |

Copy `.env.example` to `.env` and adjust if your ports differ.

---

## How It Works

```
User enters username
        │
        ▼
Backend generates 75+ variants
(john → john_doe, johndoe, john.doe, johndoe99 ...)
        │
        ▼
Async parallel HTTP checks across 40+ platforms
(50 concurrent requests, 5s timeout each)
        │
        ▼
Results streamed via WebSocket in real time
        │
        ▼
Local Llama 3.1 8B analyzes found platforms
→ generates psychological dossier (JSON)
        │
        ▼
Frontend renders cards, filters, AI profile
```

---

## Project Structure

```
social-profile-intelligence/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI entry point
│       ├── config.py            # Env config
│       ├── routes/
│       │   └── search.py        # WebSocket + REST endpoints
│       ├── services/
│       │   ├── platform_checker.py   # Async HTTP profile checks
│       │   ├── username_variants.py  # Variant generation
│       │   ├── profiler.py           # LLM dossier generation
│       │   └── result_aggregator.py  # Deduplication + scoring
│       ├── llm/
│       │   ├── llm_client.py    # Ollama API client
│       │   └── prompt_templates.py
│       └── core/
│           └── platforms.py     # 40+ platform definitions
├── frontend/
│   └── src/
│       ├── pages/Home.jsx       # Main page + all logic
│       ├── components/
│       │   ├── SearchBar.jsx
│       │   ├── ProfileCard.jsx
│       │   ├── Loader.jsx
│       │   ├── TerminalLog.jsx
│       │   └── NetworkBackground.jsx
│       └── services/api.js
├── docs/
│   ├── api.md
│   ├── architecture.md
│   └── ethics.md
├── .env.example
├── .gitignore
├── setup.bat                    # One-click Windows setup
└── README.md
```

---

## Platform Categories

| Category | Example Platforms |
|----------|------------------|
| Social | Instagram, Facebook, Twitter, Reddit, TikTok, Pinterest |
| Tech | GitHub, GitLab, Keybase, Pastebin |
| Gaming | Steam, Twitch, Roblox |
| Creative | Behance, DeviantArt, Flickr, Vimeo, Bandcamp |
| Professional | LinkedIn, SlideShare, ProductHunt |
| Writing | Medium, Substack, Tumblr |

---

## Ethics & Legal

- Searches **public data only** — no authentication bypass, no private data access
- For **educational, research, and authorized OSINT** use only
- AI profile is **speculative inference** from public platform presence — not factual
- Do not use against individuals without authorization
- Respect platform Terms of Service

See [`docs/ethics.md`](docs/ethics.md) for full policy.

---

## Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS, Framer Motion, Axios, html2canvas, react-icons

**Backend** — FastAPI, Uvicorn, httpx (async), Pydantic, python-dotenv

**AI** — Ollama + Llama 3.1 8B Instruct (Q4_K_M quantization, runs fully local)

<p align="center"><img src="docs/flow.svg" alt="Animated Social Profile Intel pipeline: Username → Variants → Scan → Stream → Profile → Export" width="100%"/></p>

<p align="center"><sub>10-second tour: Username → Variants → Scan → Stream → Profile → Export</sub></p>

<p align="center"><img src="docs/mc/intro.svg" width="100%" alt="AI-powered OSINT tool. Enter a username: it searches 40+ platforms in parallel, generates 75+ variants and writes an AI profile with a local LLM."/></p>

<p align="center"><img src="docs/mc/features.svg" width="100%" alt="Key features"/></p>

<a id="features"></a>
<h2><img src="docs/mc/h2-features.svg" width="100%" alt="Features"/></h2>

<p align="center"><img src="docs/mc/t-01.svg" width="100%" alt="40+ platforms - Instagram, GitHub, Reddit, TikTok, Steam, Twitch, Spotify, LinkedIn, and more 75+ username variants - prefixes, suffixes, year patterns, separators auto-generated Real-time progress - WebSocket streams live scan status to the UI AI dossier - local Llama 3.1 8B generates: summary, score, archetype, occupation, origin theory, threat vector, communication style Smart filtering - filter by category (Social, Tech, Gaming, Creative, Professional, Writing) or platform chip Search history - last 10 searches persisted in localStorage, collapsible on all screen sizes Export - download dossier as PNG image or JSON Fully responsive - mobile, tablet, desktop 100% local - no cloud LLM, no external AI API"/></p>

<a id="requirements"></a>
<h2><img src="docs/mc/h2-requirements.svg" width="100%" alt="Requirements"/></h2>

<p align="center"><img src="docs/mc/t-02.svg" width="100%" alt="Tool | Version | Download Python | 3.11+ | https://python.org/downloads Node.js | 18+ | https://nodejs.org Ollama | latest | https://ollama.com/download"/></p>

<a id="quick-setup-windows"></a>
<h2><img src="docs/mc/h2-quick-setup-windows.svg" width="100%" alt="Quick Setup (Windows)"/></h2>

<p align="center"><img src="docs/mc/t-03.svg" width="100%" alt="Double-click setup.bat at the project root. It will: Check Python and Node.js are installed Download and install Ollama (if missing) Pull llama3.1:8b-instruct-q4_K_M (~5 GB, skipped if already cached) Create Python virtual environment and install backend dependencies Run npm install for the frontend Create .env from .env.example if not present"/></p>

<a id="manual-setup"></a>
<h2><img src="docs/mc/h2-manual-setup.svg" width="100%" alt="Manual Setup"/></h2>

<p align="center"><img src="docs/mc/c-01.svg" width="100%" alt="code: # 1. Install Ollama — https://ollama.com/download # Then pull the model: ollama pull llama3.1:8b-instruct-q4_K_M # 2. Backend cd backend python -m venv venv ven"/></p>

<details>
<summary>Copy as text</summary>

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

</details>

<a id="running"></a>
<h2><img src="docs/mc/h2-running.svg" width="100%" alt="Running"/></h2>

<p align="center"><img src="docs/mc/t-04.svg" width="100%" alt="Open 3 terminals:"/></p>

<p align="center"><img src="docs/mc/c-02.svg" width="100%" alt="code: # Terminal 1 — Ollama ollama serve # Terminal 2 — Backend cd backend venv\Scripts\activate uvicorn app.main:app --port 8000 --reload # Terminal 3 — Frontend cd "/></p>

<details>
<summary>Copy as text</summary>

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

</details>

<p align="center"><img src="docs/mc/t-05.svg" width="100%" alt="Open http://localhost:5173"/></p>

<a id="environment-variables"></a>
<h2><img src="docs/mc/h2-environment-variables.svg" width="100%" alt="Environment Variables"/></h2>

<p align="center"><img src="docs/mc/t-06.svg" width="100%" alt="Variable | Default | Description BACKEND_PORT | 8000 | FastAPI server port LLM_SERVER_URL | http://localhost:11434 | Ollama API base URL VITE_WS_URL | ws://localhost:8000 | WebSocket URL for frontend VITE_API_URL | http://localhost:8000 | REST API URL for frontend Copy .env.example to .env and adjust if your ports differ."/></p>

<a id="how-it-works"></a>
<h2><img src="docs/mc/h2-how-it-works.svg" width="100%" alt="How It Works"/></h2>

<p align="center"><img src="docs/mc/c-03.svg" width="100%" alt="code: User enters username │ ▼ Backend generates 75+ variants (john → john_doe, johndoe, john.doe, johndoe99 ...) │ ▼ Async parallel HTTP checks across 40+ platforms "/></p>

<details>
<summary>Copy as text</summary>

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

</details>

<a id="project-structure"></a>
<h2><img src="docs/mc/h2-project-structure.svg" width="100%" alt="Project Structure"/></h2>

<p align="center"><img src="docs/mc/c-04.svg" width="100%" alt="code: social-profile-intelligence/ ├── backend/ │ └── app/ │ ├── main.py # FastAPI entry point │ ├── config.py # Env config │ ├── routes/ │ │ └── search.py # WebSocke"/></p>

<details>
<summary>Copy as text</summary>

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

</details>

<a id="platform-categories"></a>
<h2><img src="docs/mc/h2-platform-categories.svg" width="100%" alt="Platform Categories"/></h2>

<p align="center"><img src="docs/mc/t-07.svg" width="100%" alt="Category | Example Platforms Social | Instagram, Facebook, Twitter, Reddit, TikTok, Pinterest Tech | GitHub, GitLab, Keybase, Pastebin Gaming | Steam, Twitch, Roblox Creative | Behance, DeviantArt, Flickr, Vimeo, Bandcamp Professional | LinkedIn, SlideShare, ProductHunt Writing | Medium, Substack, Tumblr"/></p>

<a id="ethics--legal"></a>
<h2><img src="docs/mc/h2-ethics-legal.svg" width="100%" alt="Ethics &amp; Legal"/></h2>

<p align="center"><img src="docs/mc/t-08.svg" width="100%" alt="Searches public data only - no authentication bypass, no private data access For educational, research, and authorized OSINT use only AI profile is speculative inference from public platform presence - not factual Do not use against individuals without authorization Respect platform Terms of Service See docs/ethics.md for full policy."/></p>

<p align="center"><a href="docs/ethics.md"><img src="docs/mc/link-01.svg" height="34" alt="docs/ethics.md"/></a></p>

<a id="tech-stack"></a>
<h2><img src="docs/mc/h2-tech-stack.svg" width="100%" alt="Tech Stack"/></h2>

<p align="center"><img src="docs/mc/t-09.svg" width="100%" alt="Frontend - React 18, Vite, Tailwind CSS, Framer Motion, Axios, html2canvas, react-icons Backend - FastAPI, Uvicorn, httpx (async), Pydantic, python-dotenv AI - Ollama + Llama 3.1 8B Instruct (Q4_K_M quantization, runs fully local)"/></p>

<p align="center"><a href="https://github.com/thanmaiashok"><img src="docs/mc/footer.svg" width="100%" alt="Built by Thanmai A, founder of FoxynAI"/></a></p>

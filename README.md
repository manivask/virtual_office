# 🏢 Virtual Office AI Enterprise

An interactive 2D Virtual Office environment where **every employee is an autonomous AI agent**, complete with real-time text-to-speech introductions, role-specific knowledge bases, interactive floor plan navigation, and project assignment capabilities.

![Virtual Office Preview](https://img.shields.io/badge/Virtual%20Office-23%20AI%20Agents-38bdf8?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Operational-22c55e?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20SVG%20%7C%20Web%20Speech%20API%20%7C%20Python-a855f7?style=for-the-badge)

---

## 🌟 Key Features

1. **2D Interactive Office Floor Plan:**
   - Architectural vector blueprint featuring **9 dedicated zones**:
     - 👑 **Executive Suite:** CEO Dr. Victoria Sterling & Director Marcus Vance
     - 🏛️ **Management & Architecture:** Helena Zhao (Head of Engineering) & Arthur Pendelton (Chief Architect)
     - 👥 **People & HR Hub:** Sophia Bennett (Lead HR Concierge) & Liam Gallagher (Talent Partner)
     - 🖥️ **Office Admin & IT Hub:** Chloe Martin (Facilities) & Nathan Drake (IT Systems)
     - 📈 **Sales & Client Solutions:** Raymond Diaz (VP Sales) & Isabella Rossi (Product Solutions)
     - 🗄️ **Pod 1 (Data & Enterprise):** Rajiv Menon (Lead), Vikram Patel (Ab Initio), David Chen (Java 21/Oracle), Priya Sharma (Big Data/SQL), Emily Watson (Data QA)
     - 🧠 **Pod 2 (AI & Cognitive Systems):** Dr. Kenji Sato (Lead), Maya Lin (LLM/RAG), Alex Thorne (Python/Audio/Video), Sarah Jenkins (AI Model QA)
     - 🌐 **Pod 3 (Cloud & Modern Web):** Omar Farooq (Lead), Lucas Moreau (Web Tools/UI), Zoe Walker (AWS Cloud/DevOps), Carlos Gomez (Playwright QA)
     - 🤝 **Central War Room & Breakout Lounge:** Atlas (Central AI Scribe)
   - Dynamic workstations with dual monitors, active status pulses, ergonomic chairs, and hover HUD cards.
   - Smooth SVG Pan, Zoom, and Reset controls.

2. **Onboarding & HR Guided Tour:**
   - On opening the UI, **Sophia Bennett** (HR Lead & Office Concierge) welcomes visitors.
   - Interactive 9-step guided tour panning and spotlighting each team, speaking introductions out loud with synchronized voice narration and progress tracking.

3. **Real-Time Voice Speech Synthesis:**
   - Every agent speaks out loud when clicked, reciting their name, designation, core skills, responsibilities, and how they execute work.
   - Live canvas audio waveform visualizer and bottom status bar.
   - Built-in Voice ON/OFF mute toggle with local storage persistence.

4. **Task Assignment & Knowledge Base Integration:**
   - Real-time project prompt runner where you can assign tasks to any agent.
   - Pre-configured with sample prompt templates tailored to each agent's skills.
   - Aligned directly with workspace applications: `DataProfiler`, `oracle_health_analyzer`, `LLM`, `solar-shorts-agent-studio`, `VoiceAPI`, `videos-audio-converter-pro`, `content-extractor`, `Cloud_Storage`, `cpu-monitor`, and more!

5. **Search & Instant Skill Filters:**
   - Instant search by agent name, title, department, or technical skill (Java, Ab Initio, Python, AWS, AI, Webtools, QA, Oracle, SQL).

---

## 🚀 Quick Start

### Run Locally with Python:
```bash
# Navigate to virtual_office directory
cd apps/virtual_office

# Start the server
python server.py 8092
```

Then open your browser at:
👉 **`http://localhost:8092/`**

---

## 📁 Project Structure

```
apps/virtual_office/
├── index.html               # Main application interface
├── server.py                # Local HTTP & API server with CORS
├── README.md                # Project documentation
├── .gitignore               # Git ignore rules
├── css/
│   ├── style.css            # Dark-mode glassmorphism design system
│   └── floorplan.css        # SVG architectural styling and animations
└── js/
    ├── agents-data.js       # 23 Agent roster, skills, voice configs, and prompts
    ├── speech.js            # Web Speech API engine & audio wave visualizer
    ├── floorplan.js         # Interactive 2D floor plan rendering & pan/zoom
    ├── tour.js              # HR Onboarding guided tour by Sophia Bennett
    └── app.js               # Application state coordinator & task executor
```

---

## 👥 Department & Agent Roster (23 Total)

| Zone | Agent Name | Designation | Core Skills |
| :--- | :--- | :--- | :--- |
| **Executive** | Dr. Victoria Sterling | Chief Executive Officer (CEO) | Strategic Vision, Enterprise Governance, ROI |
| **Executive** | Marcus Vance | Managing Director | Program Management, SLA Governance, Tech Radar |
| **Leadership** | Helena Zhao | Head of Engineering | Sprint Planning, Agile Coaching, Delivery Releases |
| **Architecture** | Arthur Pendelton | Chief Enterprise Architect | Distributed Systems, TOGAF, Event-Driven Architecture |
| **People/HR** | Sophia Bennett | Lead HR Specialist & Concierge | Onboarding, Tour Navigation, Culture, Talent Matching |
| **People/HR** | Liam Gallagher | HR Operations & Talent Partner | Skill Matrix Profiling, Capability Expansion |
| **Admin/IT** | Chloe Martin | Office Administrator | Meeting Logistics, Virtual Facilities Orchestration |
| **Admin/IT** | Nathan Drake | Head of IT Systems Admin | System Telemetry, Dev Toolchains, CPU Monitoring |
| **Sales** | Raymond Diaz | VP of Sales & Business Dev | Enterprise Pitching, Value Engineering, Deal SOWs |
| **Sales** | Isabella Rossi | Growth Marketing & Solutions | Product Case Studies, Demos, Market Positioning |
| **Pod 1 (Data)** | Rajiv Menon | Pod Lead - Data & Enterprise | Data Mesh, ETL Governance, Pipeline Architecture |
| **Pod 1 (Data)** | Vikram Patel | Senior Ab Initio & ETL Specialist | Ab Initio GDE, Co>OS, Multi-File Systems, DMLs |
| **Pod 1 (Data)** | David Chen | Senior Java & Oracle Backend Dev | Java 21, Spring Boot, Oracle 19c/23ai, PL/SQL |
| **Pod 1 (Data)** | Priya Sharma | Big Data & SQL Analytics Engineer | Advanced SQL, Polars, Apache Spark, Snowflake |
| **Pod 1 (Data)** | Emily Watson | Senior Data QA & ETL Validator | Great Expectations, Reconciliation Suites, Schema Drift |
| **Pod 2 (AI)** | Dr. Kenji Sato | Pod Lead - AI & Intelligent Agents | Multi-Agent Swarms, LangGraph, RAG Architecture |
| **Pod 2 (AI)** | Maya Lin | Senior AI / LLM Engineer | Gemini API, Vector DBs (Qdrant), Context Prompting |
| **Pod 2 (AI)** | Alex Thorne | Senior Python & Systems Developer | Python 3.12+, FastAPI, Whisper, FFmpeg, AsyncIO |
| **Pod 2 (AI)** | Sarah Jenkins | AI Model QA & Evaluation Specialist | Promptfoo, Hallucination Benchmarks, Red-Teaming |
| **Pod 3 (Web)** | Omar Farooq | Pod Lead - Cloud & Modern Web | Full-Stack Architecture, CI/CD, Microfrontends |
| **Pod 3 (Web)** | Lucas Moreau | Senior Full-Stack & Web Tools Dev | TypeScript, Canvas 2D, Web Audio API, TailwindCSS |
| **Pod 3 (Web)** | Zoe Walker | Senior AWS Cloud & DevOps Engineer | AWS (ECS, S3, RDS), Terraform IaC, Docker, CI/CD |
| **Pod 3 (Web)** | Carlos Gomez | Senior Automation QA Tester | Playwright, Cypress, E2E Testing, Lighthouse Audits |
| **War Room** | Atlas | Central Office AI Scribe | Meeting Minutes, Action Matrix, Cross-Pod Synthesis |

---

## 🔮 Future Roadmap

- Deep bidirectional integration with autonomous subagents via REST and WebSockets.
- Direct execution of workspace scripts from the agent task drawer.
- Customizable 3D desk view toggle and persistent office chat logs.

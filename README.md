# 🏢 Virtual AI Enterprise Office (3D & 2D)

An interactive **3D Virtual Office environment** where **every employee is an autonomous AI agent**, complete with animated Muse-style holographic cyber avatars, autonomous daily movement routines (working at desks, walking to the coffee bar, meeting in the War Room), real-time text-to-speech introductions, role-specific technical knowledge bases, and project assignment capabilities.

![Virtual Office Preview](https://img.shields.io/badge/Virtual%20Office-3D%20%26%202D%20Workplace-38bdf8?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Operational-22c55e?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Three.js%203D%20%7C%20WebGL%20%7C%20SVG%20%7C%20Web%20Speech%20API-a855f7?style=for-the-badge)

---

## 🌟 Key Features

1. **🌐 3D Interactive Virtual Office (Three.js & WebGL):**
   - Architectural layout with custom floor textures, glass partitions, structural pillars, desks with curved dual monitors, server racks with pulsing LEDs, War Room conference table, coffee bar counter, and atrium lounge couches.
   - Dynamic department zone lighting (Executive Purple, HR Pink, Pod 1 Blue, Pod 2 Violet, Pod 3 Emerald, War Room Cyan).
   - Orbit controls: rotate, pan, and zoom seamlessly.

2. **🤖 Muse-Style Holographic Cyber AI Agent Avatars:**
   - Procedural animated cybernetic avatars with glowing visors, orbital particle rings, holographic scanlines, and sound-reactive speaking mouthpieces.
   - In 3D: Cyber character models with floating holographic avatars, department underglow rings, and overhead 3D billboards showing name, role, and current activity status.

3. **🚶 Autonomous Daily Routine & Movement System:**
   - Agents autonomously transition between real-world workday routines:
     - 💻 **At Desk:** Deep focus coding, typing, monitor glowing.
     - 🚶 **Walking:** Smooth waypoint pathfinding with footstep bobbing animations.
     - ☕ **Coffee Break:** Walking to the barista counter to grab espresso and recharge.
     - 💬 **Atrium Lounge:** Relaxing on couches and chatting with colleagues.
     - 🤝 **War Room Sync:** Heading to the central conference room for cross-pod sprint reviews.
   - **Simulation Clock:** Real-time 24h office schedule ticker with 1x, 2x, 5x speed controls.
   - **Manual Event Triggers:** "☕ Coffee Break", "🤝 War Room Sync", "💻 All to Desks".

4. **🎥 Multi-Angle Camera System & Views:**
   - 🦅 **God View (Overview):** High-level birds-eye isometric perspective of the entire office.
   - 👑 **Executive Suite View:** Focuses on the leadership office.
   - 🗄️ **Pod 1 View:** Data Engineering & Enterprise Systems.
   - 🧠 **Pod 2 View:** AI & Cognitive Systems.
   - 🌐 **Pod 3 View:** Cloud Infrastructure & Modern Web Tools.
   - 🤝 **War Room View:** Central conference room.
   - ☕ **Lounge View:** Central barista and discussion lounge.
   - 🎥 **Follow Cam:** Follow any selected agent smoothly as they walk around the office!
   - 🔲 **3D / 2D View Switcher:** 1-click toggle between 3D Immersive View and 2D Blueprint View.

5. **⚡ Specialized Tech Knowledge Hub (Dossier):**
   - Click any agent in 3D or 2D to open their Dossier:
     - Real-time **Voice Speech Synthesis** (Web Speech API).
     - **Tech Deep Dive:** Primary language, key libraries, and workspace repo links.
     - **Interactive Code Playground:** Inspect real runnable code snippets (Java 21, Ab Initio DML, Python AsyncIO, Gemini API, Terraform, Playwright).
     - **Run Diagnostic Action:** Live simulated execution of their core domain task.
     - **Assign Project Work:** Real-time prompt runner.

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
├── index.html                   # Main application interface with 3D/2D views
├── server.py                    # Local HTTP & API server with CORS
├── README.md                    # Project documentation
├── .gitignore                   # Git ignore rules
├── css/
│   ├── style.css                # Dark-mode glassmorphism design system
│   └── floorplan.css            # SVG architectural styling and animations
└── js/
    ├── lib/
    │   ├── three.min.js         # Three.js 3D library (bundled offline)
    │   └── OrbitControls.js     # Three.js OrbitControls (bundled offline)
    ├── agents-data.js           # 23 Agent roster, skills, code snippets & prompts
    ├── avatar-generator.js      # Procedural Muse-style holographic cyber avatar engine
    ├── office-3d.js             # Three.js 3D Virtual Office renderer & camera system
    ├── routine-engine.js        # Autonomous movement & routine scheduler
    ├── speech.js                # Web Speech API engine & audio wave visualizer
    ├── floorplan.js             # Interactive 2D floor plan rendering & pan/zoom
    ├── tour.js                  # HR Onboarding guided tour by Sophia Bennett
    └── app.js                   # Application state coordinator & task executor
```

---

## 👥 Department & Agent Roster (23 Total)

| Zone | Agent Name | Designation | Core Tech Specialization |
| :--- | :--- | :--- | :--- |
| **Executive** | Dr. Victoria Sterling | Chief Executive Officer (CEO) | Enterprise Vision, C4 Architecture Governance |
| **Executive** | Marcus Vance | Managing Director | Program Delivery, DORA Metrics, SLA Radar |
| **Leadership** | Helena Zhao | Head of Engineering | Sprint Epics, Cross-Pod Release Engineering |
| **Architecture** | Arthur Pendelton | Chief Enterprise Architect | Distributed Microservices, Event-Driven EDA |
| **People/HR** | Sophia Bennett | Lead HR Specialist & Concierge | Onboarding, Tour Navigation, Talent Routing |
| **People/HR** | Liam Gallagher | HR Operations & Talent Partner | Skill Matrix Profiling, Capability Expansion |
| **Admin/IT** | Chloe Martin | Office Administrator | Virtual Facilities, War Room Reservations |
| **Admin/IT** | Nathan Drake | Head of IT Systems Admin | System Telemetry, Dev Toolchains, psutil |
| **Sales** | Raymond Diaz | VP of Sales & Business Dev | Enterprise Pitching, Value ROI Modeling |
| **Sales** | Isabella Rossi | Growth Marketing & Solutions | Solution Briefs, AI Video Demo Production |
| **Pod 1 (Data)** | Rajiv Menon | Pod Lead - Data & Enterprise | Data Mesh, ETL Pipeline Governance |
| **Pod 1 (Data)** | Vikram Patel | Senior Ab Initio & ETL Specialist | Ab Initio GDE, MFS 4-way, DMLs, DataProfiler |
| **Pod 1 (Data)** | David Chen | Senior Java & Oracle Backend Dev | Java 21, Spring Boot 3, Oracle 23ai, PL/SQL |
| **Pod 1 (Data)** | Priya Sharma | Big Data & SQL Analytics Engineer | Advanced SQL Windows, Polars Data Pipelines |
| **Pod 1 (Data)** | Emily Watson | Senior Data QA & ETL Validator | Great Expectations, Reconciliation Suites |
| **Pod 2 (AI)** | Dr. Kenji Sato | Pod Lead - AI & Intelligent Agents | Multi-Agent Swarms, LangGraph Supervisor |
| **Pod 2 (AI)** | Maya Lin | Senior AI / LLM Engineer | Gemini 1.5 API, Vector Embeddings (Qdrant) |
| **Pod 2 (AI)** | Alex Thorne | Senior Python & Systems Developer | Python 3.12+, FastAPI, Whisper, WebSockets |
| **Pod 2 (AI)** | Sarah Jenkins | AI Model QA & Evaluation Specialist | Promptfoo Benchmarks, Red-Teaming Guardrails |
| **Pod 3 (Web)** | Omar Farooq | Pod Lead - Cloud & Modern Web | Full-Stack Architecture, Microfrontends |
| **Pod 3 (Web)** | Lucas Moreau | Senior Full-Stack & Web Tools Dev | TypeScript, Canvas 2D, Three.js, Web Audio |
| **Pod 3 (Web)** | Zoe Walker | Senior AWS Cloud & DevOps Engineer | AWS ECS Fargate, Terraform IaC, Docker |
| **Pod 3 (Web)** | Carlos Gomez | Senior Automation QA Tester | Playwright E2E, Lighthouse Audits, CI/CD |
| **War Room** | Atlas | Central Office AI Scribe | Real-time Meeting Synthesis, Action Matrix |

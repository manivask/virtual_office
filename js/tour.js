/**
 * HR Guided Office Tour Engine
 * Led by Sophia Bennett (Lead HR Specialist & Virtual Office Concierge)
 * Step-by-step navigation across all 9 zones and 23 agents with speech audio.
 */

class OfficeTourGuide {
  constructor(floorPlan, speechEngine) {
    this.floorPlan = floorPlan;
    this.speech = speechEngine;
    this.currentStepIndex = 0;
    this.isActive = false;

    this.steps = [
      {
        id: "step-hr",
        zoneId: "zone-hr",
        agentId: "hr_sophia",
        title: "Welcome Desk & HR Hub",
        badge: "STEP 1 of 9",
        narrator: "Sophia Bennett (HR Lead & Concierge)",
        guideText: "Welcome to our AI Virtual Enterprise! I'm Sophia Bennett from People Operations. In this modern office, every employee is an autonomous AI agent engineered for specialized technical roles. You can click on anyone anytime to hear them speak in real time, inspect their skills, and assign them tasks. Let's begin our grand tour of all our departments!",
        speechText: "Welcome to our AI Virtual Enterprise! I am Sophia Bennett from People Operations. In this modern office, every employee is an autonomous AI agent engineered for specialized technical roles. Follow me as I guide you through all departments!"
      },
      {
        id: "step-exec",
        zoneId: "zone-exec",
        agentId: "ceo_victoria",
        title: "Executive Suite (CEO & Director)",
        badge: "STEP 2 of 9",
        narrator: "Dr. Victoria Sterling & Marcus Vance",
        guideText: "Here in the Executive Suite, Dr. Victoria Sterling (CEO) shapes our multi-quarter roadmaps and strategic tech vision, while Marcus Vance (Managing Director) oversees delivery metrics, SLA governance, and operational execution across our pods.",
        speechText: "Here in the Executive Suite, CEO Dr. Victoria Sterling guides our enterprise roadmap and strategic vision, while Managing Director Marcus Vance ensures operational excellence and delivery velocity across all our pods."
      },
      {
        id: "step-mgmt",
        zoneId: "zone-mgmt",
        agentId: "mgr_helena",
        title: "Engineering Management & Architecture",
        badge: "STEP 3 of 9",
        narrator: "Helena Zhao & Arthur Pendelton",
        guideText: "This is our technical leadership center. Helena Zhao (Head of Engineering) coordinates agile sprints and removes blockers, while Chief Enterprise Architect Arthur Pendelton authors distributed system blueprints and microservice boundaries.",
        speechText: "This is our technical leadership center. Helena Zhao, Head of Engineering, keeps our sprint cadence sharp, while Chief Enterprise Architect Arthur Pendelton designs scalable system blueprints."
      },
      {
        id: "step-pod1",
        zoneId: "zone-pod1",
        agentId: "lead_rajiv",
        title: "Pod 1: Data Engineering & Enterprise Systems",
        badge: "STEP 4 of 9",
        narrator: "Rajiv Menon & Data Specialists",
        guideText: "Welcome to Pod 1, our powerhouse for mission-critical enterprise data! Led by Rajiv Menon, this pod houses Vikram Patel (Senior Ab Initio ETL specialist), David Chen (Senior Java 21 & Oracle Backend), Priya Sharma (Big Data & SQL Analytics), and Emily Watson (Data QA). They handle heavy ETL pipelines, data profiling, and database health.",
        speechText: "Welcome to Pod 1, our data engineering powerhouse! Led by Rajiv Menon, featuring Vikram Patel on Ab Initio graphs, David Chen on Java and Oracle databases, Priya Sharma on Big Data SQL, and Emily Watson on automated data quality."
      },
      {
        id: "step-pod2",
        zoneId: "zone-pod2",
        agentId: "lead_kenji",
        title: "Pod 2: AI & Cognitive Systems",
        badge: "STEP 5 of 9",
        narrator: "Dr. Kenji Sato & AI Engineers",
        guideText: "Step into Pod 2, the brain center for cutting-edge Artificial Intelligence! Led by Dr. Kenji Sato, this pod features Maya Lin (LLMs & RAG embeddings), Alex Thorne (Python FastAPI & Audio/Video agents), and Sarah Jenkins (AI Model Red-Teaming & QA). They power our workspace LLM apps, video agent studios, and speech APIs.",
        speechText: "Here is Pod 2, our Artificial Intelligence brain center! Led by Dr. Kenji Sato, with Maya Lin developing LLM RAG pipelines, Alex Thorne building high-performance Python services, and Sarah Jenkins benchmarking model evaluation."
      },
      {
        id: "step-pod3",
        zoneId: "zone-pod3",
        agentId: "lead_omar",
        title: "Pod 3: Cloud Infrastructure & Modern Web Tools",
        badge: "STEP 6 of 9",
        narrator: "Omar Farooq & Web/Cloud Team",
        guideText: "Here is Pod 3, building user-facing web tools and cloud platforms! Led by Omar Farooq, featuring Lucas Moreau (Modern Web UI, interactive canvas & audio tools), Zoe Walker (AWS Cloud, Terraform & DevOps), and Carlos Gomez (Playwright automation QA). They ensure lightning-fast browser performance and seamless cloud delivery.",
        speechText: "Here is Pod 3, our Cloud and Modern Web Tools team! Led by Omar Farooq, with Lucas Moreau crafting responsive web interfaces, Zoe Walker automating AWS cloud infrastructure, and Carlos Gomez running Playwright end-to-end testing."
      },
      {
        id: "step-sales",
        zoneId: "zone-sales",
        agentId: "sales_raymond",
        title: "Sales & Client Solutions Hub",
        badge: "STEP 7 of 9",
        narrator: "Raymond Diaz & Isabella Rossi",
        guideText: "In our commercial wing, Raymond Diaz (VP of Sales) takes client requirements and transforms them into enterprise statements of work, while Isabella Rossi (Product Solutions) creates interactive product briefs, client case studies, and market intelligence.",
        speechText: "In our commercial wing, Raymond Diaz, VP of Sales, and Isabella Rossi, Solutions Specialist, translate client needs into high-impact deliverables and product demonstrations."
      },
      {
        id: "step-admin",
        zoneId: "zone-admin",
        agentId: "adm_chloe",
        title: "Office Administration & IT Server Hub",
        badge: "STEP 8 of 9",
        narrator: "Chloe Martin & Nathan Drake",
        guideText: "Behind our smooth operation are Chloe Martin (Facilities & Meeting Logistics) and Nathan Drake (Head of IT Systems), who monitors our developer toolchains, server clusters, and system CPU health.",
        speechText: "Behind our smooth daily operation are Chloe Martin orchestrating office facilities and Nathan Drake managing IT systems and developer toolchains."
      },
      {
        id: "step-warroom",
        zoneId: "zone-conf",
        agentId: "ai_bot_concierge",
        title: "Central War Room & Interactive Collaboration",
        badge: "STEP 9 of 9",
        narrator: "Sophia Bennett & Atlas",
        guideText: "Finally, here is our Central War Room where all teams congregate for strategic hackathons, sprint demos, and cross-pod collaboration! You are now fully oriented. Feel free to click on any agent across the floor to hear them speak, inspect their tech stack, or assign your next project!",
        speechText: "Finally, here is our Central War Room! You are now fully oriented. Feel free to explore the floor, click any agent to hear their real-time voice, and assign your next project!"
      }
    ];
  }

  start() {
    this.isActive = true;
    this.currentStepIndex = 0;
    this.showTourBanner();
    this.goToStep(0);
  }

  showTourBanner() {
    let banner = document.getElementById("tour-hud-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "tour-hud-banner";
      banner.className = "tour-hud-banner";
      document.body.appendChild(banner);
    }
    banner.style.display = "flex";
  }

  hideTourBanner() {
    const banner = document.getElementById("tour-hud-banner");
    if (banner) banner.style.display = "none";
  }

  goToStep(index) {
    if (index < 0 || index >= this.steps.length) {
      this.end();
      return;
    }

    this.currentStepIndex = index;
    const step = this.steps[index];

    // Highlight zone and agent on floor plan
    if (this.floorPlan) {
      this.floorPlan.highlightZone(step.zoneId);
      this.floorPlan.selectAgent(step.agentId, false);
    }

    // Render Tour HUD UI
    this.renderTourHUD(step);

    // Speak stage narrative with Sophia's voice
    const sophiaAgent = OFFICE_AGENTS.find(a => a.id === "hr_sophia") || OFFICE_AGENTS[4];
    if (this.speech && !this.speech.isMuted) {
      this.speech.speak(sophiaAgent, step.speechText);
    }
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      this.end();
    }
  }

  previous() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  end() {
    this.isActive = false;
    this.hideTourBanner();
    if (this.speech) this.speech.stop();
    if (this.floorPlan) {
      this.floorPlan.resetView();
    }
  }

  renderTourHUD(step) {
    const banner = document.getElementById("tour-hud-banner");
    if (!banner) return;

    const progressPct = ((this.currentStepIndex + 1) / this.steps.length) * 100;

    banner.innerHTML = `
      <div class="tour-hud-content">
        <div class="tour-hud-header">
          <div class="tour-hud-avatar-box">
            <span class="tour-guide-badge">HR GUIDE</span>
            <div class="tour-avatar-circle">👩‍💼</div>
          </div>
          <div class="tour-hud-titles">
            <span class="tour-step-pill">${step.badge}</span>
            <h3 class="tour-step-title">${step.title}</h3>
            <span class="tour-narrator">Featuring: ${step.narrator}</span>
          </div>
          <div class="tour-hud-progress-wrapper">
            <div class="tour-progress-bar">
              <div class="tour-progress-fill" style="width: ${progressPct}%"></div>
            </div>
            <span class="tour-progress-text">${this.currentStepIndex + 1} / ${this.steps.length}</span>
          </div>
        </div>

        <div class="tour-hud-body">
          <p class="tour-guide-speech">"${step.guideText}"</p>
        </div>

        <div class="tour-hud-actions">
          <button class="tour-btn tour-btn-secondary" id="tour-prev-btn" ${this.currentStepIndex === 0 ? "disabled" : ""}>
            ← Previous
          </button>
          <button class="tour-btn tour-btn-audio" id="tour-replay-audio-btn" title="Replay Voice">
            🔊 Replay Voice
          </button>
          <button class="tour-btn tour-btn-primary" id="tour-next-btn">
            ${this.currentStepIndex === this.steps.length - 1 ? "Finish Tour 🎉" : "Next Department →"}
          </button>
          <button class="tour-btn tour-btn-close" id="tour-exit-btn" title="Close Tour">
            ✕ Exit Tour
          </button>
        </div>
      </div>
    `;

    // Bind event listeners
    document.getElementById("tour-prev-btn")?.addEventListener("click", () => this.previous());
    document.getElementById("tour-next-btn")?.addEventListener("click", () => this.next());
    document.getElementById("tour-exit-btn")?.addEventListener("click", () => this.end());
    document.getElementById("tour-replay-audio-btn")?.addEventListener("click", () => {
      const sophiaAgent = OFFICE_AGENTS.find(a => a.id === "hr_sophia") || OFFICE_AGENTS[4];
      if (this.speech) this.speech.speak(sophiaAgent, step.speechText);
    });
  }
}

window.OfficeTourGuide = OfficeTourGuide;

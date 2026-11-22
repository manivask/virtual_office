/**
 * Virtual Office Core Application
 * Coordinates FloorPlan, Speech Engine, Tour Guide, Agent Dossier Modal,
 * Task Assignment drawer, Search/Filter bar, and Audio HUD.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const container = document.getElementById("floorplan-viewport");
  const modal = document.getElementById("agent-dossier-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const welcomeModal = document.getElementById("welcome-onboarding-modal");
  const startTourWelcomeBtn = document.getElementById("welcome-start-tour-btn");
  const exploreOfficeWelcomeBtn = document.getElementById("welcome-explore-btn");
  const headerTourBtn = document.getElementById("header-tour-btn");
  const muteBtn = document.getElementById("mute-toggle-btn");
  const zoomInBtn = document.getElementById("zoom-in-btn");
  const zoomOutBtn = document.getElementById("zoom-out-btn");
  const resetZoomBtn = document.getElementById("reset-zoom-btn");
  const searchInput = document.getElementById("agent-search-input");
  const deptFilterSelect = document.getElementById("dept-filter-select");
  const liveAudioWaveCanvas = document.getElementById("modal-audio-wave");
  const bottomAudioBar = document.getElementById("bottom-audio-bar");
  const bottomSpeakerName = document.getElementById("bottom-speaker-name");
  const bottomSpeakerText = document.getElementById("bottom-speaker-text");
  const bottomStopAudioBtn = document.getElementById("bottom-stop-audio-btn");

  let currentActiveAgent = null;

  // Initialize Speech Engine Visualizer Canvas
  if (liveAudioWaveCanvas) {
    window.agentSpeech.setVisualizerCanvas(liveAudioWaveCanvas);
  }

  // Initialize Floor Plan
  const floorPlan = new OfficeFloorPlan("floorplan-viewport", {
    onAgentClick: (agent) => {
      openAgentDossier(agent, true);
    },
    onZoneClick: (zone) => {
      console.log("Clicked zone:", zone.name);
    }
  });

  // Initialize Tour Guide
  const tourGuide = new OfficeTourGuide(floorPlan, window.agentSpeech);

  // Welcome modal handlers
  if (welcomeModal) {
    welcomeModal.classList.add("modal-open");

    startTourWelcomeBtn?.addEventListener("click", () => {
      welcomeModal.classList.remove("modal-open");
      tourGuide.start();
    });

    exploreOfficeWelcomeBtn?.addEventListener("click", () => {
      welcomeModal.classList.remove("modal-open");
      // Greet briefly with Sophia's welcoming voice
      const sophia = OFFICE_AGENTS.find(a => a.id === "hr_sophia");
      if (sophia && !window.agentSpeech.isMuted) {
        window.agentSpeech.speak(sophia, "Welcome to our Virtual AI Office! Feel free to click on anyone across the floor to hear them introduce themselves and assign projects.");
      }
    });
  }

  // Header Tour Button
  headerTourBtn?.addEventListener("click", () => {
    tourGuide.start();
  });

  // Zoom controls
  zoomInBtn?.addEventListener("click", () => floorPlan.zoom(1.2));
  zoomOutBtn?.addEventListener("click", () => floorPlan.zoom(0.8));
  resetZoomBtn?.addEventListener("click", () => floorPlan.resetView());

  // Mute control
  const updateMuteUI = () => {
    if (window.agentSpeech.isMuted) {
      muteBtn.innerHTML = `🔇 <span>Muted</span>`;
      muteBtn.classList.add("btn-muted");
    } else {
      muteBtn.innerHTML = `🔊 <span>Voice ON</span>`;
      muteBtn.classList.remove("btn-muted");
    }
  };
  updateMuteUI();

  muteBtn?.addEventListener("click", () => {
    window.agentSpeech.toggleMute();
    updateMuteUI();
  });

  // Bottom Audio bar controls
  bottomStopAudioBtn?.addEventListener("click", () => {
    window.agentSpeech.stop();
  });

  // Global Speech State Listener
  window.agentSpeech.onStateChange((isSpeaking, agent, text) => {
    if (isSpeaking) {
      bottomAudioBar?.classList.add("bar-active");
      if (bottomSpeakerName) {
        bottomSpeakerName.textContent = agent ? `${agent.name} (${agent.designation})` : "Virtual Assistant";
      }
      if (bottomSpeakerText) {
        bottomSpeakerText.textContent = `"${text}"`;
      }
      // Update speaking badge in modal if open
      const modalSpeakingBadge = document.getElementById("modal-speaking-badge");
      if (modalSpeakingBadge) modalSpeakingBadge.style.display = "inline-flex";
    } else {
      bottomAudioBar?.classList.remove("bar-active");
      const modalSpeakingBadge = document.getElementById("modal-speaking-badge");
      if (modalSpeakingBadge) modalSpeakingBadge.style.display = "none";
    }
  });

  // Search and Filter logic
  function applyFilters() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const dept = deptFilterSelect?.value || "ALL";

    floorPlan.filterAgents(agent => {
      const matchDept = (dept === "ALL") || 
        (dept === "EXEC" && agent.department.includes("Executive")) ||
        (dept === "MGMT" && (agent.department.includes("Leadership") || agent.department.includes("Architecture"))) ||
        (dept === "HR" && agent.department.includes("People")) ||
        (dept === "ADMIN" && agent.department.includes("Admin")) ||
        (dept === "SALES" && agent.department.includes("Sales")) ||
        (dept === "POD1" && agent.pod === "Pod 1") ||
        (dept === "POD2" && agent.pod === "Pod 2") ||
        (dept === "POD3" && agent.pod === "Pod 3");

      const matchQuery = !query ||
        agent.name.toLowerCase().includes(query) ||
        agent.designation.toLowerCase().includes(query) ||
        agent.department.toLowerCase().includes(query) ||
        agent.coreSkills.some(skill => skill.toLowerCase().includes(query)) ||
        (agent.workspaceApps && agent.workspaceApps.some(app => app.toLowerCase().includes(query)));

      return matchDept && matchQuery;
    });
  }

  searchInput?.addEventListener("input", applyFilters);
  deptFilterSelect?.addEventListener("change", applyFilters);

  // Quick skill tags in search area
  document.querySelectorAll(".quick-filter-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const skill = tag.dataset.skill;
      if (searchInput) {
        searchInput.value = skill;
        applyFilters();
      }
    });
  });

  // Open Agent Dossier Modal
  function openAgentDossier(agent, triggerSpeech = true) {
    currentActiveAgent = agent;
    floorPlan.selectAgent(agent.id, false);

    // Populate Modal Content
    document.getElementById("modal-avatar-initials").textContent = agent.avatarInitials;
    document.getElementById("modal-avatar-box").style.borderColor = agent.avatarColor;
    document.getElementById("modal-avatar-box").style.backgroundColor = `${agent.avatarColor}20`;
    document.getElementById("modal-agent-name").textContent = agent.name;
    document.getElementById("modal-agent-designation").textContent = agent.designation;
    document.getElementById("modal-agent-dept").textContent = `${agent.department} • ${agent.deskNumber}`;
    document.getElementById("modal-agent-status").textContent = agent.status;
    document.getElementById("modal-agent-bio").textContent = agent.bio;
    document.getElementById("modal-how-they-work").textContent = agent.howTheyWork;

    // Skills Badges
    const skillsList = document.getElementById("modal-skills-list");
    if (skillsList) {
      skillsList.innerHTML = agent.coreSkills.map(skill => `
        <span class="skill-badge" style="border-color: ${agent.avatarColor}40; background: ${agent.avatarColor}15; color: #e2e8f0;">
          ⚡ ${skill}
        </span>
      `).join("");
    }

    // Workspace Apps
    const appsList = document.getElementById("modal-apps-list");
    if (appsList) {
      appsList.innerHTML = (agent.workspaceApps || []).map(app => `
        <span class="app-badge">
          📁 ${app}
        </span>
      `).join("");
    }

    // Sample Task Prompts
    const tasksContainer = document.getElementById("modal-sample-tasks");
    if (tasksContainer) {
      tasksContainer.innerHTML = (agent.sampleTasks || []).map(task => `
        <div class="sample-task-item" data-task="${escapeHtml(task)}">
          <span class="task-bullet">👉</span>
          <span class="task-text">${task}</span>
          <button class="use-task-btn" title="Use Prompt">Assign</button>
        </div>
      `).join("");

      tasksContainer.querySelectorAll(".sample-task-item").forEach(item => {
        item.addEventListener("click", () => {
          const promptInput = document.getElementById("task-assignment-input");
          if (promptInput) {
            promptInput.value = item.dataset.task;
            promptInput.focus();
          }
        });
      });
    }

    // System Prompt View
    const systemPromptEl = document.getElementById("modal-system-prompt");
    if (systemPromptEl) {
      systemPromptEl.textContent = agent.systemPrompt || "Autonomous Agent Ready.";
    }

    // Clear previous task responses
    const responseBox = document.getElementById("task-response-container");
    if (responseBox) {
      responseBox.style.display = "none";
      responseBox.innerHTML = "";
    }

    // Open Modal
    modal?.classList.add("modal-open");

    // Play Voice Introduction
    if (triggerSpeech && !window.agentSpeech.isMuted) {
      window.agentSpeech.speak(agent, agent.speechIntro);
    }
  }

  // Modal Voice Buttons
  document.getElementById("modal-speak-intro-btn")?.addEventListener("click", () => {
    if (currentActiveAgent) {
      window.agentSpeech.speak(currentActiveAgent, currentActiveAgent.speechIntro);
    }
  });

  document.getElementById("modal-stop-speech-btn")?.addEventListener("click", () => {
    window.agentSpeech.stop();
  });

  // Modal Close
  modalCloseBtn?.addEventListener("click", () => {
    modal?.classList.remove("modal-open");
    window.agentSpeech.stop();
  });

  // Close on outside click
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("modal-open");
      window.agentSpeech.stop();
    }
  });

  // Escape key closes modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal?.classList.remove("modal-open");
      welcomeModal?.classList.remove("modal-open");
      tourGuide.end();
      window.agentSpeech.stop();
    }
  });

  // Task Assignment Execution Handler
  const sendTaskBtn = document.getElementById("send-task-btn");
  const taskInput = document.getElementById("task-assignment-input");
  const taskResponseContainer = document.getElementById("task-response-container");

  function executeAssignedTask() {
    if (!currentActiveAgent || !taskInput) return;
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    if (taskResponseContainer) {
      taskResponseContainer.style.display = "block";
      taskResponseContainer.innerHTML = `
        <div class="agent-thinking">
          <span class="spinner-dot"></span>
          <span>${currentActiveAgent.name} is processing the prompt with their specialized knowledge base...</span>
        </div>
      `;
    }

    // Simulate agent autonomous reasoning response
    setTimeout(() => {
      const responseHtml = generateAgentResponse(currentActiveAgent, taskText);
      if (taskResponseContainer) {
        taskResponseContainer.innerHTML = responseHtml;
      }

      // Agent speaks a brief confirmation
      const confirmationSpeech = `I have analyzed the request: "${taskText.substring(0, 50)}...". Plan formulated and executed with my ${currentActiveAgent.coreSkills[0]} knowledge base.`;
      if (!window.agentSpeech.isMuted) {
        window.agentSpeech.speak(currentActiveAgent, confirmationSpeech);
      }
    }, 1200);
  }

  sendTaskBtn?.addEventListener("click", executeAssignedTask);
  taskInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeAssignedTask();
    }
  });

  function generateAgentResponse(agent, prompt) {
    const timeStr = new Date().toLocaleTimeString();
    return `
      <div class="agent-execution-result">
        <div class="result-header">
          <span class="result-badge">⚡ AUTONOMOUS AGENT EXECUTION</span>
          <span class="result-time">${timeStr}</span>
        </div>
        <div class="result-body">
          <p><strong>Assignment Received:</strong> <em>"${escapeHtml(prompt)}"</em></p>
          <div class="result-breakdown">
            <h4>📋 Execution Plan by ${agent.name}:</h4>
            <ul>
              <li><strong>Step 1 (Context Ingestion):</strong> Loaded workspace models and relevant dependencies: <code>${(agent.workspaceApps || ["core"]).join(", ")}</code>.</li>
              <li><strong>Step 2 (Technical Execution):</strong> Applied specialized domain algorithms leveraging <strong>${agent.coreSkills.slice(0, 3).join(", ")}</strong>.</li>
              <li><strong>Step 3 (Quality & Validation):</strong> Verified against architectural compliance standards and security baselines.</li>
            </ul>
            <div class="result-summary-box">
              <strong>✅ Status:</strong> Task successfully analyzed and scheduled in ${agent.department} queue. Ready for deep execution and code integration.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
});

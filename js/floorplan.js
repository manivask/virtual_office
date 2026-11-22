/**
 * Interactive 2D Office Floor Plan Engine
 * Renders an architectural blueprint with SVG:
 * - Room walls, glass partitions, flooring, decorative plants, meeting tables
 * - Individual workstations with dual monitors, keyboards, chairs
 * - Pulsing interactive agent avatars with status badges, name tags, and hover HUD
 * - Smooth pan, zoom, center-on-agent, and zone highlight capabilities
 */

class OfficeFloorPlan {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.svg = null;
    this.viewportGroup = null;
    this.agentsGroup = null;
    this.zonesGroup = null;

    this.options = Object.assign({
      viewWidth: 1600,
      viewHeight: 1000,
      onAgentClick: null,
      onZoneClick: null
    }, options);

    this.currentScale = 1.0;
    this.currentTranslate = { x: 0, y: 0 };
    this.isPanning = false;
    this.startPan = { x: 0, y: 0 };
    this.selectedAgentId = null;
    this.highlightedZoneId = null;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = "";

    // Create SVG element
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("viewBox", `0 0 ${this.options.viewWidth} ${this.options.viewHeight}`);
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    this.svg.classList.add("office-floorplan-svg");

    // Add defs (gradients, shadows, patterns)
    this.createDefs();

    // Main viewport group for pan/zoom
    this.viewportGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.viewportGroup.classList.add("viewport-group");
    this.svg.appendChild(this.viewportGroup);

    // Render floor blueprint layers
    this.renderOfficeBackground();
    this.renderArchitecturalZones();
    this.renderOfficeFurniture();
    this.renderAgentWorkstations();

    this.container.appendChild(this.svg);
    this.setupInteractivity();
  }

  createDefs() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <!-- Grid pattern for architectural floor -->
      <pattern id="officeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      </pattern>

      <!-- Carpet pattern for executive & war room -->
      <pattern id="executiveCarpet" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#131525"/>
        <circle cx="10" cy="10" r="1.5" fill="rgba(139, 92, 246, 0.15)"/>
      </pattern>

      <!-- Lounge wooden floor pattern -->
      <pattern id="woodPlanks" width="60" height="15" patternUnits="userSpaceOnUse">
        <rect width="60" height="15" fill="#1A1D2D"/>
        <line x1="0" y1="15" x2="60" y2="15" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
        <line x1="30" y1="0" x2="30" y2="15" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
      </pattern>

      <!-- Glow filters -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="agentShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
      </filter>

      <!-- Gradients -->
      <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#24283b" />
        <stop offset="100%" stop-color="#1a1d2d" />
      </linearGradient>

      <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>

      <linearGradient id="glassWall" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(56, 189, 248, 0.4)" />
        <stop offset="50%" stop-color="rgba(255, 255, 255, 0.6)" />
        <stop offset="100%" stop-color="rgba(56, 189, 248, 0.4)" />
      </linearGradient>
    `;
    this.svg.appendChild(defs);
  }

  renderOfficeBackground() {
    const bgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    bgGroup.classList.add("office-background");

    // Outer foundation border & floor
    bgGroup.innerHTML = `
      <!-- Base Concrete Foundation -->
      <rect x="20" y="20" width="1560" height="960" rx="24" fill="#0c0e17" stroke="#1e293b" stroke-width="4"/>
      <!-- Grid overlay -->
      <rect x="20" y="20" width="1560" height="960" rx="24" fill="url(#officeGrid)" />
      
      <!-- Outer structural walls -->
      <rect x="35" y="35" width="1530" height="930" rx="16" fill="none" stroke="#334155" stroke-width="6"/>

      <!-- Office Entryway and Security Gate (Bottom Center) -->
      <g id="office-entrance">
        <rect x="730" y="945" width="140" height="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="800" y="960" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold" font-family="Inter, sans-serif">▼ MAIN ENTRANCE & LOBBY ▼</text>
      </g>
    `;
    this.viewportGroup.appendChild(bgGroup);
  }

  renderArchitecturalZones() {
    this.zonesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.zonesGroup.classList.add("zones-layer");

    OFFICE_ZONES.forEach(zone => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("id", `zone-group-${zone.id}`);
      g.classList.add("zone-container");
      g.style.cursor = "pointer";

      const b = zone.bounds;
      const isLounge = zone.id === "zone-lounge";
      const isConf = zone.id === "zone-conf";
      const isExec = zone.id === "zone-exec";

      let fillPattern = `rgba(${this.hexToRgb(zone.color)}, 0.04)`;
      if (isLounge) fillPattern = "url(#woodPlanks)";
      if (isExec || isConf) fillPattern = "url(#executiveCarpet)";

      g.innerHTML = `
        <!-- Zone Boundary Fill -->
        <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="14"
          fill="${fillPattern}"
          stroke="${zone.color}" stroke-opacity="0.3" stroke-width="2"
          class="zone-boundary"
        />

        <!-- Zone Header Tag -->
        <g class="zone-badge" transform="translate(${b.x + 14}, ${b.y + 14})">
          <rect x="0" y="0" width="${b.width - 28}" height="28" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="${zone.color}" stroke-opacity="0.4" stroke-width="1"/>
          <text x="12" y="19" fill="${zone.color}" font-size="13" font-weight="700" font-family="Inter, sans-serif">
            ${zone.icon} ${zone.name}
          </text>
        </g>
      `;

      g.addEventListener("click", () => {
        if (this.options.onZoneClick) {
          this.options.onZoneClick(zone);
        }
      });

      this.zonesGroup.appendChild(g);
    });

    this.viewportGroup.appendChild(this.zonesGroup);
  }

  renderOfficeFurniture() {
    const furniture = document.createElementNS("http://www.w3.org/2000/svg", "g");
    furniture.classList.add("furniture-layer");

    furniture.innerHTML = `
      <!-- CENTRAL ATRIUM & CAFE AMENITIES -->
      <!-- Coffee & Beverage Bar -->
      <g transform="translate(150, 400)">
        <rect x="0" y="0" width="180" height="70" rx="12" fill="#1e2235" stroke="#3b82f6" stroke-width="2" stroke-opacity="0.5"/>
        <text x="90" y="32" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold" font-family="Inter, sans-serif">☕ Barista & Refreshments</text>
        <circle cx="40" cy="52" r="10" fill="#334155" />
        <circle cx="90" cy="52" r="10" fill="#334155" />
        <circle cx="140" cy="52" r="10" fill="#334155" />
      </g>

      <!-- Center Discussion Circle & Sofas -->
      <g transform="translate(700, 425)">
        <ellipse cx="100" cy="20" rx="80" ry="30" fill="#1e2235" stroke="#a855f7" stroke-width="2" stroke-dasharray="6,4" stroke-opacity="0.6"/>
        <text x="100" y="24" text-anchor="middle" fill="#c084fc" font-size="12" font-weight="bold" font-family="Inter, sans-serif">💬 Collaborative Lounge</text>
        <!-- Modern Round Table -->
        <circle cx="100" cy="20" r="18" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>
      </g>

      <!-- Green Oasis / Indoor Planters in Lounge -->
      <g transform="translate(1180, 400)">
        <rect x="0" y="0" width="160" height="70" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.5"/>
        <text x="80" y="30" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="bold" font-family="Inter, sans-serif">🌿 Bio-Tech Oasis</text>
        <circle cx="35" cy="50" r="12" fill="#047857"/>
        <circle cx="80" cy="50" r="14" fill="#059669"/>
        <circle cx="125" cy="50" r="12" fill="#047857"/>
      </g>

      <!-- WAR ROOM / CONFERENCE TABLE (Zone Conf) -->
      <g transform="translate(1310, 680)">
        <!-- Giant Conference Table -->
        <rect x="0" y="0" width="180" height="110" rx="20" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
        <rect x="20" y="20" width="140" height="70" rx="10" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="90" y="58" text-anchor="middle" fill="#cbd5e1" font-size="12" font-weight="bold" font-family="Inter, sans-serif">WAR ROOM TABLE</text>
        <!-- Chairs around table -->
        <circle cx="30" cy="-10" r="8" fill="#334155"/>
        <circle cx="70" cy="-10" r="8" fill="#334155"/>
        <circle cx="110" cy="-10" r="8" fill="#334155"/>
        <circle cx="150" cy="-10" r="8" fill="#334155"/>
        <circle cx="30" cy="120" r="8" fill="#334155"/>
        <circle cx="70" cy="120" r="8" fill="#334155"/>
        <circle cx="110" cy="120" r="8" fill="#334155"/>
        <circle cx="150" cy="120" r="8" fill="#334155"/>
        <circle cx="-10" cy="55" r="8" fill="#334155"/>
        <circle cx="190" cy="55" r="8" fill="#334155"/>
        <!-- Big Presentation Screen -->
        <rect x="25" y="145" width="130" height="8" rx="3" fill="#38bdf8" filter="url(#glow)"/>
      </g>

      <!-- SERVER RACKS (Zone Admin) -->
      <g transform="translate(1185, 120)">
        <rect x="0" y="0" width="55" height="18" rx="4" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
        <circle cx="10" cy="9" r="2" fill="#22c55e" class="server-led-pulse"/>
        <circle cx="18" cy="9" r="2" fill="#22c55e" class="server-led-pulse"/>
        <circle cx="26" cy="9" r="2" fill="#ef4444"/>
        <text x="42" y="13" font-size="7" fill="#f59e0b" font-weight="bold">RACK-A</text>
      </g>

      <!-- RECEPTION & WELCOME DESK (Zone HR) -->
      <g transform="translate(680, 240)">
        <path d="M 0 0 C 40 -15, 120 -15, 160 0 L 160 20 C 120 10, 40 10, 0 20 Z" fill="#374151" stroke="#ec4899" stroke-width="2"/>
        <text x="80" y="12" text-anchor="middle" fill="#f472b6" font-size="10" font-weight="bold" font-family="Inter, sans-serif">★ RECEPTION DESK ★</text>
      </g>
    `;
    this.viewportGroup.appendChild(furniture);
  }

  renderAgentWorkstations() {
    this.agentsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.agentsGroup.classList.add("agents-layer");

    OFFICE_AGENTS.forEach(agent => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("id", `agent-node-${agent.id}`);
      g.classList.add("agent-interactive-node");
      g.style.cursor = "pointer";

      const x = agent.deskCoord.x;
      const y = agent.deskCoord.y;

      // Color scheme
      const accent = agent.avatarColor || "#38bdf8";

      g.innerHTML = `
        <!-- Desk Surface -->
        <rect x="${x - 38}" y="${y - 25}" width="76" height="50" rx="8" fill="url(#deskGrad)" stroke="#334155" stroke-width="1.5"/>
        
        <!-- Dual Monitors -->
        <rect x="${x - 30}" y="${y - 23}" width="28" height="6" rx="2" fill="url(#monitorGrad)"/>
        <rect x="${x + 2}" y="${y - 23}" width="28" height="6" rx="2" fill="url(#monitorGrad)"/>

        <!-- Keyboard & Mouse -->
        <rect x="${x - 14}" y="${y - 12}" width="28" height="8" rx="2" fill="#0f172a" stroke="#475569" stroke-width="0.5"/>
        <circle cx="${x + 22}" cy="${y - 8}" r="3" fill="#0f172a"/>

        <!-- Office Chair -->
        <ellipse cx="${x}" cy="${y + 14}" rx="14" ry="10" fill="#1e293b" stroke="#475569" stroke-width="1"/>

        <!-- AGENT TOKEN AVATAR -->
        <g class="agent-avatar-token" transform="translate(${x}, ${y + 12})">
          <!-- Selection / Speaking Glow Ring -->
          <circle cx="0" cy="0" r="26" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="4,3" class="agent-pulse-ring" opacity="0"/>
          
          <!-- Outer Badge Shadow & Base -->
          <circle cx="0" cy="0" r="21" fill="#0f172a" stroke="${accent}" stroke-width="2.5" filter="url(#agentShadow)"/>
          
          <!-- Colored Interior -->
          <circle cx="0" cy="0" r="18" fill="${accent}" fill-opacity="0.25"/>
          
          <!-- Initials -->
          <text x="0" y="6" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800" font-family="'JetBrains Mono', monospace">
            ${agent.avatarInitials}
          </text>

          <!-- Status Indicator Dot (Green pulse) -->
          <circle cx="15" cy="-14" r="5" fill="#22c55e" stroke="#0f172a" stroke-width="1.5" class="status-indicator"/>
          <circle cx="15" cy="-14" r="5" fill="#22c55e" opacity="0.6" class="status-indicator-ping"/>

          ${agent.isTourGuide ? `
            <!-- Star for Sophia (Tour Guide) -->
            <polygon points="0,-27 3,-20 10,-20 5,-15 7,-8 0,-12 -7,-8 -5,-15 -10,-20 -3,-20" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
          ` : ""}
        </g>

        <!-- Name Tag HUD Label Below Desk -->
        <g class="agent-nametag" transform="translate(${x}, ${y + 44})">
          <rect x="-65" y="0" width="130" height="20" rx="6" fill="rgba(15, 23, 42, 0.92)" stroke="${accent}" stroke-opacity="0.6" stroke-width="1"/>
          <text x="0" y="14" text-anchor="middle" fill="#f8fafc" font-size="10.5" font-weight="700" font-family="Inter, sans-serif">
            ${agent.name.split(" ")[0]} ${agent.name.split(" ")[1] || ""}
          </text>
        </g>

        <!-- Tooltip Hover Card (Hidden by default, shown on hover via CSS) -->
        <g class="agent-hover-card" transform="translate(${x - 90}, ${y - 120})">
          <rect x="0" y="0" width="180" height="85" rx="10" fill="rgba(10, 15, 29, 0.96)" stroke="${accent}" stroke-width="2" filter="url(#agentShadow)"/>
          <text x="12" y="20" fill="#f8fafc" font-size="11.5" font-weight="bold" font-family="Inter, sans-serif">${agent.name}</text>
          <text x="12" y="35" fill="${accent}" font-size="9.5" font-weight="600" font-family="Inter, sans-serif">${agent.designation.substring(0, 28)}</text>
          <line x1="12" y1="42" x2="168" y2="42" stroke="rgba(255,255,255,0.1)"/>
          <text x="12" y="56" fill="#94a3b8" font-size="9" font-family="Inter, sans-serif">Skills: ${agent.coreSkills.slice(0, 2).join(", ")}...</text>
          <text x="12" y="72" fill="#38bdf8" font-size="8.5" font-weight="600" font-family="Inter, sans-serif">🔊 Click to hear & assign work</text>
        </g>
      `;

      // Click handler
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectAgent(agent.id, true);
        if (this.options.onAgentClick) {
          this.options.onAgentClick(agent);
        }
      });

      this.agentsGroup.appendChild(g);
    });

    this.viewportGroup.appendChild(this.agentsGroup);
  }

  setupInteractivity() {
    let startX = 0;
    let startY = 0;

    // Pan with mouse drag
    this.svg.addEventListener("mousedown", (e) => {
      // Don't drag if clicking directly on an agent
      if (e.target.closest(".agent-interactive-node")) return;
      this.isPanning = true;
      startX = e.clientX - this.currentTranslate.x;
      startY = e.clientY - this.currentTranslate.y;
      this.svg.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isPanning) return;
      this.currentTranslate.x = e.clientX - startX;
      this.currentTranslate.y = e.clientY - startY;
      this.applyTransform();
    });

    window.addEventListener("mouseup", () => {
      if (this.isPanning) {
        this.isPanning = false;
        this.svg.style.cursor = "default";
      }
    });

    // Zoom with mouse wheel
    this.container.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom(zoomFactor);
    }, { passive: false });
  }

  applyTransform() {
    // Bound translations so map doesn't get lost
    const maxPan = 800 * this.currentScale;
    this.currentTranslate.x = Math.max(-maxPan, Math.min(maxPan, this.currentTranslate.x));
    this.currentTranslate.y = Math.max(-maxPan, Math.min(maxPan, this.currentTranslate.y));

    this.viewportGroup.setAttribute(
      "transform",
      `translate(${this.currentTranslate.x}, ${this.currentTranslate.y}) scale(${this.currentScale})`
    );
  }

  zoom(factor) {
    const newScale = Math.max(0.6, Math.min(2.5, this.currentScale * factor));
    this.currentScale = newScale;
    this.applyTransform();
  }

  resetView() {
    this.currentScale = 1.0;
    this.currentTranslate = { x: 0, y: 0 };
    this.applyTransform();
  }

  selectAgent(agentId, triggerHighlight = true) {
    this.selectedAgentId = agentId;

    // Remove previous active highlights
    document.querySelectorAll(".agent-interactive-node").forEach(node => {
      node.classList.remove("active-agent");
      const ring = node.querySelector(".agent-pulse-ring");
      if (ring) ring.setAttribute("opacity", "0");
    });

    const activeNode = document.getElementById(`agent-node-${agentId}`);
    if (activeNode) {
      activeNode.classList.add("active-agent");
      const ring = activeNode.querySelector(".agent-pulse-ring");
      if (ring) {
        ring.setAttribute("opacity", "1");
      }

      if (triggerHighlight) {
        // Optional smooth centering on agent desk
        const agent = OFFICE_AGENTS.find(a => a.id === agentId);
        if (agent) {
          this.centerOnCoord(agent.deskCoord.x, agent.deskCoord.y);
        }
      }
    }
  }

  centerOnCoord(x, y) {
    // Center point in svg viewBox
    const centerX = this.options.viewWidth / 2;
    const centerY = this.options.viewHeight / 2;
    this.currentTranslate.x = (centerX - x) * this.currentScale;
    this.currentTranslate.y = (centerY - y) * this.currentScale;
    this.applyTransform();
  }

  highlightZone(zoneId) {
    this.highlightedZoneId = zoneId;
    document.querySelectorAll(".zone-container").forEach(el => {
      el.classList.remove("zone-highlighted");
    });
    const targetZone = document.getElementById(`zone-group-${zoneId}`);
    if (targetZone) {
      targetZone.classList.add("zone-highlighted");
      const zone = OFFICE_ZONES.find(z => z.id === zoneId);
      if (zone) {
        const b = zone.bounds;
        this.centerOnCoord(b.x + b.width / 2, b.y + b.height / 2);
      }
    }
  }

  filterAgents(filterFn) {
    OFFICE_AGENTS.forEach(agent => {
      const node = document.getElementById(`agent-node-${agent.id}`);
      if (!node) return;
      const isVisible = filterFn(agent);
      if (isVisible) {
        node.style.opacity = "1";
        node.style.pointerEvents = "auto";
      } else {
        node.style.opacity = "0.2";
        node.style.pointerEvents = "none";
      }
    });
  }

  resetFilter() {
    OFFICE_AGENTS.forEach(agent => {
      const node = document.getElementById(`agent-node-${agent.id}`);
      if (node) {
        node.style.opacity = "1";
        node.style.pointerEvents = "auto";
      }
    });
  }

  hexToRgb(hex) {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }
}

window.OfficeFloorPlan = OfficeFloorPlan;

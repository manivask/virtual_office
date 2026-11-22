/**
 * Office Routine & Autonomous Agent Movement Engine
 * Coordinates autonomous daily routines:
 * - Working at desk
 * - Walking to the Coffee Bar / Barista
 * - Relaxing at the Lounge couches
 * - Gathering in the Central War Room for sprint syncs
 * - Visiting colleagues across pods for cross-functional collaboration
 */

class OfficeRoutineEngine {
  constructor(agents, office3D) {
    this.agents = agents;
    this.office3D = office3D;
    this.isRunning = true;
    this.timeScale = 1.0;
    this.simulatedMinutes = 9 * 60; // Start at 09:00 AM (540 mins)
    this.agentStates = new Map();

    // Key destination zones for routines (in 3D world coordinates)
    this.destinations = {
      coffeeBar: [
        { x: -28, z: 4, name: "Barista Counter" },
        { x: -24, z: 6, name: "Espresso Station" },
        { x: -20, z: 4, name: "Juice & Tea Bar" }
      ],
      loungeSofas: [
        { x: -4, z: -2, name: "Lounge Sofa A" },
        { x: 4, z: -2, name: "Lounge Sofa B" },
        { x: 0, z: 4, name: "Central Discussion Circle" }
      ],
      warRoomTable: [
        { x: 24, z: -16, name: "War Room Seat 1" },
        { x: 28, z: -16, name: "War Room Seat 2" },
        { x: 32, z: -16, name: "War Room Seat 3" },
        { x: 24, z: -8, name: "War Room Seat 4" },
        { x: 28, z: -8, name: "War Room Seat 5" },
        { x: 32, z: -8, name: "War Room Seat 6" }
      ],
      waterCooler: [
        { x: 24, z: 6, name: "Bio-Oasis Planter" },
        { x: 28, z: 8, name: "Water Cooler" }
      ],
      corridorWaypoints: [
        { x: 0, z: 0 },
        { x: -15, z: 0 },
        { x: 15, z: 0 },
        { x: 0, z: -12 },
        { x: 0, z: 12 }
      ]
    };

    this.init();
  }

  init() {
    this.agents.forEach(agent => {
      const homeCoord = this.office3D ? this.office3D.getAgentDesk3D(agent.id) : { x: 0, z: 0 };
      this.agentStates.set(agent.id, {
        agent: agent,
        homePos: { x: homeCoord.x, z: homeCoord.z },
        currentPos: { x: homeCoord.x, z: homeCoord.z },
        targetPos: { x: homeCoord.x, z: homeCoord.z },
        state: "AT_DESK", // AT_DESK | WALKING | AT_BREAK | IN_MEETING | VISITING
        activityText: "Coding & Focused",
        stateTimer: 10 + Math.random() * 25, // seconds until next routine transition
        walkSpeed: 3.2 + Math.random() * 0.8,
        facingAngle: 0,
        bobPhase: Math.random() * Math.PI
      });
    });
  }

  update(delta) {
    if (!this.isRunning) return;

    // Advance simulation clock
    this.simulatedMinutes += (delta * this.timeScale * 2.5);
    if (this.simulatedMinutes >= 24 * 60) {
      this.simulatedMinutes = 0;
    }

    this.agentStates.forEach((st, agentId) => {
      st.stateTimer -= delta * this.timeScale;

      if (st.state === "WALKING") {
        this.stepWalking(st, delta);
      } else {
        // Idle at current position (Desk, Coffee, War Room, Lounge)
        if (st.stateTimer <= 0) {
          this.decideNextRoutine(st);
        }
      }

      // Sync position with 3D mesh
      if (this.office3D) {
        this.office3D.updateAgentPosition(
          agentId,
          st.currentPos.x,
          st.currentPos.z,
          st.state === "WALKING",
          st.facingAngle,
          st.activityText
        );
      }
    });

    this.updateClockUI();
  }

  decideNextRoutine(st) {
    const r = Math.random();

    // Behavior weighting based on role and current state
    if (st.state === "AT_DESK") {
      if (r < 0.40) {
        // Head to Coffee Bar for a drink
        const spot = this.getRandomSpot(this.destinations.coffeeBar);
        this.setDestination(st, spot.x, spot.z, "Walking to Barista ☕", "AT_BREAK", "Coffee & Recharge", 12 + Math.random() * 15);
      } else if (r < 0.65) {
        // Head to Lounge for informal chat
        const spot = this.getRandomSpot(this.destinations.loungeSofas);
        this.setDestination(st, spot.x, spot.z, "Heading to Lounge 💬", "AT_BREAK", "Lounge Brainstorming", 15 + Math.random() * 20);
      } else if (r < 0.85) {
        // Head to War Room for sprint sync
        const spot = this.getRandomSpot(this.destinations.warRoomTable);
        this.setDestination(st, spot.x, spot.z, "Heading to War Room 🤝", "IN_MEETING", "War Room Sprint Sync", 20 + Math.random() * 25);
      } else {
        // Stay at desk working on specialized tech
        st.stateTimer = 15 + Math.random() * 30;
        st.activityText = this.getSpecializedWorkText(st.agent);
      }
    } else {
      // Return to home desk
      this.setDestination(st, st.homePos.x, st.homePos.z, "Returning to Desk 💻", "AT_DESK", this.getSpecializedWorkText(st.agent), 25 + Math.random() * 40);
    }
  }

  setDestination(st, tx, tz, walkingText, nextState, nextActivityText, nextDuration) {
    st.targetPos = { x: tx, z: tz };
    st.state = "WALKING";
    st.activityText = walkingText;
    st.nextState = nextState;
    st.nextActivityText = nextActivityText;
    st.nextDuration = nextDuration;
  }

  stepWalking(st, delta) {
    const dx = st.targetPos.x - st.currentPos.x;
    const dz = st.targetPos.z - st.currentPos.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 0.3) {
      // Arrived at destination
      st.currentPos.x = st.targetPos.x;
      st.currentPos.z = st.targetPos.z;
      st.state = st.nextState || "AT_DESK";
      st.activityText = st.nextActivityText || "Focused Work";
      st.stateTimer = st.nextDuration || 20;
    } else {
      // Step towards target
      const stepDist = st.walkSpeed * delta * this.timeScale;
      const move = Math.min(dist, stepDist);
      const angle = Math.atan2(dx, dz);

      st.currentPos.x += (dx / dist) * move;
      st.currentPos.z += (dz / dist) * move;
      st.facingAngle = angle;
    }
  }

  getSpecializedWorkText(agent) {
    if (agent.coreSkills && agent.coreSkills.length > 0) {
      return `Developing: ${agent.coreSkills[0]}`;
    }
    return "Deep Focus Work";
  }

  getRandomSpot(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Quick Trigger: Everyone gathers at the coffee bar
  triggerCoffeeBreak() {
    this.agentStates.forEach(st => {
      const spot = Math.random() > 0.5 
        ? this.getRandomSpot(this.destinations.coffeeBar) 
        : this.getRandomSpot(this.destinations.loungeSofas);
      this.setDestination(st, spot.x, spot.z, "Walking to Coffee Lounge ☕", "AT_BREAK", "Coffee & Chill", 25);
    });
  }

  // Quick Trigger: All engineering leads & architects to War Room
  triggerWarRoomMeeting() {
    this.agentStates.forEach((st, id) => {
      if (id.includes("lead") || id.includes("arch") || id.includes("mgr") || id.includes("ceo") || id.includes("dir")) {
        const spot = this.getRandomSpot(this.destinations.warRoomTable);
        this.setDestination(st, spot.x, spot.z, "Urgent War Room Sync 🤝", "IN_MEETING", "Executive Architecture Sync", 35);
      }
    });
  }

  // Quick Trigger: Everyone back to their desks
  triggerAllReturnToDesk() {
    this.agentStates.forEach(st => {
      this.setDestination(st, st.homePos.x, st.homePos.z, "Returning to Desk 💻", "AT_DESK", this.getSpecializedWorkText(st.agent), 30);
    });
  }

  updateClockUI() {
    const clockEl = document.getElementById("office-sim-clock");
    const phaseEl = document.getElementById("office-sim-phase");
    if (!clockEl) return;

    const totalMins = Math.floor(this.simulatedMinutes);
    const hrs = Math.floor(totalMins / 60) % 24;
    const mins = totalMins % 60;
    const ampm = hrs >= 12 ? "PM" : "AM";
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const timeStr = `${String(displayHrs).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${ampm}`;

    clockEl.textContent = timeStr;

    if (phaseEl) {
      if (hrs >= 9 && hrs < 11) phaseEl.textContent = "Morning Standup & Architecture Planning";
      else if (hrs >= 11 && hrs < 13) phaseEl.textContent = "High-Velocity Development Sprint";
      else if (hrs >= 13 && hrs < 14) phaseEl.textContent = "Lunch & Atrium Socializing";
      else if (hrs >= 14 && hrs < 16) phaseEl.textContent = "Cross-Pod War Room Reviews";
      else if (hrs >= 16 && hrs < 18) phaseEl.textContent = "QA Verification & Release Deployments";
      else phaseEl.textContent = "Evening Automated Test Suites";
    }
  }
}

window.OfficeRoutineEngine = OfficeRoutineEngine;

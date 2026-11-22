/**
 * 3D Virtual Office Environment (Three.js)
 * Implements a full 3D interactive office space:
 * - Architectural layout with floor, glass walls, modern furniture, and ambient lighting
 * - Animated holographic / Muse-style AI agent avatars
 * - Real-time routine movement (walking between desks, coffee bar, lounge, and war room)
 * - God-view overview, cinematic follow-cam, and department camera presets
 * - Raycasting for clicking agents in 3D
 */

class Office3DEnvironment {
  constructor(containerId, agents, onAgentSelect) {
    this.container = document.getElementById(containerId);
    this.agents = agents;
    this.onAgentSelect = onAgentSelect;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    this.agentMeshes = new Map();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredAgentId = null;
    this.followedAgentId = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080a12);
    this.scene.fog = new THREE.FogExp2(0x080a12, 0.008);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    this.setCameraPreset("godView");

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.05; // Prevent dipping below ground
      this.controls.minDistance = 8;
      this.controls.maxDistance = 140;
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Architecture & Furniture
    this.buildOfficeArchitecture();
    this.buildOfficeFurniture();

    // 7. Agent Avatars
    this.buildAgentAvatars();

    // 8. Event Listeners
    window.addEventListener("resize", () => this.onWindowResize());
    this.renderer.domElement.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.renderer.domElement.addEventListener("click", (e) => this.onMouseClick(e));

    // 9. Animation Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x2d3748, 1.2);
    this.scene.add(ambientLight);

    // Main Overhead Directional Sun / Key Light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(30, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    const d = 50;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Cyber Neon Zone Accent Lights
    this.addPointLight(-26, 8, -20, 0x8b5cf6, 2.0, 30); // Executive Purple
    this.addPointLight(0, 8, -20, 0xec4899, 1.8, 25);   // HR Pink
    this.addPointLight(-25, 8, 16, 0x3b82f6, 2.2, 30);  // Pod 1 Blue
    this.addPointLight(0, 8, 16, 0xa855f7, 2.2, 30);    // Pod 2 Violet
    this.addPointLight(25, 8, 16, 0x10b981, 2.2, 30);   // Pod 3 Emerald
    this.addPointLight(28, 8, -12, 0x38bdf8, 2.0, 30);  // War Room Cyan
  }

  addPointLight(x, y, z, color, intensity, distance) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  buildOfficeArchitecture() {
    // Floor (80 x 60 units)
    const floorGeo = new THREE.PlaneGeometry(84, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f1322,
      roughness: 0.6,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Floor Grid Wireframe
    const grid = new THREE.GridHelper(84, 42, 0x38bdf8, 0x1e293b);
    grid.position.y = 0.02;
    this.scene.add(grid);

    // Outer Walls (Dark structural frame with glass windows)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.8 });
    this.createWall(0, 3, -32, 84, 6, 1, wallMat);  // North wall
    this.createWall(0, 3, 32, 84, 6, 1, wallMat);   // South wall
    this.createWall(-42, 3, 0, 1, 6, 64, wallMat);  // West wall
    this.createWall(42, 3, 0, 1, 6, 64, wallMat);   // East wall

    // Glass Partitions for Executive Suite & War Room
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5
    });

    // Executive Suite glass enclosure (North-West)
    this.createWall(-14, 2.5, -20, 0.4, 5, 22, glassMat);
    this.createWall(-28, 2.5, -9, 28, 5, 0.4, glassMat);

    // War Room glass enclosure (North-East)
    this.createWall(14, 2.5, -20, 0.4, 5, 22, glassMat);
    this.createWall(28, 2.5, -9, 28, 5, 0.4, glassMat);

    // Architectural Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.5 });
    const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
    const pillarPositions = [
      [-14, 3, 0], [14, 3, 0], [-14, 3, -12], [14, 3, -12],
      [-14, 3, 12], [14, 3, 12]
    ];
    pillarPositions.forEach(p => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(p[0], p[1], p[2]);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.scene.add(pillar);
    });
  }

  createWall(x, y, z, w, h, d, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  buildOfficeFurniture() {
    // 1. Central War Room Big Table
    const warTableMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const warTable = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 7), warTableMat);
    warTable.position.set(28, 0.6, -18);
    warTable.castShadow = true;
    warTable.receiveShadow = true;
    this.scene.add(warTable);

    // War Room Hologram Display Table Center
    const holoDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 0.1, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
    );
    holoDisc.position.set(28, 1.25, -18);
    this.scene.add(holoDisc);

    // 2. Barista & Coffee Counter (Central-West Lounge)
    const barMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.4 });
    const coffeeBar = new THREE.Mesh(new THREE.BoxGeometry(12, 1.4, 4), barMat);
    coffeeBar.position.set(-24, 0.7, 3);
    coffeeBar.castShadow = true;
    coffeeBar.receiveShadow = true;
    this.scene.add(coffeeBar);

    // Espresso Machine
    const espresso = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.8, roughness: 0.2 })
    );
    espresso.position.set(-27, 1.8, 3);
    this.scene.add(espresso);

    // 3. Central Atrium Lounge Sofas
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x3b4252, roughness: 0.8 });
    const sofaA = new THREE.Mesh(new THREE.BoxGeometry(8, 0.9, 3), sofaMat);
    sofaA.position.set(-2, 0.45, -3);
    this.scene.add(sofaA);

    const sofaB = new THREE.Mesh(new THREE.BoxGeometry(8, 0.9, 3), sofaMat);
    sofaB.position.set(2, 0.45, 5);
    this.scene.add(sofaB);

    // Lounge Coffee Table
    const glassCoffeeTable = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 0.6, 24),
      new THREE.MeshPhysicalMaterial({ color: 0xa855f7, transparent: true, opacity: 0.6 })
    );
    glassCoffeeTable.position.set(0, 0.3, 1);
    this.scene.add(glassCoffeeTable);

    // 4. Bio-Oasis Green Planters
    const potGeo = new THREE.CylinderGeometry(1.2, 0.9, 1.5, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0x064e3b });
    const plantGeo = new THREE.SphereGeometry(1.5, 12, 12);
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });

    const planterPositions = [[-38, 0, -28], [-38, 0, 28], [38, 0, 28], [24, 0, 7]];
    planterPositions.forEach(pos => {
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.set(pos[0], 0.75, pos[2]);
      const plant = new THREE.Mesh(plantGeo, plantMat);
      plant.position.set(pos[0], 2.2, pos[2]);
      this.scene.add(pot);
      this.scene.add(plant);
    });

    // 5. IT Server Racks with Blinking LEDs (North East)
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.5 });
    for (let r = 0; r < 3; r++) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2), rackMat);
      rack.position.set(10 + r * 2.8, 2.5, -28);
      this.scene.add(rack);
    }
  }

  buildAgentAvatars() {
    this.agents.forEach(agent => {
      const homeCoord = this.getAgentDesk3D(agent.id);

      // Create Workstation Desk Model at homeCoord
      this.createWorkstationDesk(homeCoord.x, homeCoord.z, agent.avatarColor);

      // Create Cyber Agent 3D Character
      const agentGroup = new THREE.Group();
      agentGroup.position.set(homeCoord.x, 0, homeCoord.z);
      agentGroup.userData = { agentId: agent.id, agent: agent };

      // Base Pedestal / Underglow Ring
      const underglowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(agent.avatarColor),
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.2, 32), underglowMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.05;
      agentGroup.add(ringMesh);

      // Cyber Torso (Futuristic floating avatar cylinder)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.7,
        roughness: 0.3
      });
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.3, 1.2, 16), bodyMat);
      torso.position.y = 1.4;
      torso.castShadow = true;
      agentGroup.add(torso);

      // Cyber Hologram Head (Sphere with cyber visor)
      const headMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2
      });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), headMat);
      head.position.y = 2.4;
      head.castShadow = true;
      agentGroup.add(head);

      // Glowing Eye / Visor (Muse style)
      const visorMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(agent.avatarColor) });
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.4), visorMat);
      visor.position.set(0, 2.42, 0.25);
      agentGroup.add(visor);

      // Floating Holographic Halo Ring
      const haloGeo = new THREE.TorusGeometry(0.55, 0.03, 8, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(agent.avatarColor) });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 2.95;
      agentGroup.add(halo);

      // 3D Billboard Sprite (Name, Designation & Status)
      const billboardTexture = new THREE.CanvasTexture(window.agentAvatarGen.createBillboardTexture(agent));
      const spriteMat = new THREE.SpriteMaterial({ map: billboardTexture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.y = 3.8;
      sprite.scale.set(4.5, 2.25, 1);
      agentGroup.add(sprite);

      this.scene.add(agentGroup);
      this.agentMeshes.set(agent.id, {
        group: agentGroup,
        torso: torso,
        head: head,
        halo: halo,
        ringMesh: ringMesh,
        sprite: sprite,
        agent: agent
      });
    });
  }

  createWorkstationDesk(x, z, color) {
    // Desk surface
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.6 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 2.2), deskMat);
    desk.position.set(x, 0.4, z - 0.6);
    desk.castShadow = true;
    desk.receiveShadow = true;
    this.scene.add(desk);

    // Dual Monitors
    const monitorFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const screenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });

    for (let m = -1; m <= 1; m += 2) {
      const monitor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.08), monitorFrameMat);
      monitor.position.set(x + m * 0.75, 1.25, z - 1.2);
      monitor.rotation.y = -m * 0.15;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), screenMat);
      screen.position.set(0, 0, 0.05);
      monitor.add(screen);
      this.scene.add(monitor);
    }
  }

  getAgentDesk3D(agentId) {
    // Converts 2D floorplan desk coords to 3D Three.js world space
    const coordMap = {
      ceo_victoria: { x: -32, z: -24 },
      dir_marcus: { x: -24, z: -24 },
      mgr_helena: { x: -8, z: -24 },
      arch_arthur: { x: -1, z: -24 },
      hr_sophia: { x: 7, z: -24 },
      hr_liam: { x: 14, z: -24 },
      adm_chloe: { x: 23, z: -24 },
      it_nathan: { x: 30, z: -24 },
      sales_raymond: { x: -32, z: -15 },
      sales_isabella: { x: -24, z: -15 },
      // Pod 1 (Data)
      lead_rajiv: { x: -32, z: 14 },
      dev_vikram: { x: -25, z: 14 },
      dev_david: { x: -18, z: 14 },
      dev_priya: { x: -28, z: 22 },
      qa_emily: { x: -21, z: 22 },
      // Pod 2 (AI)
      lead_kenji: { x: -5, z: 14 },
      dev_maya: { x: 2, z: 14 },
      dev_alex: { x: -5, z: 22 },
      qa_sarah: { x: 2, z: 22 },
      // Pod 3 (Web/Cloud)
      lead_omar: { x: 16, z: 14 },
      dev_lucas: { x: 23, z: 14 },
      dev_zoe: { x: 16, z: 22 },
      qa_carlos: { x: 23, z: 22 },
      // War Room
      ai_bot_concierge: { x: 28, z: -12 }
    };

    return coordMap[agentId] || { x: 0, z: 0 };
  }

  updateAgentPosition(agentId, x, z, isWalking, facingAngle, activityText) {
    const item = this.agentMeshes.get(agentId);
    if (!item) return;

    item.group.position.x = x;
    item.group.position.z = z;

    if (isWalking) {
      // Bobbing walking animation
      const time = this.clock.getElapsedTime();
      item.group.position.y = Math.abs(Math.sin(time * 6)) * 0.25;
      item.group.rotation.y = facingAngle;
      item.halo.rotation.z = time * 3;
    } else {
      item.group.position.y = 0;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Subtle idle animation for halos
    this.agentMeshes.forEach(item => {
      item.halo.rotation.z += 0.02;
    });

    // Follow-Cam tracking
    if (this.followedAgentId) {
      const followMesh = this.agentMeshes.get(this.followedAgentId);
      if (followMesh) {
        const targetPos = followMesh.group.position;
        this.camera.position.x += (targetPos.x - this.camera.position.x + 12) * 0.05;
        this.camera.position.z += (targetPos.z - this.camera.position.z + 16) * 0.05;
        this.camera.position.y += (14 - this.camera.position.y) * 0.05;
        if (this.controls) {
          this.controls.target.lerp(targetPos, 0.08);
        }
      }
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  setCameraPreset(name) {
    this.followedAgentId = null;

    const presets = {
      godView: { pos: [0, 68, 56], target: [0, 0, 0] },
      executive: { pos: [-24, 20, -8], target: [-26, 0, -22] },
      pod1: { pos: [-24, 22, 32], target: [-24, 0, 18] },
      pod2: { pos: [0, 22, 32], target: [0, 0, 18] },
      pod3: { pos: [22, 22, 32], target: [20, 0, 18] },
      warRoom: { pos: [28, 18, 2], target: [28, 0, -16] },
      lounge: { pos: [-12, 18, 18], target: [-14, 0, 4] }
    };

    const p = presets[name] || presets.godView;
    this.camera.position.set(p.pos[0], p.pos[1], p.pos[2]);
    if (this.controls) {
      this.controls.target.set(p.target[0], p.target[1], p.target[2]);
      this.controls.update();
    }
  }

  followAgent(agentId) {
    this.followedAgentId = agentId;
  }

  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const groups = Array.from(this.agentMeshes.values()).map(item => item.group);
    const intersects = this.raycaster.intersectObjects(groups, true);

    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && !topGroup.userData.agentId) {
        topGroup = topGroup.parent;
      }
      if (topGroup.userData && topGroup.userData.agentId) {
        this.renderer.domElement.style.cursor = "pointer";
        this.hoveredAgentId = topGroup.userData.agentId;
        return;
      }
    }

    this.renderer.domElement.style.cursor = "default";
    this.hoveredAgentId = null;
  }

  onMouseClick(e) {
    if (this.hoveredAgentId && this.onAgentSelect) {
      const agent = OFFICE_AGENTS.find(a => a.id === this.hoveredAgentId);
      if (agent) {
        this.onAgentSelect(agent);
      }
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
}

window.Office3DEnvironment = Office3DEnvironment;

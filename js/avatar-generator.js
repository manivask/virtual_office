/**
 * Procedural Holographic / Muse-Style AI Agent Avatar Generator
 * Creates animated cybernetic agent portraits with glowing visors,
 * orbital particle rings, holographic scanlines, and sound-reactive pulsing.
 */

class AgentAvatarGenerator {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Renders a Muse-style holographic cyber avatar onto a target 2D canvas
   * @param {HTMLCanvasElement} canvas
   * @param {Object} agent
   * @param {Object} state - { isSpeaking, isWalking, time }
   */
  renderAvatar(canvas, agent, state = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const time = state.time || (Date.now() * 0.003);
    const isSpeaking = state.isSpeaking || false;
    const color = agent.avatarColor || "#38bdf8";

    ctx.clearRect(0, 0, w, h);

    // 1. Ambient Glow Background
    const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.48);
    bgGlow.addColorStop(0, `${color}30`);
    bgGlow.addColorStop(0.7, `${color}08`);
    bgGlow.addColorStop(1, "transparent");
    ctx.fillStyle = bgGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.46, 0, Math.PI * 2);
    ctx.fill();

    // 2. Rotating Holographic Outer Cyber Rings (Muse style)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 0.5);

    ctx.strokeStyle = `${color}80`;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6, 2, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(-time * 1.1);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Floating Orbiting Cyber Particles
    for (let i = 0; i < 4; i++) {
      const angle = time * 0.8 + (i * Math.PI / 2);
      const orbitR = w * 0.42;
      const px = cx + Math.cos(angle) * orbitR;
      const py = cy + Math.sin(angle) * (orbitR * 0.7);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 4. Central Cybernetic Head Base (Stylized futuristic Muse helmet/silhouette)
    const headRadius = w * 0.28;
    const bobOffset = Math.sin(time * 2) * 2.5;

    ctx.save();
    ctx.translate(cx, cy + bobOffset);

    // Head Base Shadow & Silhouette
    ctx.fillStyle = "#0c101d";
    ctx.beginPath();
    ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Cyber Rim Lighting
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 5. High-Tech Glowing Visor (Muse Faceplate)
    const visorY = -2;
    const visorW = headRadius * 1.35;
    const visorH = headRadius * 0.45;
    
    // Visor Glass
    const visorGrad = ctx.createLinearGradient(-visorW / 2, visorY, visorW / 2, visorY + visorH);
    visorGrad.addColorStop(0, color);
    visorGrad.addColorStop(0.5, "#ffffff");
    visorGrad.addColorStop(1, color);

    ctx.fillStyle = visorGrad;
    ctx.shadowColor = color;
    ctx.shadowBlur = isSpeaking ? 16 : 8;
    ctx.beginPath();
    ctx.roundRect(-visorW / 2, visorY, visorW, visorH, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Visor Digital Soundwave / Eyes
    if (isSpeaking) {
      // Animated audio bars on visor
      ctx.fillStyle = "#ffffff";
      for (let b = -4; b <= 4; b++) {
        const barH = 4 + Math.abs(Math.sin(time * 8 + b)) * 10;
        ctx.fillRect(b * 5 - 1.5, visorY + (visorH - barH) / 2, 3, barH);
      }
    } else {
      // Calm futuristic twin focus beams
      ctx.fillStyle = "#ffffff";
      const beamW = 12 + Math.sin(time * 3) * 3;
      ctx.fillRect(-headRadius * 0.35 - beamW / 2, visorY + visorH * 0.4, beamW, 3);
      ctx.fillRect(headRadius * 0.35 - beamW / 2, visorY + visorH * 0.4, beamW, 3);
    }

    // 6. Cyber Collar / Neck Plate
    ctx.fillStyle = "#161c30";
    ctx.strokeStyle = `${color}aa`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.5, headRadius * 0.7);
    ctx.lineTo(headRadius * 0.5, headRadius * 0.7);
    ctx.lineTo(headRadius * 0.35, headRadius * 1.05);
    ctx.lineTo(-headRadius * 0.35, headRadius * 1.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Department Emblem on Collar
    ctx.fillStyle = color;
    ctx.font = "bold 8px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(agent.avatarInitials, 0, headRadius * 0.88);

    // 7. Holographic Scanline Sweep
    const scanlineY = ((time * 30) % (headRadius * 2)) - headRadius;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.8, scanlineY);
    ctx.lineTo(headRadius * 0.8, scanlineY);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Generates a Texture Canvas suitable for Three.js Sprite / Billboards
   */
  createBillboardTexture(agent) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const color = agent.avatarColor || "#38bdf8";

    // Rounded badge background
    ctx.fillStyle = "rgba(10, 15, 28, 0.92)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 112, 16);
    ctx.fill();
    ctx.stroke();

    // Agent Initials Badge Circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(42, 64, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(agent.avatarInitials, 42, 64);

    // Name & Designation
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Inter', sans-serif";
    ctx.fillText(agent.name.split(" ")[0] + " " + (agent.name.split(" ")[1] || ""), 78, 48);

    ctx.fillStyle = color;
    ctx.font = "600 11px 'Inter', sans-serif";
    const shortDesig = agent.designation.length > 20 ? agent.designation.substring(0, 18) + "..." : agent.designation;
    ctx.fillText(shortDesig, 78, 68);

    // Status Pill
    ctx.fillStyle = "rgba(34, 197, 94, 0.2)";
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(78, 82, 150, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#86efac";
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillText("● " + (agent.pod ? agent.pod : agent.department.split(" ")[0]), 86, 96);

    return canvas;
  }
}

window.AgentAvatarGenerator = AgentAvatarGenerator;
window.agentAvatarGen = new AgentAvatarGenerator();

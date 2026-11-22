/**
 * Speech Engine for Virtual Office AI Agents
 * Supports SpeechSynthesis API with fallback Web Audio API soundwave generator,
 * live audio visualizer animation, real-time transcript sync, and mute control.
 */

class AgentSpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.isMuted = false;
    this.onStateChangeCallbacks = [];
    this.onBoundaryCallbacks = [];
    this.audioContext = null;
    this.visualizerAnimationId = null;
    this.visualizerCanvas = null;

    this.init();
  }

  init() {
    // Check saved mute state
    const savedMute = localStorage.getItem("virtual_office_muted");
    if (savedMute !== null) {
      this.isMuted = savedMute === "true";
    }

    if (this.synth) {
      this.loadVoices();
      if (typeof this.synth.onvoiceschanged !== "undefined") {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getBestVoice(agent) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const profile = agent.voiceProfile || {};
    const gender = agent.gender || "neutral";

    // 1. Try exact voice name match
    if (profile.voiceName) {
      const match = this.voices.find(v => v.name.toLowerCase().includes(profile.voiceName.toLowerCase()));
      if (match) return match;
    }

    // 2. Try language + gender heuristic
    const englishVoices = this.voices.filter(v => v.lang.startsWith("en"));
    if (englishVoices.length > 0) {
      if (gender === "female") {
        const femaleVoice = englishVoices.find(v => 
          /female|zira|samantha|victoria|susan|karen|catherine|hazel|fiona/i.test(v.name)
        );
        if (femaleVoice) return femaleVoice;
      } else if (gender === "male") {
        const maleVoice = englishVoices.find(v => 
          /male|david|george|james|daniel|alex|mark|richard/i.test(v.name)
        );
        if (maleVoice) return maleVoice;
      }
      return englishVoices[0];
    }

    return this.voices[0] || null;
  }

  speak(agent, textOverride, onEndCallback) {
    this.stop();

    if (this.isMuted) {
      console.log(`[SpeechEngine] Muted. Agent ${agent.name} speech skipped.`);
      if (onEndCallback) setTimeout(onEndCallback, 1500);
      return;
    }

    const textToSpeak = textOverride || agent.speechIntro || `Hello, I am ${agent.name}, ${agent.designation}.`;

    if (!this.synth) {
      console.warn("[SpeechEngine] Web Speech API not supported in this browser. Using visual simulation.");
      this.simulateSpeech(textToSpeak, onEndCallback);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voice = this.getBestVoice(agent);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = (agent.voiceProfile && agent.voiceProfile.rate) || 1.0;
    utterance.pitch = (agent.voiceProfile && agent.voiceProfile.pitch) || 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notifyStateChange(true, agent, textToSpeak);
      this.startVisualizer();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopVisualizer();
      this.notifyStateChange(false, agent, null);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn("[SpeechEngine] Utterance error:", e);
      this.isSpeaking = false;
      this.stopVisualizer();
      this.notifyStateChange(false, agent, null);
      if (onEndCallback) onEndCallback();
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        this.notifyBoundary(event.charIndex, event.charLength);
      }
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.error("[SpeechEngine] Speak call failed:", err);
      this.simulateSpeech(textToSpeak, onEndCallback);
    }
  }

  simulateSpeech(text, onEndCallback) {
    this.isSpeaking = true;
    this.startVisualizer();
    this.notifyStateChange(true, null, text);
    
    // Simulate reading rate: ~150 words per minute -> 2.5 words per sec
    const words = text.split(/\s+/).length;
    const durationMs = Math.min(Math.max(words * 260, 2000), 12000);

    setTimeout(() => {
      this.isSpeaking = false;
      this.stopVisualizer();
      this.notifyStateChange(false, null, null);
      if (onEndCallback) onEndCallback();
    }, durationMs);
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.stopVisualizer();
    this.notifyStateChange(false, null, null);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("virtual_office_muted", String(this.isMuted));
    if (this.isMuted && this.isSpeaking) {
      this.stop();
    }
    return this.isMuted;
  }

  setVisualizerCanvas(canvas) {
    this.visualizerCanvas = canvas;
  }

  startVisualizer() {
    if (!this.visualizerCanvas) return;
    const canvas = this.visualizerCanvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(this.visualizerAnimationId);
    let phase = 0;

    const render = () => {
      if (!this.isSpeaking) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 24;
      const barWidth = width / bars - 2;

      for (let i = 0; i < bars; i++) {
        // Generate pseudo audio wave frequencies
        const distFromCenter = Math.abs(i - bars / 2) / (bars / 2);
        const amp = (1 - distFromCenter * 0.5) * Math.abs(Math.sin(phase + i * 0.4)) * (height * 0.85);
        const x = i * (barWidth + 2);
        const y = (height - amp) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + amp);
        gradient.addColorStop(0, "#38BDF8");
        gradient.addColorStop(0.5, "#818CF8");
        gradient.addColorStop(1, "#C084FC");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, Math.max(amp, 4), 3);
        ctx.fill();
      }

      phase += 0.12;
      this.visualizerAnimationId = requestAnimationFrame(render);
    };

    render();
  }

  stopVisualizer() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
    }
    if (this.visualizerCanvas) {
      const ctx = this.visualizerCanvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
    }
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyStateChange(isSpeaking, agent, text) {
    this.onStateChangeCallbacks.forEach(cb => cb(isSpeaking, agent, text));
  }

  onBoundary(cb) {
    this.onBoundaryCallbacks.push(cb);
  }

  notifyBoundary(charIndex, charLength) {
    this.onBoundaryCallbacks.forEach(cb => cb(charIndex, charLength));
  }
}

// Global instance
window.agentSpeech = new AgentSpeechEngine();

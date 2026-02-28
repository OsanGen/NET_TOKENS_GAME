(() => {
  "use strict";

  const SIM_W = 640;
  const SIM_H = 360;
  const INTERNAL_RENDER_SCALE = 1;
  const TARGET_FPS = 60;
  const FRAME_MS = 1000 / TARGET_FPS;
  const VIEW_MARGIN = 2;
  const SAFE_MARGIN = 12;

  const EFFECT_MODES = Object.freeze({
    title: Object.freeze({
      budget: "premium",
      toneStrength: 0.16,
      particles: 28,
      motionAmp: 0.16,
      effectCap: 0.18,
      noiseDensity: 1.0,
      noiseSpeed: 1,
      scanlineDensity: 0.88,
      scanlineStrength: 0.62,
      bloom: 0.1,
      chromaticSplit: 0.011,
      frameJitter: 0.18,
      shakeGain: 0.32,
      flickerChance: 0.02,
      vignetteAmount: 0.07,
      accentColor: "COG_BLUE",
    }),
    hub: Object.freeze({
      budget: "premium",
      toneStrength: 0.24,
      particles: 46,
      motionAmp: 0.22,
      effectCap: 0.28,
      noiseDensity: 1.12,
      noiseSpeed: 1.06,
      scanlineDensity: 0.93,
      scanlineStrength: 0.7,
      bloom: 0.14,
      chromaticSplit: 0.015,
      frameJitter: 0.21,
      shakeGain: 0.26,
      flickerChance: 0.03,
      vignetteAmount: 0.08,
      accentColor: "COG_MINT",
    }),
    mission: Object.freeze({
      budget: "premium",
      toneStrength: 0.22,
      particles: 44,
      motionAmp: 0.2,
      effectCap: 0.32,
      noiseDensity: 1.32,
      noiseSpeed: 1.12,
      scanlineDensity: 1.06,
      scanlineStrength: 0.84,
      bloom: 0.2,
      chromaticSplit: 0.028,
      frameJitter: 0.44,
      shakeGain: 0.48,
      flickerChance: 0.08,
      vignetteAmount: 0.13,
      accentColor: "COG_YELLOW",
    }),
    battle: Object.freeze({
      budget: "premium",
      toneStrength: 0.2,
      particles: 32,
      motionAmp: 0.18,
      effectCap: 0.2,
      noiseDensity: 1.04,
      noiseSpeed: 1.08,
      scanlineDensity: 1.1,
      scanlineStrength: 0.66,
      bloom: 0.11,
      chromaticSplit: 0.008,
      frameJitter: 0.14,
      shakeGain: 0.34,
      flickerChance: 0.04,
      vignetteAmount: 0.09,
      accentColor: "COG_PINK",
    }),
    result: Object.freeze({
      budget: "premium",
      toneStrength: 0.12,
      particles: 18,
      motionAmp: 0.08,
      effectCap: 0.14,
      noiseDensity: 0.86,
      noiseSpeed: 0.85,
      scanlineDensity: 0.7,
      scanlineStrength: 0.42,
      bloom: 0.07,
      chromaticSplit: 0.006,
      frameJitter: 0.08,
      shakeGain: 0.18,
      flickerChance: 0.015,
      vignetteAmount: 0.05,
      accentColor: "COG_PINK",
    }),
  });

  const VISUAL_PIPELINE = Object.freeze({
    mode: "premium",
    defaultPolicy: "smooth",
    allowSmoothFallback: false,
    sceneScaleMode: "integer",
    hudLineHeight: 8,
    vfxProfiles: EFFECT_MODES,
    effects: {
      baseScanAlpha: 0.035,
      grainCount: 0,
      noiseCount: 0,
      routeGlowAlpha: 0.16,
      routePulseAlpha: 0.28,
      missionCometCount: 6,
      missionNebulaRows: 12,
      hubAtmosphereBands: 8,
      battlePulseBars: 3,
      creepLineCount: 18,
      riftStripeDensity: 6,
      staticWashDensity: 0,
      ruptureFrequencies: 3.6,
      riftPulseDensity: 4.2,
      veilDensity: 22,
    },
    quality: {
      snapScaleTolerance: 0.33,
      maxSnapOverflow: 0.12,
    },
  });

  const VISUAL_PRESETS = Object.freeze({
    cinematic: Object.freeze({
      label: "CINEMATIC",
      particleDensity: 1.15,
      toneStrength: 0.92,
      motionAmp: 0.9,
      effectCap: 1.1,
      noiseDensity: 0.22,
      scanlineDensity: 1,
      scanlineStrength: 0.32,
      noiseSpeed: 0.86,
      bloom: 0.16,
      chromaShift: 0.02,
      jitterShift: 0.48,
      flickerShift: 0.28,
      vignetteBoost: 0.68,
      chromaticShift: 0.18,
      shakeBoost: 0.42,
    }),
    neon: Object.freeze({
      label: "NEON",
      particleDensity: 1.55,
      toneStrength: 1.02,
      motionAmp: 1.12,
      effectCap: 1.3,
      noiseDensity: 0.44,
      scanlineDensity: 1.25,
      scanlineStrength: 0.58,
      noiseSpeed: 0.95,
      bloom: 0.18,
      chromaShift: 0.06,
      jitterShift: 0.9,
      flickerShift: 0.92,
      vignetteBoost: 0.86,
      chromaticShift: 0.84,
      shakeBoost: 0.72,
    }),
    minimal: Object.freeze({
      label: "MINIMAL (CLEAN)",
      particleDensity: 0.2,
      toneStrength: 0.34,
      motionAmp: 0.24,
      effectCap: 0.16,
      noiseDensity: 0,
      scanlineDensity: 0.1,
      scanlineStrength: 0.12,
      noiseSpeed: 0.6,
      bloom: 0,
      chromaShift: 0,
      jitterShift: 0.22,
      flickerShift: 0.04,
      vignetteBoost: 0.45,
      chromaticShift: 0,
      shakeBoost: 0.22,
    }),
    modern: Object.freeze({
      label: "MODERN FLUX",
      particleDensity: 0.22,
      toneStrength: 0.72,
      motionAmp: 0.26,
      effectCap: 0.24,
      noiseDensity: 0,
      scanlineDensity: 0.02,
      scanlineStrength: 0,
      noiseSpeed: 0.6,
      bloom: 0,
      chromaShift: 0,
      jitterShift: 0,
      flickerShift: 0.05,
      vignetteBoost: 0.42,
      chromaticShift: 0,
      shakeBoost: 0.22,
    }),
  });

  const VISUAL_PRESET_ORDER = Object.freeze(["modern", "minimal", "cinematic", "neon"]);

  const MODERN_STYLE = Object.freeze({
    frameAlpha: 0.18,
    panelAlpha: 0.84,
    edgeAlpha: 0.16,
    softLineAlpha: 0.2,
  });

  const VISUAL_SPRITE_SCALE = 2.2;
  const VISUAL_PLANET_SCALE = 2.0;

  const BRAND_TOKENS = Object.freeze({
    COG_YELLOW: "#FFCB78",
    COG_BLUE: "#5DD9FF",
    COG_MINT: "#49E9C8",
    COG_PINK: "#FF8EA8",
    INK: "#101824",
    WHITE: "#FFFFFF",
    FOG: "#ECECE8",
    SHADOW: "rgba(16, 24, 36, 0.26)",
    SCANLINE: "rgba(16, 24, 36, 0.045)",
    NOISE: "rgba(0, 0, 0, 0)",
    HUD_PANEL: "rgba(244, 248, 252, 0.96)",
    SUBTLE_GRID: "rgba(16, 24, 36, 0.16)",
    ROUTE_STROKE: "rgba(123, 217, 255, 0.3)",
  });

  const SCENE_RECIPES = Object.freeze({
    title: {
      accentLead: "COG_BLUE",
      accentSecondary: "COG_MINT",
      accentPulse: "COG_YELLOW",
      panelFill: "FOG",
      edge: "COG_BLUE",
      surface: "WHITE",
      text: "INK",
      subtle: "SUBTLE_GRID",
      contrastMode: "light",
    },
    hub: {
      accentLead: "COG_MINT",
      accentSecondary: "COG_BLUE",
      accentPulse: "COG_YELLOW",
      panelFill: "FOG",
      edge: "COG_MINT",
      surface: "WHITE",
      text: "INK",
      subtle: "SUBTLE_GRID",
      contrastMode: "light",
    },
    mission: {
      accentLead: "COG_YELLOW",
      accentSecondary: "COG_PINK",
      accentPulse: "COG_BLUE",
      panelFill: "FOG",
      edge: "COG_YELLOW",
      surface: "WHITE",
      text: "INK",
      subtle: "ROUTE_STROKE",
      contrastMode: "light",
    },
    battle: {
      accentLead: "COG_PINK",
      accentSecondary: "COG_BLUE",
      accentPulse: "COG_YELLOW",
      panelFill: "FOG",
      edge: "COG_PINK",
      surface: "WHITE",
      text: "INK",
      subtle: "SCANLINE",
      contrastMode: "light",
    },
    result: {
      accentLead: "COG_PINK",
      accentSecondary: "COG_YELLOW",
      accentPulse: "COG_BLUE",
      panelFill: "FOG",
      edge: "COG_PINK",
      surface: "WHITE",
      text: "INK",
      subtle: "SCANLINE",
      contrastMode: "light",
    },
  });

  const MODE_VISUAL_STATE = Object.freeze({
    title: Object.freeze({
      accent: "COG_BLUE",
      panelTone: "FOG",
      threatColor: "COG_BLUE",
      envPulse: 0.18,
      focusIntensity: 0.55,
      fxBudget: "standard",
    }),
    hub: Object.freeze({
      accent: "COG_MINT",
      panelTone: "FOG",
      threatColor: "COG_MINT",
      envPulse: 0.22,
      focusIntensity: 0.74,
      fxBudget: "premium",
    }),
    mission: Object.freeze({
      accent: "COG_YELLOW",
      panelTone: "FOG",
      threatColor: "COG_PINK",
      envPulse: 0.24,
      focusIntensity: 0.84,
      fxBudget: "premium",
    }),
    result: Object.freeze({
      accent: "COG_PINK",
      panelTone: "FOG",
      threatColor: "COG_BLUE",
      envPulse: 0.16,
      focusIntensity: 0.46,
      fxBudget: "standard",
    }),
    battle: Object.freeze({
      accent: "COG_PINK",
      panelTone: "FOG",
      threatColor: "COG_YELLOW",
      envPulse: 0.2,
      focusIntensity: 0.72,
      fxBudget: "premium",
    }),
  });

  const VISUAL_QUALITY_PROFILES = Object.freeze({
    premium: Object.freeze({
      label: "PREMIUM",
      toneScale: 1,
      particlesScale: 1,
      ambientScale: 1,
      noiseScale: 1,
      scanlineScale: 1,
      motionScale: 1,
      vignetteScale: 1,
      bloomScale: 1,
    }),
    standard: Object.freeze({
      label: "STANDARD",
      toneScale: 0.82,
      particlesScale: 0.68,
      ambientScale: 0.78,
      noiseScale: 0.88,
      scanlineScale: 0.9,
      motionScale: 0.68,
      vignetteScale: 0.78,
      bloomScale: 0.75,
    }),
    low: Object.freeze({
      label: "LOW",
      toneScale: 0.66,
      particlesScale: 0.4,
      ambientScale: 0.6,
      noiseScale: 0.65,
      scanlineScale: 0.72,
      motionScale: 0.35,
      vignetteScale: 0.54,
      bloomScale: 0.38,
    }),
  });

  const ACCENT_ORDER = ["COG_YELLOW", "COG_BLUE", "COG_MINT", "COG_PINK"];
  const HUB_BIOMES = ["Nix", "Gloom", "Core", "Ash", "Void"];
  const HUB_NODE_MIN_GAP = 18;
  const HUB_NODE_MARGIN = 28;

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const scene = document.createElement("canvas");
  scene.width = SIM_W * INTERNAL_RENDER_SCALE;
  scene.height = SIM_H * INTERNAL_RENDER_SCALE;
  const sceneCtx = scene.getContext("2d");
  sceneCtx.setTransform(INTERNAL_RENDER_SCALE, 0, 0, INTERNAL_RENDER_SCALE, 0, 0);
  sceneCtx.imageSmoothingEnabled = true;
  sceneCtx.imageSmoothingQuality = "high";
  const postFxCanvas = document.createElement("canvas");
  postFxCanvas.width = SIM_W;
  postFxCanvas.height = SIM_H;
  const postFxCtx = postFxCanvas.getContext("2d");
  const postFxImageData = postFxCtx.createImageData(SIM_W, SIM_H);

  const startBtn = document.getElementById("start-btn");
  const controlsPanel = document.getElementById("controls-panel");
  const controlsToggle = document.getElementById("controls-toggle");
  const controlsActions = document.getElementById("controls-actions");
  const controlsObjective = document.getElementById("controls-objective");
  const hudNodes = {
    modeTitle: document.getElementById("hud-mode-title"),
    modeSubtitle: document.getElementById("hud-mode-subtitle"),
    modePhase: document.getElementById("hud-mode-phase"),
    visualPreset: document.getElementById("hud-visual-preset"),
    visualProfile: document.getElementById("hud-visual-profile"),
    objectiveTitle: document.getElementById("hud-objective-title"),
    objectiveProgress: document.getElementById("hud-objective-progress"),
    objectiveHint: document.getElementById("hud-objective-hint"),
    threatHp: document.getElementById("hud-threat-hp"),
    threatScore: document.getElementById("hud-threat-score"),
    threatLevel: document.getElementById("hud-threat-level"),
    threatEnemies: document.getElementById("hud-threat-enemies"),
    missionState: document.getElementById("hud-mission-state"),
    missionCombo: document.getElementById("hud-mission-combo"),
    missionCooldown: document.getElementById("hud-mission-cooldown"),
    consoleLines: document.getElementById("hud-console-lines"),
  };
  const HUD_STATE_CLASS = ["is-critical", "is-warning", "is-ready", "is-muted", "is-digital"];
  const coordNote = "Origin top-left, +x right, +y down";

  const input = {
    left: false,
    up: false,
    right: false,
    leftEdge: false,
    rightEdge: false,
    upEdge: false,
    down: false,
    space: false,
    spaceEdge: false,
    downEdge: false,
    confirmEdge: false,
    cancelEdge: false,
  };

  const alienSpecies = [
    { id: "vulkr", name: "Vulkari", color: BRAND_TOKENS.COG_BLUE, emoji: "◉" },
    { id: "nexi", name: "Nexi Spore", color: BRAND_TOKENS.COG_PINK, emoji: "◈" },
    { id: "driftling", name: "Driftling", color: BRAND_TOKENS.COG_YELLOW, emoji: "✦" },
    { id: "krel", name: "Krel Voidcat", color: BRAND_TOKENS.COG_MINT, emoji: "⟡" },
    { id: "orbian", name: "Orbian Wisp", color: BRAND_TOKENS.COG_BLUE, emoji: "◉" },
    { id: "myx", name: "Myx Harvester", color: BRAND_TOKENS.COG_PINK, emoji: "◆" },
    { id: "skitter", name: "Skitter", color: BRAND_TOKENS.COG_MINT, emoji: "✱" },
    { id: "quasar", name: "Quasar Latch", color: BRAND_TOKENS.COG_BLUE, emoji: "✢" },
    { id: "grub", name: "Void Grub", color: BRAND_TOKENS.COG_YELLOW, emoji: "✻" },
    { id: "wisp", name: "Static Wisp", color: BRAND_TOKENS.COG_BLUE, emoji: "❖" },
    { id: "rift", name: "Rift Mite", color: BRAND_TOKENS.COG_PINK, emoji: "⟐" },
    { id: "tangler", name: "Tangler", color: BRAND_TOKENS.COG_MINT, emoji: "◬" },
    { id: "spine", name: "Spine Runner", color: BRAND_TOKENS.COG_MINT, emoji: "⬟" },
    { id: "sproll", name: "Sproll", color: BRAND_TOKENS.COG_BLUE, emoji: "✶" },
    { id: "hulk", name: "Star Hulk", color: BRAND_TOKENS.COG_YELLOW, emoji: "◪" },
    { id: "astral", name: "Astral Titan", color: BRAND_TOKENS.COG_PINK, emoji: "♒", legendary: true },
    { id: "necro", name: "Necro Bloom", color: BRAND_TOKENS.COG_MINT, emoji: "✺", legendary: true },
    { id: "overmind", name: "Overmind Voss", color: BRAND_TOKENS.COG_YELLOW, emoji: "⎈", legendary: true },
  ];
  const alienById = Object.fromEntries(alienSpecies.map((species) => [species.id, species]));

  const taskTemplates = [
    { id: "collect", text: "Capture target", target: "collectCount", targetValue: 1 },
    { id: "clear_wave", text: "Clear all hostiles", target: "enemyCount", targetValue: 0 },
    { id: "hold_sector", text: "Hold sector", target: "holdFrames", targetValue: TARGET_FPS * 2 },
    { id: "activate_beacon", text: "Activate beacon", target: "beacon", targetValue: 1 },
    { id: "escort_probe", text: "Escort probe", target: "probe", targetValue: 1 },
  ];

  const combatConfig = {
    enemySpawnCadenceMin: 42,
    enemySpawnCadenceMax: 82,
    initialEnemyBurst: 1,
    burstSpread: 0,
    initialSpawnDelay: 24,
    invulnBase: 16,
    invulnStreakBonus: 1,
    invulnStreakCap: 4,
    damageDecayBase: 40,
    damageDecayBonus: 5,
    knockbackBase: 1.3,
    knockbackStreakBonus: 0.25,
    knockbackCap: 4,
  };

  const TYPE_DB = ["plasma", "fungal", "void", "crystal"];
  const TYPE_MATRIX = Object.freeze({
    plasma: { plasma: 1, fungal: 1.25, void: 0.75, crystal: 1 },
    fungal: { plasma: 0.75, fungal: 1, void: 1.25, crystal: 1 },
    void: { plasma: 1.25, fungal: 0.75, void: 1, crystal: 1 },
    crystal: { plasma: 1, fungal: 1, void: 0.75, crystal: 1.25 },
  });
  const MOVE_DB = Object.freeze({
    ion_jab: { name: "Ion Jab", type: "plasma", power: 11, status: null, statusChance: 0 },
    flare_bolt: { name: "Flare Bolt", type: "plasma", power: 15, status: "burn", statusChance: 0.2 },
    spore_snap: { name: "Spore Snap", type: "fungal", power: 10, status: "slow", statusChance: 0.3 },
    mold_blast: { name: "Mold Blast", type: "fungal", power: 14, status: null, statusChance: 0 },
    rift_bite: { name: "Rift Bite", type: "void", power: 12, status: null, statusChance: 0 },
    null_sting: { name: "Null Sting", type: "void", power: 9, status: "stun", statusChance: 0.25 },
    prism_arc: { name: "Prism Arc", type: "crystal", power: 13, status: null, statusChance: 0 },
    shard_lance: { name: "Shard Lance", type: "crystal", power: 16, status: "slow", statusChance: 0.18 },
    pulse_ping: { name: "Pulse Ping", type: "plasma", power: 9, status: null, statusChance: 0 },
    bloom_hex: { name: "Bloom Hex", type: "fungal", power: 11, status: "burn", statusChance: 0.15 },
    phase_claw: { name: "Phase Claw", type: "void", power: 13, status: null, statusChance: 0 },
    mirror_tap: { name: "Mirror Tap", type: "crystal", power: 10, status: "stun", statusChance: 0.2 },
    orbit_kick: { name: "Orbit Kick", type: "plasma", power: 12, status: null, statusChance: 0 },
    root_shock: { name: "Root Shock", type: "fungal", power: 12, status: null, statusChance: 0 },
    vacuum_chomp: { name: "Vacuum Chomp", type: "void", power: 14, status: null, statusChance: 0 },
    halo_pierce: { name: "Halo Pierce", type: "crystal", power: 12, status: null, statusChance: 0 },
  });
  const BATTLE_ROOT_ACTIONS = ["Fight", "Switch", "Capture"];

  const SPRITE_ROOT = (() => {
    try {
      return new URL("./assets/sprites/", document.baseURI).href.replace(/\/$/, "");
    } catch (error) {
      console.warn("Using legacy sprite root fallback due base URL error:", error);
      return "/assets/sprites";
    }
  })();
  const spriteManifest = (() => {
    const base = {
      player: `${SPRITE_ROOT}/ship.png`,
      enemy: `${SPRITE_ROOT}/enemy.png`,
      beacon: `${SPRITE_ROOT}/beacon.png`,
      probe: `${SPRITE_ROOT}/probe.png`,
      planet: `${SPRITE_ROOT}/planet-node.png`,
      ship: `${SPRITE_ROOT}/ship.png`,
    };
    for (const species of alienSpecies) {
      base[`alien-${species.id}`] = `${SPRITE_ROOT}/alien-${species.id}.png`;
    }
    return base;
  })();

  const spriteRegistry = {};
  const spriteStatus = { total: 0, loaded: 0, missing: 0, loading: 0 };

  function withAlpha(color, alpha) {
    if (!color || typeof color !== "string") return `rgba(16, 24, 36, ${alpha})`;
    const cleanAlpha = Math.max(0, Math.min(1, alpha));
    const rgbaMatch = color.match(/^rgba?\(([^)]+)\)$/i);
    if (rgbaMatch) {
      const parts = rgbaMatch[1].split(",").map((part) => part.trim());
      if (parts.length >= 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${cleanAlpha})`;
      }
    }
    if (!color.startsWith("#")) return color;
    const hex = color.replace("#", "");
    const normalized = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const num = parseInt(normalized, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${cleanAlpha})`;
  }

  function parseHexToken(color) {
    if (!color || typeof color !== "string") return null;
    const normalized = color.trim().toLowerCase();
    if (!normalized.startsWith("#")) return null;
    const hex = normalized.slice(1);
    const fullHex = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
    if (!/^[0-9a-f]{6}$/i.test(fullHex)) return null;
    const value = parseInt(fullHex, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  function parseRgbToken(color) {
    if (!color || typeof color !== "string") return null;
    const rgbaMatch = color.match(/^rgba?\(([^)]+)\)$/i);
    if (!rgbaMatch) return null;
    const parts = rgbaMatch[1].split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 3) return null;
    return {
      r: clamp(Number(parts[0]), 0, 255),
      g: clamp(Number(parts[1]), 0, 255),
      b: clamp(Number(parts[2]), 0, 255),
    };
  }

  function parseColorTokens(color) {
    return parseHexToken(color) || parseRgbToken(color) || null;
  }

  function linearizeChannel(v) {
    const s = clamp(v / 255, 0, 1);
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }

  function colorLuminance(color) {
    const parsed = parseColorTokens(color);
    if (!parsed) return 0.07;
    const r = linearizeChannel(parsed.r);
    const g = linearizeChannel(parsed.g);
    const b = linearizeChannel(parsed.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function colorContrastRatio(a, b) {
    const l1 = colorLuminance(a);
    const l2 = colorLuminance(b);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function resolveVisualPolicy() {
    if (!state || !state.visual) return VISUAL_PIPELINE.defaultPolicy;
    if (state.visual.renderQualityMode === "smooth" || state.visual.scaleMode === "smooth") return "smooth";
    if (state.visual.renderPolicy === "smooth") return "smooth";
    return VISUAL_PIPELINE.defaultPolicy;
  }

  function resolveVisualPresetKey() {
    const configuredPreset = state.visual && state.visual.vfxPreset;
    return VISUAL_PRESETS[configuredPreset] ? configuredPreset : VISUAL_PRESET_ORDER[0];
  }

  function resolveVisualTierKey() {
    const preset = resolveVisualPresetKey();
    const mode = state && state.mode ? state.mode : "title";
    const visualProfileAuto = state && state.visual ? !!state.visual.visualProfileAuto : true;
    const motionHint = visualProfileAuto ? "auto" : "manual";
    return `${preset}--${mode}--${motionHint}`;
  }

  function resolveVisualPreset() {
    return VISUAL_PRESETS[resolveVisualPresetKey()];
  }

  function visualPresetLabel() {
    const preset = resolveVisualPreset();
    return preset && preset.label ? preset.label : "CINEMATIC";
  }

  function resolveSceneVisualState(mode = "title", phaseProgress = 0) {
    const activeMode = mode || "title";
    const base = MODE_VISUAL_STATE[activeMode] || MODE_VISUAL_STATE.title;
    const requested = Math.max(0, Math.min(1, Number.isFinite(phaseProgress) ? phaseProgress : 0));
    return {
      ...base,
      mode: activeMode,
      phaseProgress: requested,
      accent: base.accent || "COG_BLUE",
      threatColor: base.threatColor || "COG_BLUE",
      panelTone: base.panelTone || "FOG",
      envPulse: (base.envPulse || 0) * (1 - requested * 0.2),
      focusIntensity: base.focusIntensity || 0.6,
      fxBudget: base.fxBudget || "standard",
      accentToken: base.accent || "COG_BLUE",
    };
  }

  function resolveVisualQualityMode() {
    const requested = state && state.visual && VISUAL_QUALITY_PROFILES[state.visual.visualProfile]
      ? state.visual.visualProfile
      : "standard";
    if (!state || !state.visual || state.visual.visualProfileAuto === false) {
      return requested;
    }
    const frameMs = Number.isFinite(state.visual.lastFrameMs) ? state.visual.lastFrameMs : FRAME_MS;
    if (frameMs >= 40) return "low";
    if (frameMs >= 28 && requested === "premium") return "standard";
    if (frameMs >= 28 && requested === "standard") return "low";
    return requested;
  }

  function resolveVisualProfileLabel() {
    const selected = resolveVisualQualityMode();
    const profile = VISUAL_QUALITY_PROFILES[selected];
    return profile && profile.label ? profile.label : "STANDARD";
  }

  function cycleVisualQualityProfile() {
    if (!state.visual) return;
    const order = ["premium", "standard", "low"];
    const current = order.indexOf(resolveVisualQualityMode());
    const next = order[(current + 1) % order.length];
    state.visual.visualProfile = next;
    state.visual.visualProfileAuto = false;
    queueVfxPulse("ambient", 0.12, { max: 0.24 });
    state.messages = [
      `Visual profile: ${VISUAL_QUALITY_PROFILES[next]?.label || next.toUpperCase()}`,
      "Visual density set for low-poly mode",
    ];
  }

  function resolveModeVfxProfile(mode) {
    const selectedMode = mode || "title";
    const preset = resolveVisualPreset();
    const qualityMode = VISUAL_QUALITY_PROFILES[resolveVisualQualityMode()] || VISUAL_QUALITY_PROFILES.standard;
    const baseProfile = VISUAL_PIPELINE.vfxProfiles[selectedMode] || VISUAL_PIPELINE.vfxProfiles.title;
    const accentLead = baseProfile.accentColor || pickAccentLead(selectedMode, state.mission, state.seed);
    return {
      ...baseProfile,
      toneStrength: (baseProfile.toneStrength ?? 0) * (preset.toneStrength ?? 1) * (qualityMode.toneScale ?? 1),
      motionAmp: (baseProfile.motionAmp ?? 0) * (preset.motionAmp ?? 1) * (preset.noiseSpeed ?? 1) * (qualityMode.motionScale ?? 1),
      particles: Math.max(
        1,
        Math.round((baseProfile.particles ?? 0) * (preset.particleDensity ?? 1) * (qualityMode.particlesScale ?? 1)),
      ),
      particleDensity: preset.particleDensity ?? 1,
      effectCap: (baseProfile.effectCap ?? 0) * (preset.effectCap ?? 1) * (qualityMode.motionScale ?? 1),
      noiseDensity: (baseProfile.noiseDensity ?? 1) * (preset.noiseDensity ?? 1) * (qualityMode.noiseScale ?? 1),
      scanlineDensity: (baseProfile.scanlineDensity ?? 1) * (preset.scanlineDensity ?? 1) * (qualityMode.scanlineScale ?? 1),
      scanlineStrength: (baseProfile.scanlineStrength ?? 0.5) * (preset.scanlineStrength ?? 1) * (qualityMode.ambientScale ?? 1),
      noiseSpeed: (baseProfile.noiseSpeed ?? 1) * (preset.noiseSpeed ?? 1) * (qualityMode.motionScale ?? 1),
      bloom: (baseProfile.bloom ?? 0) * (preset.bloom ?? 1) * (qualityMode.bloomScale ?? 1),
      chromaShift:
        (baseProfile.chromaticSplit ?? 0) *
        (preset.chromaShift ?? 1) *
        (preset.chromaticShift ?? 1) *
        (qualityMode.toneScale ?? 1),
      frameJitter: (baseProfile.frameJitter ?? 0) * (preset.jitterShift ?? 1) * (qualityMode.motionScale ?? 1),
      shakeGain: (baseProfile.shakeGain ?? 0) * (preset.shakeBoost ?? 1) * (qualityMode.motionScale ?? 1),
      flickerChance: (baseProfile.flickerChance ?? 0) * (preset.flickerShift ?? 1) * (qualityMode.ambientScale ?? 1),
      vignetteAmount: Math.min(
        0.14,
        (baseProfile.vignetteAmount ?? 0) * (preset.vignetteBoost ?? 1) * (qualityMode.vignetteScale ?? 1),
      ),
      accentLead,
      accentColor: BRAND_TOKENS[accentLead] || BRAND_TOKENS.COG_BLUE,
      presetKey: resolveVisualPresetKey(),
      presetLabel: preset.label || "CINEMATIC",
      qualityTier: qualityMode.label || "STANDARD",
    };
  }

  function blendVfxProfiles(fromProfile, toProfile, t) {
    const amount = clamp(t, 0, 1);
    const lerpValue = (a, b) => a + (b - a) * amount;
    return {
      ...toProfile,
      toneStrength: lerpValue(fromProfile.toneStrength || 0, toProfile.toneStrength || 0),
      motionAmp: lerpValue(fromProfile.motionAmp || 0, toProfile.motionAmp || 0),
      particles: Math.max(1, Math.round(lerpValue(fromProfile.particles || 0, toProfile.particles || 0))),
      particleDensity: lerpValue(fromProfile.particleDensity || 1, toProfile.particleDensity || 1),
      effectCap: lerpValue(fromProfile.effectCap || 0, toProfile.effectCap || 0),
      noiseDensity: lerpValue(fromProfile.noiseDensity || 1, toProfile.noiseDensity || 1),
      scanlineDensity: lerpValue(fromProfile.scanlineDensity || 1, toProfile.scanlineDensity || 1),
      scanlineStrength: lerpValue(fromProfile.scanlineStrength || 0, toProfile.scanlineStrength || 0),
      noiseSpeed: lerpValue(fromProfile.noiseSpeed || 1, toProfile.noiseSpeed || 1),
      bloom: lerpValue(fromProfile.bloom || 0, toProfile.bloom || 0),
      chromaShift: lerpValue(fromProfile.chromaShift || 0, toProfile.chromaShift || 0),
      frameJitter: lerpValue(fromProfile.frameJitter || 0, toProfile.frameJitter || 0),
      shakeGain: lerpValue(fromProfile.shakeGain || 0, toProfile.shakeGain || 0),
      flickerChance: lerpValue(fromProfile.flickerChance || 0, toProfile.flickerChance || 0),
      vignetteAmount: lerpValue(fromProfile.vignetteAmount || 0, toProfile.vignetteAmount || 0),
      accentLead: amount < 0.55 ? fromProfile.accentLead : toProfile.accentLead,
      accentColor: amount < 0.55 ? fromProfile.accentColor : toProfile.accentColor,
    };
  }

  function resolveActiveVfxProfile() {
    const currentMode = state.mode || "title";
    const transition = (state.visual && state.visual.modeTransition) || null;
    const transitionActive = transition && transition.duration > 0 && transition.timer > 0;
    const currentProfile = resolveModeVfxProfile(currentMode);
    if (!transitionActive || !transition.fromMode || !transition.toMode || transition.fromMode === transition.toMode) {
      return currentProfile;
    }

    const fromProfile = resolveModeVfxProfile(transition.fromMode);
    const toProfile = currentProfile;
    const travel = 1 - transition.timer / Math.max(1, transition.duration);
    const edgeProfile = blendVfxProfiles(fromProfile, toProfile, travel);
    edgeProfile.transitionBlend = clamp(travel, 0, 1);
    return edgeProfile;
  }

  function normalizeTransitionFrames(frames) {
    const value = Number(frames);
    if (!Number.isFinite(value)) return Math.round(TARGET_FPS * 0.25);
    return clamp(Math.round(value), 1, TARGET_FPS * 2);
  }

  function startModeTransition(nextMode, options = {}) {
    if (!state.visual) return;
    const target = nextMode || "title";
    const currentMode = state.mode || "title";
    const frames = normalizeTransitionFrames(
      Number.isFinite(options.durationFrames) ? options.durationFrames : TARGET_FPS * 0.22,
    );
    if (currentMode === target) {
      state.visual.modeTransition = {
        timer: 0,
        duration: 0,
        fromMode: target,
        toMode: target,
      };
      return;
    }
    state.visual.modeTransition = {
      timer: frames,
      duration: frames,
      fromMode: currentMode,
      toMode: target,
    };
  }

  const VFX_AUDIT = Object.freeze({
    ONE_ACCENT_WARNING_KEY: "visual_one_accent_logged",
    READABILITY_WARNING_KEY: "visual_readability_logged",
  });
  const vfxComplianceState = {
    oneAccentWarned: false,
    readabilityWarnedModes: {},
    lastTransitionProfileMode: null,
  };

  function assertSingleAccent(profile) {
    if (!profile || vfxComplianceState.oneAccentWarned) return;
    const tone = sceneTone(state.mode);
    const lead = parseColorTokens(profile.accentColor || tone.lead || tone.text || BRAND_TOKENS.INK);
    const secondary = parseColorTokens(tone.secondary || tone.lead || tone.accentPulse || tone.text);
    const accent = parseColorTokens(tone.accentPulse || tone.lead || tone.text);
    const profileColor = parseColorTokens(profile.accentColor || tone.lead || tone.text);
    const compare = (a, b) =>
      !a && !b ? true : !!a && !!b && a.r === b.r && a.g === b.g && a.b === b.b;
    if (!compare(lead, secondary) || !compare(lead, accent) || !compare(lead, profileColor)) {
      console.warn(`OSAN Compliance: scene "${state.mode}" has ${VFX_AUDIT.ONE_ACCENT_WARNING_KEY}`);
      vfxComplianceState.oneAccentWarned = true;
    }
  }

  function assertReadableContrast(profile, tone) {
    if (!profile || !tone) return;
    const modeKey = String(state.mode || "title");
    if (vfxComplianceState.readabilityWarnedModes[modeKey]) return;
    const headlineContrast = colorContrastRatio(tone.text, tone.surface || tone.panelFill || "#ffffff");
    if (headlineContrast < 4.2) {
      console.warn(
        `OSAN Compliance: scene "${modeKey}" dropped contrast floor. ratio ${headlineContrast.toFixed(2)} < 4.2 (${VFX_AUDIT.READABILITY_WARNING_KEY})`,
      );
      vfxComplianceState.readabilityWarnedModes[modeKey] = true;
      return;
    }
    const panelContrast = colorContrastRatio(tone.text, tone.panelFill || tone.surface || "#ffffff");
    if (panelContrast < 3.4) {
      console.warn(
        `OSAN Compliance: scene "${modeKey}" has weak panel contrast ${panelContrast.toFixed(2)} < 3.4 (${VFX_AUDIT.READABILITY_WARNING_KEY})`,
      );
      vfxComplianceState.readabilityWarnedModes[modeKey] = true;
    }
  }

  function cycleVisualPreset() {
    const current = VISUAL_PRESET_ORDER.indexOf(resolveVisualPresetKey());
    const next = VISUAL_PRESET_ORDER[(current + 1) % VISUAL_PRESET_ORDER.length];
    state.visual.vfxPreset = next;
  }

  function isMinimalVisualPreset() {
    return resolveVisualPresetKey() === "minimal";
  }

  function isModernVisualPreset() {
    return resolveVisualPresetKey() === "modern";
  }

  function queueVfxPulse(type, amount = 0.22, options = {}) {
    if (!state.visual || !state.visual.vfxPulse) return;
    if (!(type in state.visual.vfxPulse)) return;
    const clampAmount = clamp(Number.isFinite(amount) ? amount : 0, 0, 1.2);
    const pulseScale = clamp(Number.isFinite(options.scale) ? options.scale : 1, 0, 3);
    const pulseCap = clamp(Number.isFinite(options.max) ? options.max : 1, 0, 1.2);
    state.visual.vfxPulse[type] = Math.min(
      pulseCap,
      (Number(state.visual.vfxPulse[type]) || 0) + clampAmount * pulseScale,
    );
  }

  function decayVfxPulse(name, amountPerFrame) {
    if (!state.visual || !state.visual.vfxPulse || !(name in state.visual.vfxPulse)) return;
    const value = Number(state.visual.vfxPulse[name]);
    if (!Number.isFinite(value) || value <= 0) {
      state.visual.vfxPulse[name] = 0;
      return;
    }
    state.visual.vfxPulse[name] = Math.max(0, value - amountPerFrame);
  }

  function resolveVfxPulses() {
    const pulses = state.visual && state.visual.vfxPulse ? state.visual.vfxPulse : null;
    return pulses
      ? {
          transition: clamp(pulses.transition || 0, 0, 1),
          modeShift: clamp(pulses.modeShift || 0, 0, 1),
          battle: clamp(pulses.battle || 0, 0, 1),
          ambient: clamp(pulses.ambient || 0, 0, 1),
          split: clamp(pulses.split || 0, 0, 1),
          camera: clamp(pulses.camera || 0, 0, 1),
        }
      : {
          transition: 0,
          modeShift: 0,
          battle: 0,
          ambient: 0,
          split: 0,
          camera: 0,
        };
  }

  function resolvePostProcessSourceCanvas(profile) {
    const activeProfile = profile || resolveActiveVfxProfile();
    const chromaShift = Number.isFinite(activeProfile.chromaShift) ? Math.max(0, activeProfile.chromaShift) : 0;
    if (chromaShift <= 0 || !postFxCtx) return scene;

    const shiftPx = Math.round(chromaShift * 40);
    if (shiftPx < 1) return scene;
    postFxCtx.setTransform(1, 0, 0, 1, 0, 0);
    postFxCtx.clearRect(0, 0, SIM_W, SIM_H);
    postFxCtx.imageSmoothingEnabled = true;
    postFxCtx.imageSmoothingQuality = "high";
    postFxCtx.drawImage(scene, 0, 0, SIM_W, SIM_H);

    const sourceData = postFxCtx.getImageData(0, 0, SIM_W, SIM_H).data;
    const targetData = postFxImageData.data;

    for (let y = 0; y < SIM_H; y += 1) {
      const row = y * SIM_W * 4;
      const baseShift = Math.min(SIM_W - 1, Math.max(0, Math.round(Math.sin(state.frame * 0.011 + y * 0.002) * 0.3 * shiftPx)));
      for (let x = 0; x < SIM_W; x += 1) {
        const rx = Math.min(SIM_W - 1, Math.max(0, x - shiftPx + baseShift));
        const bx = Math.min(SIM_W - 1, Math.max(0, x + shiftPx - baseShift));
        const src = row + x * 4;
        const rSrc = row + rx * 4;
        const bSrc = row + bx * 4;
        targetData[src] = sourceData[rSrc];
        targetData[src + 1] = sourceData[src + 1];
        targetData[src + 2] = sourceData[bSrc + 2];
        targetData[src + 3] = sourceData[src + 3];
      }
    }
    postFxCtx.putImageData(postFxImageData, 0, 0);
    return postFxCanvas;
  }

  function resolveRenderScale(rawScale, displayW, displayH) {
    if (!rawScale || rawScale <= 0) return 1;
    if (!state || !state.visual) return rawScale;
    const renderPolicy = resolveVisualPolicy();
    if (renderPolicy !== "nearest" || VISUAL_PIPELINE.sceneScaleMode !== "integer") {
      return rawScale;
    }
    if (rawScale < 1.2) return rawScale;

    const floorScale = Math.max(1, Math.floor(rawScale));
    const ceilScale = floorScale + 1;
    const overflowTolerance = VISUAL_PIPELINE.quality.maxSnapOverflow;
    const floorOverflowX = Math.max(0, (floorScale * SIM_W - displayW) / displayW);
    const floorOverflowY = Math.max(0, (floorScale * SIM_H - displayH) / displayH);
    const ceilOverflowX = Math.max(0, (ceilScale * SIM_W - displayW) / displayW);
    const ceilOverflowY = Math.max(0, (ceilScale * SIM_H - displayH) / displayH);
    const floorFits = Math.max(floorOverflowX, floorOverflowY) <= overflowTolerance;
    const ceilFits = Math.max(ceilOverflowX, ceilOverflowY) <= overflowTolerance;
    const snapTolerance = VISUAL_PIPELINE.quality.snapScaleTolerance;
    const floorDelta = rawScale - floorScale;

    if (floorFits && floorScale === 1) {
      return 1;
    }

    if (floorFits && floorDelta <= snapTolerance) {
      return floorScale;
    }

    if (ceilFits && ceilScale > 1 && ceilScale - rawScale <= snapTolerance) {
      return ceilScale;
    }

    if (floorFits) return floorScale;
    if (floorScale === 1 && ceilFits) return ceilScale;
    return rawScale;
  }

  function prefersReducedMotion() {
    if (!window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function applyReducedMotionState() {
    if (!document || !document.body) return;
    document.body.classList.toggle("motion-reduced", prefersReducedMotion());
  }

  function bindReducedMotionPreference() {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const onChange = () => applyReducedMotionState();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onChange);
    }
  }

  function paletteForMode(mode) {
    const tone = sceneTone(mode);
    return {
      surface: tone.surface,
      panelFill: tone.panelFill,
      panelEdge: tone.edge,
      lead: tone.lead,
      secondary: tone.secondary,
      accentPulse: tone.accentPulse,
      text: tone.text,
      subtle: tone.subtle,
    };
  }

  function toneTextShade(color, strength = 1) {
    return withAlpha(color, 0.42 + 0.58 * strength);
  }

  function colorGovernor(mode, mission, seedValue) {
    const recipe = sceneStyle(mode);
    const seedOffset = (seedValue >>> 0) % ACCENT_ORDER.length;
    const missionSecondary = mission && mission.target && mission.target.id ? mission.target.id : "";
    return {
      primary: pickAccentLead(mode, mission, seedValue),
      secondary:
        recipe.secondaryToken || ACCENT_ORDER[(seedOffset + 1) % ACCENT_ORDER.length],
      accentPulse: recipe.accentPulseToken || recipe.secondaryToken || recipe.accentLead,
      missionTint: missionSecondary ? speciesByToken(missionSecondary) : null,
    };
  }

  function initializeSpriteRegistry() {
    spriteStatus.total = 0;
    spriteStatus.loaded = 0;
    spriteStatus.missing = 0;
    spriteStatus.loading = 0;
    state.visual.useVectorFallback = true;
    for (const [key, src] of Object.entries(spriteManifest)) {
      const entry = { key, src, image: null, state: "loading" };
      spriteRegistry[key] = entry;
      spriteStatus.total += 1;
      spriteStatus.loading += 1;
      probeSprite(entry);
    }
  }

  function probeSprite(entry) {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (entry.state !== "loading") return;
      if (!image.naturalWidth || !image.naturalHeight) {
        markSpriteUnavailable(entry);
        return;
      }
      entry.image = image;
      entry.state = "ready";
      spriteStatus.loaded += 1;
      spriteStatus.loading -= 1;
      if (spriteStatus.loading <= 0 && spriteStatus.missing === 0) {
        state.visual.useVectorFallback = false;
      }
    };
    image.onerror = () => {
      markSpriteUnavailable(entry);
    };
    entry.image = image;
    image.src = entry.src;
  }

  function markSpriteUnavailable(entry) {
    if (entry.state !== "loading") return;
    entry.state = "missing";
    spriteStatus.missing += 1;
    spriteStatus.loading -= 1;
    state.visual.useVectorFallback = spriteStatus.loading > 0 || spriteStatus.missing > 0;
  }

  function drawSpriteByKey(key, x, y, diameter, fallbackDraw = null, options = null) {
    const opts = options || {};
    const entry = spriteRegistry[key];
    const image = entry ? entry.image : null;
    const renderX = x + (Number.isFinite(opts.motionX) ? opts.motionX : 0);
    const renderY = y + (Number.isFinite(opts.motionY) ? opts.motionY : 0);
    const isModern = isModernVisualPreset();
    const isSmooth = !isModern && resolveVisualPolicy() === "smooth";
    if (entry && entry.state === "ready" && image && image.complete && image.naturalWidth > 0) {
      const previousSmoothing = sceneCtx.imageSmoothingEnabled;
      const previousSmoothingQuality = sceneCtx.imageSmoothingQuality;
      sceneCtx.imageSmoothingEnabled = isSmooth;
      sceneCtx.imageSmoothingQuality = isSmooth ? "high" : "low";
      const snappedDiameter = Math.max(1, isSmooth ? diameter : Math.round(diameter));
      const half = snappedDiameter * 0.5;
      const drawX = isSmooth ? renderX - half : Math.round(renderX - half);
      const drawY = isSmooth ? renderY - half : Math.round(renderY - half);
      sceneCtx.drawImage(image, drawX, drawY, snappedDiameter, snappedDiameter);
      if (opts.glowColor) {
        const glowAlpha = Number.isFinite(opts.glowAlpha) ? opts.glowAlpha : 0.05;
        const glowColor = withAlpha(opts.glowColor, Math.max(0, Math.min(0.18, glowAlpha)));
        if (glowAlpha > 0) {
          sceneCtx.save();
          sceneCtx.globalCompositeOperation = "source-atop";
          sceneCtx.fillStyle = glowColor;
          sceneCtx.fillRect(drawX, drawY, snappedDiameter, snappedDiameter);
          sceneCtx.restore();
        }
      }
      sceneCtx.imageSmoothingEnabled = previousSmoothing;
      sceneCtx.imageSmoothingQuality = previousSmoothingQuality;
      return true;
    }
    if (fallbackDraw) fallbackDraw();
    return false;
  }

  function spriteKeyForEntity(entity) {
    if (entity.kind === "alien" && entity.species && entity.species.id) return `alien-${entity.species.id}`;
    if (entity.kind === "beacon") return "beacon";
    if (entity.kind === "probe") return "probe";
    if (entity.kind === "enemy") return "enemy";
    if (entity.kind === "planet") return "planet";
    return entity.kind;
  }

  function spriteSizeForEntity(entity) {
    if (entity.kind === "player") return Math.max(14, entity.r * 6.2) * VISUAL_SPRITE_SCALE;
    if (entity.kind === "alien") return Math.max(16, entity.r * 4.8) * VISUAL_SPRITE_SCALE;
    if (entity.kind === "enemy") return Math.max(18, entity.r * 5.2) * VISUAL_SPRITE_SCALE;
    if (entity.kind === "beacon") return Math.max(16, entity.r * 7.2) * VISUAL_SPRITE_SCALE;
    if (entity.kind === "probe") return Math.max(16, entity.r * 7.4) * VISUAL_SPRITE_SCALE;
    return Math.max(12, entity.r * 4.2) * VISUAL_SPRITE_SCALE;
  }

  function drawSpriteEntity(entity, fallbackDraw) {
    const tone = sceneTone(state.mode);
    const size = spriteSizeForEntity(entity);
    const pulses = resolveVfxPulses();
    const spriteOffset = resolveSpriteRenderOffset(entity);
    const spriteAccent = resolveSpriteAccent(entity, tone);
    const prevAlpha = sceneCtx.globalAlpha;
    const capturedFade = entity.kind === "alien" && entity.captured ? 0.3 : 1;
    sceneCtx.globalAlpha = capturedFade;
    if (state.visual && state.visual.useVectorFallback) {
      if (fallbackDraw) {
        fallbackDraw(
          {
            ...entity,
            x: entity.x + spriteOffset.motionX,
            y: entity.y + spriteOffset.motionY,
          },
          tone,
          pulses,
        );
      }
      sceneCtx.globalAlpha = prevAlpha;
      return false;
    }
    const drawn = drawSpriteByKey(
      spriteKeyForEntity(entity),
      entity.x + spriteOffset.motionX,
      entity.y + spriteOffset.motionY,
      size,
      fallbackDraw && (() => {
        fallbackDraw(
          {
            ...entity,
            x: entity.x + spriteOffset.motionX,
            y: entity.y + spriteOffset.motionY,
          },
          tone,
          pulses,
        );
      }),
      {
        motionX: 0,
        motionY: 0,
        glowColor: spriteAccent,
        glowAlpha: (entity.kind === "alien" ? 0.055 : 0.028) * (0.9 + pulses.ambient * 0.6 + pulses.battle * 0.3),
      },
    );
    if (drawn && entity.kind === "alien" && entity.captured) {
      sceneCtx.fillStyle = withAlpha(tone.lead, 0.28);
      sceneCtx.beginPath();
      sceneCtx.arc(entity.x + spriteOffset.motionX, entity.y + spriteOffset.motionY, entity.r + 1, 0, Math.PI * 2);
      sceneCtx.fill();
    }
    if (drawn) {
      drawSpriteMicroAtmosphere({
        entity: {
          ...entity,
          x: entity.x + spriteOffset.motionX,
          y: entity.y + spriteOffset.motionY,
        },
        tone,
        spriteAccent,
        spriteSize: size,
        isCaptured: entity.kind === "alien" && entity.captured,
        pulses,
      });
    }
    sceneCtx.globalAlpha = prevAlpha;
    return drawn;
  }

  function resolveSpriteRenderOffset(entity) {
    if (!entity || !Number.isFinite(entity.x) || !Number.isFinite(entity.y)) {
      return { motionX: 0, motionY: 0 };
    }
    const modeBoost = state.mode === "battle" ? 0.72 : state.mode === "mission" ? 0.56 : 0.42;
    const intensity = Number.isFinite(entity.r) ? Math.max(0.22, Math.min(0.85, entity.r / 14)) : 0.42;
    const jitterBaseX = frameNoise(Math.floor(entity.x * 13), Math.floor(entity.y * 17), 31);
    const jitterBaseY = frameNoise(Math.floor(entity.y * 19), Math.floor(entity.x * 23), 37);
    const jitterX = (jitterBaseX - 0.5) * modeBoost * intensity;
    const jitterY = (jitterBaseY - 0.5) * modeBoost * intensity * 0.74;
    return {
      motionX: jitterX,
      motionY: jitterY,
    };
  }

  function resolveSpriteAccent(entity, tone) {
    if (entity && entity.kind === "player") return tone.text;
    if (entity && entity.kind === "alien" && entity.species && entity.species.color) return entity.species.color;
    if (entity && entity.kind === "enemy") return tone.secondary;
    if (entity && entity.kind === "beacon") return tone.accentPulse;
    if (entity && entity.kind === "probe") return tone.subtle;
    return tone.secondary;
  }

  function drawSpriteMicroAtmosphere({
    entity,
    tone,
    spriteAccent,
    spriteSize = 8,
    isCaptured = false,
    pulses,
  }) {
    if (!entity || !Number.isFinite(entity.x) || !Number.isFinite(entity.y)) return;
    const pulse = 0.4 + pulses.ambient * 0.35 + (entity.kind === "alien" ? 0.1 : 0);
    const glow = Math.max(0.35, Math.min(0.85, 0.18 + pulses.modeShift + pulses.ambient));
    const ringPulse = pulse + (isCaptured ? 0.22 : 0);
    const baseRadius = Math.max(1.8, spriteSize * 0.52);

    sceneCtx.fillStyle = withAlpha(BRAND_TOKENS.INK, (0.06 + pulses.ambient * 0.03) * glow);
    sceneCtx.beginPath();
    sceneCtx.ellipse(
      entity.x,
      entity.y + (entity.r || spriteSize * 0.15),
      baseRadius * 1.55,
      Math.max(0.7, baseRadius * 0.42),
      0,
      0,
      Math.PI * 2,
    );
    sceneCtx.fill();

    sceneCtx.strokeStyle = withAlpha(spriteAccent, 0.13 + ringPulse * 0.11);
    sceneCtx.lineWidth = Math.max(0.35, Math.min(1.35, baseRadius * 0.09));
    sceneCtx.beginPath();
    sceneCtx.arc(entity.x, entity.y, baseRadius + 1, 0, Math.PI * 2);
    sceneCtx.stroke();

    if (entity.kind === "alien" && !isCaptured) {
      const drift = Math.sin(state.visual.fxFrame * 0.17 + entity.x * 0.04) * 1.2;
      for (let i = 0; i < 2; i += 1) {
        const seed = frameNoise(i * 17, entity.x + entity.r + state.visual.fxFrame, 53);
        if (seed < 0.22) continue;
        const angle = seed * Math.PI * 2;
        const dist = baseRadius * (0.6 + i * 0.18);
        const px = entity.x + Math.cos(angle + drift) * dist;
        const py = entity.y + Math.sin(angle + drift) * (dist * 0.75);
        sceneCtx.fillStyle = withAlpha(spriteAccent, 0.05 + seed * 0.08 + pulses.battle * 0.04);
        sceneCtx.fillRect(px, py, Math.max(1, Math.floor(baseRadius * 0.16)), Math.max(1, Math.floor(baseRadius * 0.16)));
      }
    }

    if (isCaptured) {
      sceneCtx.fillStyle = withAlpha(tone.surface, 0.21);
      sceneCtx.fillRect(
        entity.x - baseRadius * 0.6,
        entity.y - baseRadius * 0.8,
        baseRadius * 1.2,
        baseRadius * 0.18,
      );
    }
  }

  function drawAlienFallback(entity, tone = null) {
    const palette = tone || sceneTone(state.mode);
    const x = Math.round(entity.x);
    const y = Math.round(entity.y);
    const r = Math.round(entity.r);
    sceneCtx.fillStyle = entity.captured ? withAlpha(palette.lead, 0.25) : entity.species.color;
    sceneCtx.beginPath();
    sceneCtx.arc(x, y, r, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.strokeStyle = palette.text;
    sceneCtx.lineWidth = 0.7;
    sceneCtx.stroke();
  }

  function drawEnemyFallback(entity, tone = null) {
    const palette = tone || sceneTone(state.mode);
    const x = Math.round(entity.x - entity.r);
    const y = Math.round(entity.y - entity.r);
    const size = Math.max(1, Math.round(entity.r * 2));
    sceneCtx.fillStyle = palette.lead;
    sceneCtx.fillRect(x, y, size, size);
    sceneCtx.strokeStyle = palette.text;
    sceneCtx.lineWidth = 0.7;
    sceneCtx.strokeRect(x, y, size, size);
    sceneCtx.fillStyle = palette.text;
    sceneCtx.fillText("x", x + 1, y + 1);
  }

  function drawBeaconFallback(entity, tone = null) {
    const palette = tone || sceneTone(state.mode);
    const x = Math.round(entity.x - entity.r);
    const y = Math.round(entity.y - entity.r);
    const size = Math.max(1, Math.round(entity.r * 2));
    sceneCtx.fillStyle = entity.activated ? palette.lead : palette.subtle;
    sceneCtx.fillRect(x, y, size, size);
    sceneCtx.strokeStyle = palette.text;
    sceneCtx.lineWidth = 0.7;
    sceneCtx.strokeRect(x, y, size, size);
  }

  function drawProbeFallback(entity, tone = null) {
    const palette = tone || sceneTone(state.mode);
    const x = Math.round(entity.x);
    const y = Math.round(entity.y);
    sceneCtx.fillStyle = entity.attached ? palette.lead : palette.subtle;
    sceneCtx.beginPath();
    sceneCtx.moveTo(x, y - 2);
    sceneCtx.lineTo(x + 2, y + 2);
    sceneCtx.lineTo(x - 2, y + 2);
    sceneCtx.closePath();
    sceneCtx.fill();
    sceneCtx.strokeStyle = palette.text;
    sceneCtx.lineWidth = 0.7;
    sceneCtx.stroke();
  }

  const state = {
    mode: "title",
    frame: 0,
    seed: 0x1d4a11c3,
    deltaRemainder: 0,
    player: {
      x: SIM_W / 2,
      y: SIM_H / 2,
      vx: 0,
      vy: 0,
      r: 3,
      speed: 60,
      hp: 5,
      maxHp: 5,
      invulnFrames: 0,
      shootCd: 0,
      knockbackX: 0,
      knockbackY: 0,
      damageStreak: 0,
      damageDecay: 0,
    },
    hubs: [],
    hubEnter: 0,
    selectedPlanet: null,
    entities: [],
    mission: null,
    objective: {
      current: null,
      capturedSpecies: {},
      capturedCount: 0,
      holdProgress: 0,
    },
    petDex: {},
    party: [],
    storage: [],
    activePetId: null,
    petCounter: 0,
    encounterCounter: 0,
    battle: null,
    score: 0,
    flash: 0,
    messages: [],
    completedPlanets: 0,
    planetLockId: null,
    planetLockTimer: 0,
    ui: {
      helpVisible: true,
      helpPinned: false,
      autoHelpUntilFrame: TARGET_FPS * 5,
      firstMissionHelpShown: false,
    },
    visual: {
      accentLead: SCENE_RECIPES.title.accentLead,
      contrastMode: SCENE_RECIPES.title.contrastMode,
      renderQualityMode: "smooth",
      fxProfile: VISUAL_PIPELINE.vfxProfiles.title,
      vfxPreset: "modern",
      visualProfile: "standard",
      visualProfileAuto: true,
      fxFrame: 0,
      lastFrameMs: FRAME_MS * 1000,
      routePulsePhase: 0,
      hubPulseOffset: 0,
      battleImpactBurst: 0,
      battleImpactSide: "neutral",
      battleImpactColor: null,
      battleImpactSeed: 0,
      battleImpactSeverity: 1,
      vfxPulse: {
        transition: 0,
        modeShift: 0,
        battle: 0,
        ambient: 0,
        split: 0,
        camera: 0,
      },
      useVectorFallback: true,
      scaleMode: "smooth",
      battleHud: {
        enemyHp: 0,
        playerHp: 0,
      },
      modeTransition: {
        timer: 0,
        duration: 0,
        fromMode: "title",
        toMode: "title",
      },
      frameWarnings: [],
      frameWarningLimit: 6,
    },
    rng: 0x2abf34c1,
  };

  const transition = {
    timer: 0,
    duration: 0,
    targetMode: null,
  };

  function seed(seedValue) {
    state.rng = seedValue >>> 0;
    state.seed = state.rng;
  }

  function rand() {
    state.rng = (state.rng * 1664525 + 1013904223) >>> 0;
    return state.rng / 4294967296;
  }

  function randRange(min, max) {
    return min + (max - min) * rand();
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function dist2(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function rounded(v) {
    return Math.round(v * 100) / 100;
  }

  function lerp(from, to, t) {
    return from + (to - from) * t;
  }

  function hash32(v) {
    v ^= v >>> 16;
    v = Math.imul(v, 0x7feb352d);
    v ^= v >>> 15;
    v = Math.imul(v, 0x846ca68b);
    v ^= v >>> 16;
    return v >>> 0;
  }

  function frameNoise(x, y, salt) {
    const base = (state.seed >>> 0) ^ (state.frame * 2654435761) ^ ((state.mode.length * 131) & 0xffff);
    const n = hash32(base + x * 1103515245 + y * 12345 + (salt || 0) * 374761393);
    return (n % 1000) / 1000;
  }

  function pickAccentLead(mode, mission, seedValue) {
    if (mode === "mission" && mission && mission.task) {
      if (mission.task.id === "collect") return "COG_BLUE";
      if (mission.task.id === "clear_wave") return "COG_PINK";
      if (mission.task.id === "hold_sector") return "COG_MINT";
      if (mission.task.id === "activate_beacon") return "COG_YELLOW";
      if (mission.task.id === "escort_probe") return "COG_MINT";
    }
    if (SCENE_RECIPES[mode]) return SCENE_RECIPES[mode].accentLead;
    return ACCENT_ORDER[(seedValue >>> 0) % ACCENT_ORDER.length];
  }

  function sceneStyle(mode) {
    const recipe = SCENE_RECIPES[mode] || SCENE_RECIPES.title;
    return {
      leadToken: recipe.accentLead || "COG_BLUE",
      secondaryToken: recipe.accentSecondary || "COG_YELLOW",
      accentPulseToken: recipe.accentPulse || recipe.accentLead,
      panelFill: recipe.panelFill || "FOG",
      edgeToken: recipe.edge || "INK",
      surface: recipe.surface || "WHITE",
      textToken: recipe.text || "INK",
      subtleToken: recipe.subtle || "SUBTLE_GRID",
    };
  }

  function sceneTone(mode) {
    const tone = sceneStyle(mode);
    const governor = colorGovernor(mode, state.mission, state.seed);
    const profileLead = BRAND_TOKENS[governor.primary] || BRAND_TOKENS.COG_BLUE;
    const accentPulse = BRAND_TOKENS[governor.accentPulse] || BRAND_TOKENS[tone.accentPulseToken] || profileLead;
    const secondaryTone = governor.missionTint || BRAND_TOKENS[governor.secondary] || BRAND_TOKENS[tone.secondaryToken] || profileLead;
    const toneProfile = {
      primary: BRAND_TOKENS[governor.primary] || BRAND_TOKENS.COG_BLUE,
      secondary: secondaryTone,
      lead: BRAND_TOKENS[governor.primary] || BRAND_TOKENS.COG_BLUE,
      accentPulse,
      panelFill: BRAND_TOKENS[tone.panelFill] || BRAND_TOKENS.HUD_PANEL,
      edge: BRAND_TOKENS[tone.edgeToken] || BRAND_TOKENS.INK,
      surface: BRAND_TOKENS[tone.surface] || BRAND_TOKENS.WHITE,
      text: BRAND_TOKENS[tone.textToken] || BRAND_TOKENS.INK,
      subtle: BRAND_TOKENS[tone.subtleToken] || withAlpha(BRAND_TOKENS.INK, 0.2),
    };
    toneProfile.primary = profileLead;
    toneProfile.lead = profileLead;
    return toneProfile;
  }

  function speciesByToken(tokenOrSpeciesId) {
    if (!tokenOrSpeciesId) return null;
    const species = alienById[tokenOrSpeciesId];
    return species ? species.color : null;
  }

  function accentColor() {
    const lead = pickAccentLead(state.mode, state.mission, state.seed);
    return BRAND_TOKENS[lead] || BRAND_TOKENS.COG_BLUE;
  }

  function contextActionsForMode(mode) {
    const visualAction = `V: Visual preset (${visualPresetLabel()})`;
    if (mode === "title") {
      return [
        "Enter/Space: start",
        "Arrows/WASD: move",
        "F: fullscreen, Esc: close",
        "H: help",
        visualAction,
      ];
    }
    if (mode === "hub") {
      return [
        "Move near a planet",
        "Space: hold",
        "Hold 2 seconds",
        "H: help",
        visualAction,
      ];
    }
    if (mode === "mission") {
      return [
        "Move with arrows/WASD",
        "Touch hostile to battle",
        "Space: interact",
        "Capture in battle",
        "Complete task after capture",
        "H: help",
        visualAction,
      ];
    }
    if (mode === "battle") {
      return [
        "Left/Right or Up/Down: choose",
        "Space/Enter: confirm",
        "Backspace/Esc: cancel",
        "Fight, Switch, or Capture",
        "H: help",
        visualAction,
      ];
    }
    if (mode === "result") {
      return [
        "Mission resolves automatically",
        "Wait to return to ship",
        "H: help",
        visualAction,
      ];
    }
    return [
      "Arrows/WASD move",
      "Space or Enter: confirm",
      "H: help",
      visualAction,
      ];
  }

  function formatBattleMenuItem(label, selected) {
    return `${selected ? "▶ " : "  "}${label}`;
  }

  function resolveBattleActionsForMode() {
    if (!state.battle) return [];
    const battle = state.battle;
    const visualAction = `V: Visual preset (${visualPresetLabel()})`;
    const items = [];
    if (battle.menu.layer === "root") {
      items.push(
        formatBattleMenuItem(BATTLE_ROOT_ACTIONS[0] || "Fight", battle.menu.rootIndex === 0),
        formatBattleMenuItem(BATTLE_ROOT_ACTIONS[1] || "Switch", battle.menu.rootIndex === 1),
        formatBattleMenuItem(BATTLE_ROOT_ACTIONS[2] || "Capture", battle.menu.rootIndex === 2),
      );
      items.push("Left/Right/Up/Down: choose");
    } else if (battle.menu.layer === "fight") {
      const playerPet = activePlayerPet();
      const moves = playerPet && Array.isArray(playerPet.moves) ? playerPet.moves : [];
      if (moves.length === 0) {
        items.push("No battle moves available");
      } else {
        const visibleMoves = moves.slice(0, Math.min(4, moves.length));
        for (let i = 0; i < visibleMoves.length; i += 1) {
          const move = MOVE_DB[visibleMoves[i]];
          const label = move ? `${move.name} (PWR ${move.power || 0})` : visibleMoves[i];
          items.push(formatBattleMenuItem(label, battle.menu.moveIndex === i));
        }
      }
      items.push("Left/Right/Up/Down: choose");
      items.push("Backspace: return");
    } else if (battle.menu.layer === "switch") {
      const candidates = alivePartyIds();
      for (let i = 0; i < candidates.length; i += 1) {
        const pet = petById(candidates[i]);
        if (!pet) continue;
        const petLabel = `${speciesForId(pet.speciesId).name} HP ${pet.hp}/${pet.maxHp}`;
        items.push(formatBattleMenuItem(petLabel, battle.menu.switchIndex === i));
      }
      items.push("Left/Right/Up/Down: choose");
      items.push("Backspace: return");
    }
    items.push("Enter/Space: confirm", "P: profile cycle", visualAction);
    return items;
  }

  function externalActionsForMode(mode) {
    if (mode === "battle") {
      return resolveBattleActionsForMode();
    }
    return contextActionsForMode(mode).filter((action) => !/^H:\s*help$/i.test(action));
  }

  function collectConsoleLines() {
    const hudMessages = Array.isArray(state.messages) ? state.messages.slice(-2) : [];
    const battleMessages =
      state.battle && Array.isArray(state.battle.log) ? state.battle.log.slice(-3) : [];
    return [...hudMessages, ...battleMessages].slice(-3);
  }

  function resolveScenePhaseProgress(mode) {
    const transition = state.visual && state.visual.modeTransition;
    if (!transition || transition.duration <= 0 || transition.timer <= 0) return 0;
    const maxT = Math.max(1, transition.duration);
    return clamp(1 - transition.timer / maxT, 0, 1);
  }

  function resolveHUDThreatLevel() {
    const mode = state.mode || "title";
    if (mode === "mission") {
      const objective = state.objective.current;
      if (!objective) return 0;
      if (objective.task === "clear_wave") {
        const remaining = Math.max(0, (objective.enemyCount || 0));
        return clamp(1 - remaining / Math.max(1, state.mission ? state.mission.enemyTarget : 1), 0, 1);
      }
      return 1 - ((objective.targetCaptured || 0) / Math.max(1, objective.targetRequired || 1));
    }
    if (state.visual && Array.isArray(state.visual.frameWarnings) && state.visual.frameWarnings.length) {
      const limit = state.visual.frameWarningLimit || 6;
      return clamp(state.visual.frameWarnings.length / Math.max(1, limit), 0, 1);
    }
    return 0;
  }

  function updateHudNodeClass(node, nextClass) {
    if (!node) return;
    for (const cls of HUD_STATE_CLASS) node.classList.remove(cls);
    if (nextClass) node.classList.add(nextClass);
  }

  function syncHudTextNode(node, rawValue, fallback = "") {
    if (!node) return;
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      node.textContent = String(fallback);
    } else {
      node.textContent = String(rawValue);
    }
  }

  function syncHUDConsole() {
    if (!hudNodes.consoleLines) return;
    const messages = collectConsoleLines();
    const list = hudNodes.consoleLines;
    while (list.children.length < messages.length) {
      list.appendChild(document.createElement("li"));
    }
    while (list.children.length > messages.length) {
      list.removeChild(list.lastElementChild);
    }
    for (let i = 0; i < list.children.length; i += 1) {
      list.children[i].textContent = messages[i] || "";
    }
  }

  function syncModeMetricsPayload() {
    const scene = resolveSceneVisualState(state.mode, resolveScenePhaseProgress(state.mode));
    const objective = state.objective.current;
    const objectiveTitle = objective ? `${objective.taskText || "Objective"}: ${objective.targetName || "unknown"}` : "No objective";
    const objectiveProgress = objective
      ? `${objective.targetCaptured || 0}/${objective.targetRequired || 1}`
      : "0 / 0";
    const threatLevel = Math.round(resolveHUDThreatLevel() * 100);
    const enemyCount = objective ? Math.max(0, objective.enemyCount || 0) : 0;
    const comboHint = state.battle ? `${state.battle.menu?.layer || "root"} / turn ${state.battle.turn || 0}` : "No battle";
    const cooldownState =
      state.mode === "mission"
        ? `lock: ${state.planetLockTimer || 0}`
        : state.player.shootCd > 0
          ? `cooldown: ${state.player.shootCd.toFixed(1)}`
          : "ready";
    const threatColor = scene.threatColor || "COG_BLUE";

    return {
      modeTitle:
        scene.mode === "title"
          ? "Boot Sequence"
          : scene.mode === "hub"
            ? "Hub Command"
            : scene.mode === "mission"
              ? "Mission Control"
              : scene.mode === "battle"
                ? "Battle Deck"
                : "Result Deck",
      modeSubtitle:
        scene.mode === "hub"
          ? "Select planet node and hold for mission lock"
          : scene.mode === "mission"
            ? "Complete target objective"
            : scene.mode === "battle"
              ? "Resolve encounter"
              : scene.mode === "result"
                ? "Mission resolved"
                : "Press start to deploy",
      modePhase: scene.mode.toUpperCase(),
      objectiveTitle,
      objectiveProgress,
      objectiveHint: objectiveHintText(),
      threatScore: Math.max(0, state.score),
      threatLevel: `${threatLevel}%`,
      threatLevelClass: threatLevel >= 75 ? "is-critical" : threatLevel >= 55 ? "is-warning" : threatLevel >= 0 ? "is-ready" : "is-muted",
      enemyCount,
      missionState:
        state.mode === "mission" && objective
          ? `${state.mode.toUpperCase()} • ${objective.task}`
          : state.mode === "hub"
            ? `PLANETS: ${state.completedPlanets}`
            : state.mode === "battle"
              ? `BATTLE ${state.battle && state.battle.turn ? `T${state.battle.turn}` : "..." }`
              : state.mode === "result"
                ? "RETURNING"
                : "READY",
      missionCombo: comboHint,
      missionCooldown: cooldownState,
      hpText: `${state.player.hp}/${state.player.maxHp}`,
      visualPresetText: `Preset: ${visualPresetLabel()}`,
      visualProfileText: `Profile: ${resolveVisualProfileLabel()}`,
      threatClassColor: threatColor,
      objectiveReady:
        objective && (objective.taskDone || objective.targetCaptured >= (objective.targetRequired || 1)) ? "is-ready" : "is-muted",
      frameBudget: Number.isFinite(state.visual.lastFrameMs) ? Math.round(state.visual.lastFrameMs) : null,
    };
  }

  function objectiveHintText() {
    if (state.mode === "battle" && state.battle) {
      const enemyName = (alienById[state.battle.enemySpeciesId] || alienSpecies[0]).name;
      return `Battle target: ${enemyName}`;
    }
    if (!state.objective.current) return "No active objective";
    return `Capture ${state.objective.current.targetName}; ${state.objective.current.taskText}`;
  }

  function helpOverlayVisible() {
    if (state.ui.helpPinned) return state.ui.helpVisible;
    return state.ui.helpVisible || state.frame <= state.ui.autoHelpUntilFrame;
  }

  function syncExternalControlsUI() {
    if (!controlsPanel || !controlsToggle || !controlsActions || !controlsObjective) return;
    const body = document.body;
    const visible = helpOverlayVisible();
    controlsPanel.classList.toggle("is-collapsed", !visible);
    controlsPanel.setAttribute("data-expanded", visible ? "true" : "false");
    controlsToggle.setAttribute("aria-pressed", visible ? "true" : "false");
    controlsToggle.textContent = visible ? "H: Hide Help" : "H: Show Help";
    if (body) {
      body.setAttribute("data-game-mode", state.mode);
      body.setAttribute("data-visual-preset", resolveVisualPresetKey());
      body.setAttribute("data-visual-tier", resolveVisualTierKey());
      body.setAttribute("data-ui-tier", state.visual && state.visual.visualProfileAuto === false ? "manual" : "auto");
      body.setAttribute("data-motion-state", prefersReducedMotion() ? "reduced" : "normal");
    }

    const metrics = syncModeMetricsPayload();
    const actions = externalActionsForMode(state.mode);
    controlsActions.textContent = "";
    for (const action of actions) {
      const item = document.createElement("li");
      const label = typeof action === "string" ? action : String(action || "");
      const isSelected = label.startsWith("▶ ");
      item.textContent = isSelected ? label.slice(2) : label;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-selected", isSelected ? "true" : "false");
      controlsActions.appendChild(item);
    }

    controlsObjective.textContent = objectiveHintText();
    syncHudTextNode(hudNodes.modeTitle, metrics.modeTitle, "Boot Sequence");
    syncHudTextNode(hudNodes.modeSubtitle, metrics.modeSubtitle, "No active mode");
    syncHudTextNode(hudNodes.modePhase, metrics.modePhase, "IDLE");
    syncHudTextNode(hudNodes.visualPreset, metrics.visualPresetText, "Preset: CINEMATIC");
    syncHudTextNode(hudNodes.visualProfile, metrics.visualProfileText, "Profile: STANDARD");
    syncHudTextNode(hudNodes.objectiveTitle, metrics.objectiveTitle, "No objective");
    syncHudTextNode(hudNodes.objectiveProgress, metrics.objectiveProgress, "0 / 0");
    syncHudTextNode(hudNodes.objectiveHint, metrics.objectiveHint, "No active objective");
    syncHudTextNode(hudNodes.threatHp, metrics.hpText, `${state.player.hp}/${state.player.maxHp}`);
    syncHudTextNode(hudNodes.threatScore, metrics.threatScore, "0");
    syncHudTextNode(hudNodes.threatLevel, metrics.threatLevel, "0%");
    syncHudTextNode(hudNodes.threatEnemies, metrics.enemyCount, "0");
    syncHudTextNode(hudNodes.missionState, metrics.missionState, "Awaiting launch");
    syncHudTextNode(hudNodes.missionCombo, metrics.missionCombo, "Combo ready");
    syncHudTextNode(hudNodes.missionCooldown, metrics.missionCooldown, "Ready");
    updateHudNodeClass(hudNodes.threatHp, state.player.hp <= 1 ? "is-critical" : "is-ready");
    updateHudNodeClass(hudNodes.threatLevel, metrics.threatLevelClass);
    updateHudNodeClass(hudNodes.missionCombo, metrics.objectiveReady);
    syncHUDConsole();
  }

  function brandAuditSnapshot() {
    const tone = sceneTone(state.mode);
    const profile = resolveModeVfxProfile(state.mode);
    const isSingleLead = tone.secondary === tone.lead && tone.accentPulse === tone.lead;
    return {
      oneAccentLead: isSingleLead,
      accentLead: state.visual.accentLead,
      secondaryTone: tone.secondary,
      toneDepth: isSingleLead ? "singleTone" : "twoTone",
      glowEffects: profile.bloom > 0.01 || profile.chromaShift > 0 || profile.flickerChance > 0,
      visualProfile: resolveVisualQualityMode(),
      visualProfileAuto: state.visual.visualProfileAuto,
      heavyGradients: profile.toneStrength > 0.9 || profile.motionAmp > 0.6,
      overlayWordCap: true,
      contrastMode: state.visual.contrastMode,
      frameBudget: state.visual.lastFrameMs,
    };
  }

  function makePlanetSeed(base, index) {
    return (base ^ ((index + 1) * 2654435761)) >>> 0;
  }

  function setInputDown(inputKey, edgeKey, isDown) {
    const wasDown = input[inputKey];
    input[inputKey] = isDown;
    if (isDown && !wasDown) {
      input[edgeKey] = true;
    }
  }

  function hubBiomeByIndex(index) {
    return HUB_BIOMES[index % HUB_BIOMES.length];
  }

  function relaxHubPlanets(planets) {
    for (let pass = 0; pass < 24; pass += 1) {
      let movedAny = false;
      for (let i = 0; i < planets.length; i += 1) {
        for (let j = i + 1; j < planets.length; j += 1) {
          const a = planets[i];
          const b = planets[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const targetGap = HUB_NODE_MIN_GAP + a.r + b.r;
          const d2 = dx * dx + dy * dy;
          if (d2 > targetGap * targetGap && d2 > 0) continue;
          const dist = Math.sqrt(Math.max(d2, 0.0001));
          const push = (targetGap - dist) / 2;
          if (push <= 0) continue;
          const nx = dist === 0 ? 1 : dx / dist;
          const ny = dist === 0 ? 0 : dy / dist;
          a.x += nx * push;
          a.y += ny * push;
          b.x -= nx * push;
          b.y -= ny * push;
          movedAny = true;
        }
      }
      if (!movedAny) break;
    }
  }

  function orderHubPlanets(planets) {
    const cx = SIM_W / 2;
    const cy = SIM_H / 2;
    const ordered = planets.map((planet) => ({
      ...planet,
      routeAngle: Math.atan2(planet.y - cy, planet.x - cx),
    }));
    ordered.sort((a, b) => a.routeAngle - b.routeAngle);
    for (let i = 0; i < ordered.length; i += 1) ordered[i].routeIndex = i;
    return ordered.sort((a, b) => a.routeIndex - b.routeIndex);
  }

  function makePlanetPreview(planet) {
    const missionSeed = (state.seed ^ (planet.runSeed << 1) ^ (planet.x * 31 + planet.y * 17)) >>> 0;
    const oldSeed = state.rng;
    state.rng = missionSeed;
    const available = alienSpecies.filter((a) => !a.legendary);
    const target = available[Math.floor(rand() * available.length)];
    const task = taskTemplates[Math.floor(rand() * taskTemplates.length)];
    state.rng = oldSeed;
    return {
      targetName: target.name,
      taskText: task.text,
    };
  }

  function generateHub(seedValue) {
    const planets = [];
    const count = 4;
    seed(seedValue);
    const centerX = SIM_W / 2;
    const centerY = SIM_H / 2;
    for (let i = 0; i < count; i++) {
      const pSeed = makePlanetSeed(seedValue, i);
      const span = (Math.PI * 2) / count;
      const old = state.rng;
      state.rng = pSeed;
      const angle = span * i + (rand() - 0.5) * span * 0.75;
      const radius = 42 + rand() * 34;
      const x = clamp(centerX + radius * Math.cos(angle), SAFE_MARGIN, SIM_W - SAFE_MARGIN);
      const y = clamp(centerY + radius * Math.sin(angle), SAFE_MARGIN + 8, SIM_H - SAFE_MARGIN - 20);
      planets.push({
        id: `planet-${i + 1}`,
        name: `Planet ${i + 1}`,
        x,
        y,
        r: 11,
        biome: hubBiomeByIndex(i),
        runSeed: (old ^ (state.seed << 3) ^ (i * 19381)) >>> 0,
        routeIndex: i,
      });
    }
    relaxHubPlanets(planets);
    return orderHubPlanets(planets).map((planet) => {
      planet.x = clamp(planet.x, HUB_NODE_MARGIN, SIM_W - HUB_NODE_MARGIN);
      planet.y = clamp(planet.y, HUB_NODE_MARGIN, SIM_H - HUB_NODE_MARGIN - 18);
      return planet;
    });
  }

  function makeMission(planet) {
    const missionSeed = (state.seed ^ (planet.runSeed << 1) ^ (planet.x * 31 + planet.y * 17)) >>> 0;
    seed(missionSeed);

    const available = alienSpecies.filter((a) => !a.legendary);
    const target = available[Math.floor(rand() * available.length)];
    const task = taskTemplates[Math.floor(rand() * taskTemplates.length)];
    const enemyCount = 1 + Math.floor(rand() * 4);
    const radius = 36 + rand() * 28;
    const cadenceRange = Math.max(1, combatConfig.enemySpawnCadenceMax - combatConfig.enemySpawnCadenceMin);
    const enemySpawnCadence = combatConfig.enemySpawnCadenceMin + (missionSeed % cadenceRange);

    const enemyTemplate = [];
    const legendaryPool = alienSpecies.filter((species) => species.legendary);
    for (let i = 0; i < enemyCount; i++) {
      let enemySpecies = i === 0 || rand() < 0.45 ? target : available[Math.floor(rand() * available.length)];
      if (i > 0 && rand() < 0.12) {
        enemySpecies = legendaryPool[Math.floor(rand() * legendaryPool.length)];
      }
      enemyTemplate.push({
        kind: "enemy",
        enemyId: `${planet.id}-enemy-${i + 1}`,
        enemySpeciesId: enemySpecies.id,
        enemyLevel: 1 + Math.floor(rand() * 2) + Math.floor(state.completedPlanets / 2),
        x: 36 + rand() * (SIM_W - 72),
        y: 34 + rand() * (SIM_H - 72),
        r: 3,
        hp: 2,
        speed: 8 + rand() * 4,
        dx: (rand() - 0.5) * 12,
        dy: (rand() - 0.5) * 12,
      });
    }

    const burstOffset = Math.floor((missionSeed % Math.max(1, combatConfig.burstSpread + 1)));
    const activeEnemyCount = Math.min(
      Math.min(combatConfig.initialEnemyBurst + burstOffset, enemyTemplate.length),
      2
    );
    const aliens = [];
    for (let i = 0; i < 12; i++) {
      const sp = i === 0 || i === 1 ? target : alienSpecies[Math.floor(rand() * alienSpecies.length)];
      const isTarget = sp.id === target.id;
      aliens.push({
        kind: "alien",
        species: sp,
        x: 24 + rand() * (SIM_W - 48),
        y: 24 + rand() * (SIM_H - 48),
        r: 4,
        speed: 8 + rand() * 8,
        dx: (rand() - 0.5) * 10,
        dy: (rand() - 0.5) * 10,
        isTarget,
        captured: false,
      });
    }

    const beacons = task.id === "activate_beacon"
      ? [{ kind: "beacon", x: SIM_W / 2, y: SIM_H / 2, r: 4, activated: false }]
      : [];
    const probes = task.id === "escort_probe"
      ? [{ kind: "probe", x: 36 + rand() * (SIM_W - 72), y: Math.floor(SIM_H * 0.45), r: 3, attached: false }]
      : [];
    const extractionZone = task.id === "escort_probe"
      ? { x: SIM_W - 11, y: Math.floor(SIM_H / 2), r: 9 }
      : null;
    const holds = task.id === "hold_sector"
      ? { x: Math.floor(SIM_W * 0.285), y: Math.floor(SIM_H * 0.285), r: 11, time: 0 }
      : null;

    return {
      seed: missionSeed,
      planetId: planet.id,
      target,
      task,
      taskTarget: task.id,
      enemyTarget: enemyTemplate.length,
      enemyQueue: enemyTemplate.slice(activeEnemyCount),
      enemySpawnCadence,
      enemySpawnTimer: enemySpawnCadence + combatConfig.initialSpawnDelay,
      radius,
      entities: [
        ...alienTemplateToEntities(aliens),
        ...enemyTemplateToEntities(enemyTemplate.slice(0, activeEnemyCount)),
        ...beacons,
        ...probes,
      ],
      holdSector: holds,
      extractionZone,
      encounter: {
        pendingEnemyId: null,
        battlesWon: 0,
        battlesLost: 0,
      },
      done: false,
      phase: "active",
    };
  }

  function alienTemplateToEntities(aliens) {
    return aliens.map((a) => ({
      kind: "alien",
      species: a.species,
      x: a.x,
      y: a.y,
      r: a.r,
      speed: a.speed,
      dx: a.dx,
      dy: a.dy,
      captured: a.captured,
      isTarget: a.isTarget,
      pulse: randRange(0.5, 1.25),
      orbit: randRange(0, Math.PI * 2),
    }));
  }

  function enemyTemplateToEntities(enemies) {
    return enemies.map((e) => ({
      kind: "enemy",
      enemyId: e.enemyId,
      enemySpeciesId: e.enemySpeciesId,
      enemyLevel: e.enemyLevel || 1,
      x: e.x,
      y: e.y,
      r: e.r,
      hp: e.hp,
      speed: e.speed,
      vx: e.dx,
      vy: e.dy,
      aggression: 0.85 + rand() * 0.6,
    }));
  }

  function speciesForId(speciesId) {
    return alienById[speciesId] || alienSpecies[0];
  }

  function speciesTypeForId(speciesId) {
    let sum = 0;
    for (let i = 0; i < speciesId.length; i += 1) sum += speciesId.charCodeAt(i);
    return TYPE_DB[sum % TYPE_DB.length];
  }

  function speciesSeed(speciesId) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < speciesId.length; i += 1) {
      h ^= speciesId.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function moveSetForSpecies(speciesId) {
    const family = speciesTypeForId(speciesId);
    const moveIds = Object.keys(MOVE_DB);
    const typed = moveIds.filter((id) => MOVE_DB[id].type === family);
    const neutral = moveIds.filter((id) => MOVE_DB[id].type !== family);
    const seedValue = speciesSeed(speciesId);
    return [
      typed[seedValue % typed.length],
      typed[(seedValue + 1) % typed.length],
      neutral[(seedValue + 3) % neutral.length],
      neutral[(seedValue + 7) % neutral.length],
    ];
  }

  function makePetStats(speciesId, level, seedSalt) {
    const statHash = hash32((speciesSeed(speciesId) ^ Math.imul(level + 11, 2654435761) ^ seedSalt ^ state.seed) >>> 0);
    const hpBonus = statHash % 7;
    const atkBonus = (statHash >>> 3) % 5;
    const defBonus = (statHash >>> 6) % 5;
    const spdBonus = (statHash >>> 9) % 5;
    const maxHp = 18 + level * 4 + hpBonus;
    return {
      level,
      xp: 0,
      maxHp,
      hp: maxHp,
      atk: 6 + level * 2 + atkBonus,
      def: 5 + level + defBonus,
      spd: 5 + level + spdBonus,
      status: "none",
    };
  }

  function createPlayerPet(speciesId, level = 1) {
    state.petCounter += 1;
    const id = `pet-${state.petCounter}`;
    const stats = makePetStats(speciesId, level, state.petCounter * 9719);
    return {
      id,
      speciesId,
      nickname: "",
      ...stats,
      moves: moveSetForSpecies(speciesId),
    };
  }

  function createEnemyPet(speciesId, level = 1, seedSalt = 0) {
    const stats = makePetStats(speciesId, level, seedSalt ^ 0x9e3779b9);
    return {
      id: `enemy-${seedSalt}`,
      speciesId,
      ...stats,
      moves: moveSetForSpecies(speciesId),
    };
  }

  function petById(petId) {
    return petId ? state.petDex[petId] : null;
  }

  function alivePartyIds() {
    return state.party.filter((petId) => {
      const pet = petById(petId);
      return pet && pet.hp > 0;
    });
  }

  function firstAlivePartyPetId() {
    return alivePartyIds()[0] || null;
  }

  function ensureStarterParty() {
    if (state.party.length > 0) {
      if (!state.activePetId || !petById(state.activePetId)) state.activePetId = firstAlivePartyPetId();
      return;
    }
    const starterSpecies = (state.mission && state.mission.target && state.mission.target.id) || "vulkr";
    const starter = createPlayerPet(starterSpecies, 1);
    state.petDex[starter.id] = starter;
    state.party.push(starter.id);
    state.activePetId = starter.id;
    state.messages = [`Starter linked: ${speciesForId(starterSpecies).name}`];
  }

  function addPetToCollection(speciesId) {
    const level = Math.max(1, 1 + Math.floor(state.completedPlanets / 2));
    const pet = createPlayerPet(speciesId, level);
    state.petDex[pet.id] = pet;
    if (state.party.length < 6) state.party.push(pet.id);
    else state.storage.push(pet.id);
    if (!state.activePetId) state.activePetId = pet.id;
    return pet;
  }

  function registerBattleCapture(speciesId) {
    state.objective.capturedCount += 1;
    state.objective.capturedSpecies[speciesId] = (state.objective.capturedSpecies[speciesId] || 0) + 1;
    state.score += 1;
    if (state.objective.current && speciesId === state.objective.current.targetId) {
      state.objective.current.captured += 1;
      state.objective.current.targetCaptured += 1;
    }
    addPetToCollection(speciesId);
  }

  function battleRandom(salt = 0) {
    if (!state.battle) return 0.5;
    state.battle.rngStep = (state.battle.rngStep || 0) + 1;
    const seedValue = hash32(
      (
        state.seed ^
        Math.imul(state.battle.encounterId + 1, 1103515245) ^
        Math.imul(state.battle.turn + 1, 2654435761) ^
        Math.imul(state.battle.rngStep + 1, 374761393) ^
        salt
      ) >>> 0
    );
    return (seedValue % 1000) / 1000;
  }

  function activePlayerPet() {
    if (!state.battle) return null;
    return petById(state.battle.playerPetId);
  }

  function appendBattleLog(line) {
    if (!state.battle) return;
    state.battle.log.push(line);
    while (state.battle.log.length > 6) state.battle.log.shift();
  }

  function applyStatusBeforeAction(pet, name) {
    if (!pet || pet.hp <= 0) return false;
    if (pet.status === "stun") {
      if (battleRandom(91) < 0.3) {
        appendBattleLog(`${name} is stunned`);
        pet.status = "none";
        return false;
      }
      pet.status = "none";
    }
    return true;
  }

  function applyStatusAfterAction(pet, name) {
    if (!pet || pet.hp <= 0) return;
    if (pet.status === "burn") {
      pet.hp = Math.max(0, pet.hp - 1);
      appendBattleLog(`${name} took burn damage`);
    }
  }

  function moveEffectiveness(moveType, defenderType) {
    return (TYPE_MATRIX[moveType] && TYPE_MATRIX[moveType][defenderType]) || 1;
  }

  function applyMove(attacker, defender, moveId, attackerName, defenderName) {
    const move = MOVE_DB[moveId] || MOVE_DB.ion_jab;
    if (!applyStatusBeforeAction(attacker, attackerName)) return;
    const defenderType = speciesTypeForId(defender.speciesId);
    const base = move.power + attacker.atk * 0.6 - defender.def * 0.35;
    const variance = 0.95 + battleRandom(33) * 0.1;
    const typeMult = moveEffectiveness(move.type, defenderType);
    const damage = Math.max(1, Math.round(base * typeMult * variance));
    defender.hp = Math.max(0, defender.hp - damage);
    const tone = sceneTone(state.mode);
    const attackerSpeciesId = attacker && (attacker.speciesId || attacker.species?.id);
    const attackerSpeciesColor = attackerSpeciesId ? speciesForId(attackerSpeciesId).color : null;
    state.visual.battleImpactColor = attackerSpeciesColor || tone.accentPulse;
    const burstMagnitude = Math.min(18, Math.max(0, damage + 3));
    state.visual.battleImpactBurst = burstMagnitude;
    state.visual.battleImpactSeverity = Math.max(1, Math.min(4, Math.ceil(damage / 4)));
    state.visual.battleImpactSeed = (Number(state.visual.battleImpactSeed || 0) + 1) % 999;
    const activePlayer = activePlayerPet();
    const attackerSpecies = activePlayer && attacker && attacker.id === activePlayer.id;
    state.visual.battleImpactSide = attackerSpecies ? "player" : "enemy";
    queueVfxPulse("battle", 0.46, { scale: 1 + Math.min(1, damage / 14) });
    queueVfxPulse("camera", 0.22, { scale: 1 + Math.min(0.7, damage / 16) });
    if (damage >= 5) queueVfxPulse("split", 0.22);
    appendBattleLog(`${attackerName} used ${move.name}`);
    if (typeMult > 1) appendBattleLog("It is super effective");
    if (typeMult < 1) appendBattleLog("It is resisted");
    appendBattleLog(`${defenderName} lost ${damage} HP`);
    if (defender.hp > 0 && move.status && defender.status === "none" && battleRandom(57) < move.statusChance) {
      defender.status = move.status;
      appendBattleLog(`${defenderName} is ${move.status}`);
    }
    applyStatusAfterAction(attacker, attackerName);
  }

  function beginBattleFromEnemy(enemyEntity) {
    if (!enemyEntity || !state.mission) return;
    ensureStarterParty();
    const aliveId = firstAlivePartyPetId();
    if (!aliveId) {
      endMission(false);
      return;
    }
    state.encounterCounter += 1;
    const enemySpeciesId = enemyEntity.enemySpeciesId || state.mission.target.id;
    state.visual.battleImpactColor = null;
    state.visual.battleImpactBurst = 0;
    state.visual.battleImpactSide = "neutral";
    state.visual.battleImpactSeed = state.visual.battleImpactSeed || 0;
    state.visual.battleImpactSeverity = 1;
    state.battle = {
      active: true,
      encounterId: state.encounterCounter,
      sourceMissionEnemyId: enemyEntity.enemyId || null,
      sourceEnemyRef: enemyEntity,
      enemySpeciesId,
      enemyPet: createEnemyPet(enemySpeciesId, enemyEntity.enemyLevel || 1, state.encounterCounter * 173),
      playerPetId: aliveId,
      phase: "player_select",
      actingSide: "player",
      menu: {
        layer: "root",
        rootIndex: 0,
        moveIndex: 0,
        switchIndex: 0,
        captureArmed: false,
      },
      turn: 1,
      log: [`Wild ${speciesForId(enemySpeciesId).name} appeared`],
      captureUsedThisTurn: false,
      resolved: false,
      rngStep: 0,
    };
    state.mission.encounter.pendingEnemyId = enemyEntity.enemyId || null;
    setMode("battle");
    queueVfxPulse("battle", 0.42, { max: 1 });
    queueVfxPulse("camera", 0.26);
  }

  function enemyTurn() {
    if (!state.battle) return;
    const enemy = state.battle.enemyPet;
    const player = activePlayerPet();
    if (!enemy || !player || enemy.hp <= 0 || player.hp <= 0) return;
    const enemyName = speciesForId(enemy.speciesId).name;
    const playerName = speciesForId(player.speciesId).name;
    const moveIndex = Math.floor(battleRandom(44) * enemy.moves.length) % enemy.moves.length;
    applyMove(enemy, player, enemy.moves[moveIndex], enemyName, playerName);
  }

  function finishBattleToMission(success, capturedSpeciesId = null) {
    if (!state.battle || !state.mission) return;
    const battle = state.battle;
    if (success) {
      if (battle.sourceEnemyRef) {
        removeById(battle.sourceEnemyRef);
        if (state.objective.current) {
          state.objective.current.enemyCount = Math.max(0, state.objective.current.enemyCount - 1);
        }
      }
      state.mission.encounter.battlesWon += 1;
      state.mission.encounter.pendingEnemyId = null;
      if (capturedSpeciesId) {
        registerBattleCapture(capturedSpeciesId);
        state.messages = [`Captured ${speciesForId(capturedSpeciesId).name}`, "Return to mission"];
      } else {
        state.score += 2;
        state.messages = ["Battle won", "Return to mission"];
      }
      state.battle = null;
      setMode("mission");
      return;
    }
    state.mission.encounter.battlesLost += 1;
    state.mission.encounter.pendingEnemyId = null;
    state.battle = null;
    endMission(false);
  }

  function tryCaptureEnemy() {
    if (!state.battle) return;
    const enemy = state.battle.enemyPet;
    if (!enemy || enemy.hp <= 0) return;
    const hpRatio = enemy.hp / Math.max(1, enemy.maxHp);
    const rarityPenalty = speciesForId(enemy.speciesId).legendary ? 0.22 : 0;
    const chance = clamp(0.78 - hpRatio * 0.62 - rarityPenalty, 0.08, 0.9);
    appendBattleLog(`Capture chance ${Math.round(chance * 100)}%`);
    if (battleRandom(75) <= chance) {
      appendBattleLog("Capture locked");
      finishBattleToMission(true, enemy.speciesId);
      return;
    }
    appendBattleLog("Capture failed");
  }

  function updateBattle() {
    if (!state.battle) return;
    const battle = state.battle;
    const player = activePlayerPet();
    const enemy = battle.enemyPet;

    if (!player || !enemy) {
      finishBattleToMission(false);
      return;
    }
    if (enemy.hp <= 0) {
      finishBattleToMission(true, null);
      return;
    }
    if (alivePartyIds().length === 0) {
      finishBattleToMission(false);
      return;
    }
    if (player.hp <= 0 && alivePartyIds().length > 0) {
      battle.menu.layer = "switch";
      battle.menu.switchIndex = 0;
      appendBattleLog(`${speciesForId(player.speciesId).name} fainted`);
    }

    const switchChoices = alivePartyIds();
    const prevEdge = input.leftEdge || input.upEdge;
    const nextEdge = input.rightEdge || input.downEdge;
    if (battle.menu.layer === "root") {
      if (prevEdge) battle.menu.rootIndex = (battle.menu.rootIndex + BATTLE_ROOT_ACTIONS.length - 1) % BATTLE_ROOT_ACTIONS.length;
      if (nextEdge) battle.menu.rootIndex = (battle.menu.rootIndex + 1) % BATTLE_ROOT_ACTIONS.length;
      if (input.confirmEdge) {
        battle.phase = "player_select";
        battle.actingSide = "player";
        if (battle.menu.rootIndex === 0) {
          battle.menu.layer = "fight";
          battle.menu.moveIndex = 0;
        } else if (battle.menu.rootIndex === 1) {
          battle.menu.layer = "switch";
          battle.menu.switchIndex = 0;
        } else {
          battle.phase = "player_resolve";
          battle.actingSide = "player";
          tryCaptureEnemy();
          if (!state.battle) return;
          battle.phase = "enemy_resolve";
          battle.actingSide = "enemy";
          enemyTurn();
          battle.turn += 1;
        }
      }
      return;
    }

    if (battle.menu.layer === "fight") {
      const moves = player.moves;
      if (prevEdge) battle.menu.moveIndex = (battle.menu.moveIndex + moves.length - 1) % moves.length;
      if (nextEdge) battle.menu.moveIndex = (battle.menu.moveIndex + 1) % moves.length;
      if (input.cancelEdge) {
        battle.menu.layer = "root";
        return;
      }
      if (input.confirmEdge) {
        const moveId = moves[battle.menu.moveIndex];
        battle.phase = "player_resolve";
        battle.actingSide = "player";
        applyMove(player, enemy, moveId, speciesForId(player.speciesId).name, speciesForId(enemy.speciesId).name);
        if (enemy.hp <= 0) {
          finishBattleToMission(true, null);
          return;
        }
        battle.phase = "enemy_resolve";
        battle.actingSide = "enemy";
        enemyTurn();
        if (player.hp <= 0 && alivePartyIds().length <= 1) {
          finishBattleToMission(false);
          return;
        }
        battle.turn += 1;
        battle.menu.layer = player.hp <= 0 ? "switch" : "root";
      }
      return;
    }

    if (battle.menu.layer === "switch") {
      if (switchChoices.length === 0) {
        finishBattleToMission(false);
        return;
      }
      if (prevEdge) battle.menu.switchIndex = (battle.menu.switchIndex + switchChoices.length - 1) % switchChoices.length;
      if (nextEdge) battle.menu.switchIndex = (battle.menu.switchIndex + 1) % switchChoices.length;
      if (input.cancelEdge && player && player.hp > 0) {
        battle.menu.layer = "root";
        return;
      }
      if (input.confirmEdge) {
        battle.phase = "player_resolve";
        battle.actingSide = "player";
        battle.playerPetId = switchChoices[battle.menu.switchIndex];
        state.activePetId = battle.playerPetId;
        appendBattleLog(`Go ${speciesForId(activePlayerPet().speciesId).name}`);
        battle.phase = "enemy_resolve";
        battle.actingSide = "enemy";
        enemyTurn();
        if (activePlayerPet() && activePlayerPet().hp <= 0 && alivePartyIds().length <= 1) {
          finishBattleToMission(false);
          return;
        }
        battle.turn += 1;
        battle.menu.layer = "root";
      }
    }
  }

  function resetObjective() {
    state.objective.current = null;
    state.objective.capturedSpecies = {};
    state.objective.capturedCount = 0;
    state.objective.holdProgress = 0;
  }

  function resetGame() {
    state.player.x = SIM_W / 2;
    state.player.y = SIM_H / 2;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.hp = state.player.maxHp;
    state.player.invulnFrames = 0;
    state.player.shootCd = 0;
    state.player.knockbackX = 0;
    state.player.knockbackY = 0;
      state.player.damageStreak = 0;
      state.player.damageDecay = 0;
    state.hubs = generateHub(state.seed);
    state.selectedPlanet = null;
    state.entities = [];
    state.mission = null;
    state.battle = null;
    state.petDex = {};
    state.party = [];
    state.storage = [];
    state.activePetId = null;
    state.petCounter = 0;
    state.encounterCounter = 0;
    state.score = 0;
    state.completedPlanets = 0;
    state.messages = [];
    state.planetLockId = null;
    state.planetLockTimer = 0;
    state.ui.helpVisible = true;
    state.ui.helpPinned = false;
    state.ui.autoHelpUntilFrame = state.frame + TARGET_FPS * 5;
    state.ui.firstMissionHelpShown = false;
    state.visual.accentLead = SCENE_RECIPES.title.accentLead;
    state.visual.contrastMode = SCENE_RECIPES.title.contrastMode;
    state.visual.fxProfile = VISUAL_PIPELINE.vfxProfiles.title;
    state.visual.fxFrame = 0;
    state.visual.routePulsePhase = 0;
    state.visual.hubPulseOffset = 0;
    state.visual.battleImpactBurst = 0;
    state.visual.battleImpactSide = "neutral";
    state.visual.battleImpactColor = null;
    state.visual.battleImpactSeed = 0;
    state.visual.battleImpactSeverity = 1;
    if (state.visual.vfxPulse) {
      state.visual.vfxPulse.transition = 0;
      state.visual.vfxPulse.modeShift = 0;
      state.visual.vfxPulse.battle = 0;
      state.visual.vfxPulse.ambient = 0;
      state.visual.vfxPulse.split = 0;
      state.visual.vfxPulse.camera = 0;
    }
    resetObjective();
    ensureStarterParty();
  }

  function setMode(nextMode, options = {}) {
    const mode = nextMode || "title";
    if (options.transition !== false) {
      startModeTransition(mode, {
        durationFrames: Number.isFinite(options.transitionDurationFrames)
          ? options.transitionDurationFrames
          : TARGET_FPS * 0.22,
      });
      queueVfxPulse("modeShift", 0.36);
      queueVfxPulse("transition", 0.45);
    }
    state.mode = mode;
    if (mode !== "battle" && state.visual) {
      state.visual.battleImpactBurst = 0;
      state.visual.battleImpactSide = "neutral";
      state.visual.battleImpactColor = null;
      state.visual.battleImpactSeed = state.visual.battleImpactSeed || 0;
      state.visual.battleImpactSeverity = 1;
    }
    state.visual.accentLead = pickAccentLead(nextMode, state.mission, state.seed);
    state.visual.fxProfile = VISUAL_PIPELINE.vfxProfiles[nextMode] || VISUAL_PIPELINE.vfxProfiles.title;
    state.visual.contrastMode = (SCENE_RECIPES[nextMode] && SCENE_RECIPES[nextMode].contrastMode) || "light";
    state.flash = 0;
    state.hubEnter = state.frame;
    transition.timer = 0;
    transition.duration = 0;
    transition.targetMode = null;
    startBtn.style.display = nextMode === "title" ? "block" : "none";
    if (nextMode === "title") {
      state.messages = ["NET_TOKENS_GAME", "Awaiting launch"];
      state.ui.helpVisible = true;
      state.ui.autoHelpUntilFrame = state.frame + TARGET_FPS * 5;
    }
  }

  function startMission(planet) {
    state.selectedPlanet = planet;
    state.planetLockId = null;
    state.planetLockTimer = 0;
    const mission = makeMission(planet);
    state.mission = mission;
    state.entities = mission.entities.slice();
    ensureStarterParty();
    for (const petId of state.party) {
      const pet = petById(petId);
      if (pet) {
        pet.hp = pet.maxHp;
        pet.status = "none";
      }
    }
    state.activePetId = firstAlivePartyPetId();
    state.objective.current = {
      targetName: mission.target.name,
      targetId: mission.target.id,
      task: mission.task.id,
      taskText: mission.task.text,
      captured: 0,
      targetCaptured: 0,
      targetRequired: mission.task.id === "collect" ? mission.task.targetValue : 1,
      enemyCount: mission.enemyTarget,
      done: false,
      taskDone: false,
    };
    state.objective.capturedSpecies = {};
    state.objective.capturedCount = 0;
    state.objective.holdProgress = 0;
    state.battle = null;
    setMode("mission", {
      transitionDurationFrames: TARGET_FPS * 0.2,
    });
    state.player.x = SIM_W / 2;
    state.player.y = SIM_H - 38;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.knockbackX = 0;
    state.player.knockbackY = 0;
      state.player.damageStreak = 0;
      state.player.damageDecay = 0;
    state.player.hp = state.player.maxHp;
    state.flash = 4;
    state.visual.accentLead = pickAccentLead(state.mode, state.mission, state.seed);
    state.messages = [
      `Mission @ ${planet.name}`,
      `Collect: ${mission.target.name}`,
      `Task: ${mission.task.text}`,
    ];
    if (!state.ui.firstMissionHelpShown) {
      state.ui.firstMissionHelpShown = true;
      state.ui.helpVisible = true;
      state.ui.autoHelpUntilFrame = state.frame + TARGET_FPS * 5;
    }
    queueVfxPulse("ambient", 0.45, { max: 0.9 });
    queueVfxPulse("split", 0.2);
    queueVfxPulse("modeShift", 0.22);
  }

  function endMission(success) {
    if (state.mission) state.mission.done = true;
    state.battle = null;
    if (success) {
      state.score += 1 + state.objective.capturedCount;
      state.completedPlanets += 1;
      state.messages = [
        "Mission complete",
        `+${state.objective.capturedCount} captures`,
        `Score ${state.score}`,
      ];
    } else {
      state.messages = ["Mission failed", "Return to ship"];
    }
    setMode("result", {
      transitionDurationFrames: TARGET_FPS * 0.16,
    });
    state.flash = 2;
    queueVfxPulse("ambient", 0.32, { max: 0.8 });
    queueVfxPulse("split", 0.22);
    transition.timer = TARGET_FPS * 2;
    transition.duration = TARGET_FPS * 2;
    transition.targetMode = "hub";
  }

  function removeById(idToRemove) {
    state.entities = state.entities.filter((entity) => entity !== idToRemove);
  }

  function handlePlayerMovement(dt) {
    const accel = 220;
    const friction = 0.85;
    state.player.vx += state.player.knockbackX * 2.2;
    state.player.vy += state.player.knockbackY * 2.2;
    state.player.knockbackX *= 0.86;
    state.player.knockbackY *= 0.86;
    state.player.vx *= friction;
    state.player.vy *= friction;
    if (input.left) state.player.vx -= accel * dt;
    if (input.right) state.player.vx += accel * dt;
    if (input.up) state.player.vy -= accel * dt;
    if (input.down) state.player.vy += accel * dt;

    const mag = Math.sqrt(state.player.vx * state.player.vx + state.player.vy * state.player.vy);
    const maxVel = state.player.speed;
    if (mag > maxVel) {
      const scale = maxVel / mag;
      state.player.vx *= scale;
      state.player.vy *= scale;
    }

    state.player.x = clamp(state.player.x + state.player.vx * dt, VIEW_MARGIN, SIM_W - VIEW_MARGIN - state.player.r * 2);
    state.player.y = clamp(state.player.y + state.player.vy * dt, VIEW_MARGIN, SIM_H - VIEW_MARGIN - state.player.r * 2);

    if (state.player.invulnFrames > 0) state.player.invulnFrames -= 1;
    if (state.player.shootCd > 0) state.player.shootCd -= 1;
    if (state.player.damageDecay > 0) state.player.damageDecay -= 1;
    if (state.player.damageDecay <= 0) state.player.damageStreak = 0;
  }

  function spawnQueuedEnemy() {
    if (!state.mission || !state.mission.enemyQueue || state.mission.enemyQueue.length === 0) return false;
    const enemyData = state.mission.enemyQueue.shift();
    const spawned = enemyTemplateToEntities([enemyData])[0];
    state.entities.push(spawned);
    state.messages = ["Hostile incursion"];
    return true;
  }

  function ensureTargetEncounterAvailable() {
    if (!state.mission || !state.objective.current) return;
    if (state.objective.current.targetCaptured >= state.objective.current.targetRequired) return;
    const targetId = state.objective.current.targetId;
    const activeHasTarget = state.entities.some((entity) => entity.kind === "enemy" && entity.enemySpeciesId === targetId);
    const queuedHasTarget = state.mission.enemyQueue.some((entity) => entity.enemySpeciesId === targetId);
    if (activeHasTarget || queuedHasTarget) return;
    state.mission.enemyQueue.push({
      kind: "enemy",
      enemyId: `${state.selectedPlanet ? state.selectedPlanet.id : "planet"}-target-${state.frame}`,
      enemySpeciesId: targetId,
      enemyLevel: 1 + Math.floor(state.completedPlanets / 2),
      x: 36 + rand() * (SIM_W - 72),
      y: 28 + rand() * (SIM_H - 68),
      r: 3,
      hp: 2,
      speed: 8 + rand() * 4,
      dx: (rand() - 0.5) * 12,
      dy: (rand() - 0.5) * 12,
    });
    state.objective.current.enemyCount += 1;
    state.messages = ["Target signal detected"];
  }

  function maybeCollectTarget(entity) {
    if (!entity || entity.kind !== "alien" || entity.captured) return;
    if (!state.objective.current || !input.spaceEdge) return;
    if (dist2(state.player, entity) > (state.player.r + entity.r + 2) ** 2) return;

    const speciesId = entity.species && entity.species.id ? entity.species.id : null;
    if (!speciesId) return;

    entity.captured = true;
    registerBattleCapture(speciesId);
    state.messages = [`Captured ${speciesForId(speciesId).name}`, "Specimen added"];
    state.entities = state.entities.filter((activeEntity) => activeEntity !== entity);
  }

  function updateMission(dt) {
    if (!state.mission || !state.objective.current) return;
    state.flash = Math.max(0, state.flash - dt);
    const task = state.mission.task.id;
    ensureTargetEncounterAvailable();

    if (task === "hold_sector" && state.mission.holdSector) {
      const nearHold = dist2(state.player, state.mission.holdSector) < (state.mission.holdSector.r + state.player.r + 1) ** 2;
      if (nearHold) {
        state.objective.holdProgress = clamp(state.objective.holdProgress + dt * 30, 0, state.mission.task.targetValue);
      } else {
        state.objective.holdProgress = clamp(state.objective.holdProgress - dt * 15, 0, state.mission.task.targetValue);
      }
    }

    if (state.mission.enemyQueue && state.mission.enemyQueue.length > 0) {
      state.mission.enemySpawnTimer = Math.max(0, state.mission.enemySpawnTimer - 1);
      if (state.mission.enemySpawnTimer <= 0) {
        if (spawnQueuedEnemy()) {
          state.mission.enemySpawnTimer = state.mission.enemySpawnCadence;
        }
      }
    }

    for (const entity of state.entities.slice()) {
      if (entity.kind === "alien") {
        entity.orbit += dt * 1.5;
        entity.x += entity.dx * dt;
        entity.y += entity.dy * dt;
        if (entity.x < 4 || entity.x > SIM_W - 4) entity.dx *= -1;
        if (entity.y < 4 || entity.y > SIM_H - 4) entity.dy *= -1;
        maybeCollectTarget(entity);
      }

      if (entity.kind === "enemy") {
        const tx = state.player.x - entity.x;
        const ty = state.player.y - entity.y;
        const d = Math.sqrt(tx * tx + ty * ty) || 1;
        const chase = Math.min(1, entity.aggression);
        entity.vx = (entity.vx || entity.speed) * 0.74 + ((tx / d) * entity.speed * chase * 0.26);
        entity.vy = (entity.vy || entity.speed) * 0.74 + ((ty / d) * entity.speed * chase * 0.26);
        entity.x += entity.vx * dt;
        entity.y += entity.vy * dt;
        entity.vx *= 0.92;
        entity.vy *= 0.92;
        if (entity.vx === 0 && entity.vy === 0) {
          entity.vx = (rand() - 0.5) * 8;
          entity.vy = (rand() - 0.5) * 8;
        }
        if (dist2(state.player, entity) < (state.player.r + entity.r + 1) ** 2) {
          beginBattleFromEnemy(entity);
          return;
        }
      }

      if (entity.kind === "beacon") {
        if (!entity.activated && input.space && dist2(state.player, entity) < (state.player.r + entity.r + 2) ** 2) {
          entity.activated = true;
          state.messages = ["Beacon charged"];
        }
      }

      if (entity.kind === "probe") {
        if (!entity.attached) {
          const speed = 10;
          const dx = state.player.x - entity.x;
          const dy = state.player.y - entity.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          entity.x += (dx / d) * speed * dt;
          entity.y += (dy / d) * speed * dt;
          if (dist2(state.player, entity) < (state.player.r + entity.r + 2) ** 2) {
            entity.attached = true;
          }
        } else {
          entity.x = state.player.x + 4;
          entity.y = state.player.y - 6;
        }
      }
    }

    const taskClear = state.mission.task;
    const targetDone = state.objective.current.targetCaptured >= state.objective.current.targetRequired;
    let taskDone = false;

    if (taskClear.id === "collect") {
      taskDone = targetDone;
    } else if (taskClear.id === "clear_wave") {
      taskDone = state.objective.current.enemyCount <= 0;
    } else if (taskClear.id === "hold_sector") {
      taskDone = state.objective.holdProgress >= state.mission.task.targetValue;
    } else if (taskClear.id === "activate_beacon") {
      const beacon = state.entities.find((e) => e.kind === "beacon");
      taskDone = !!(beacon && beacon.activated);
    } else if (taskClear.id === "escort_probe") {
      const probe = state.entities.find((e) => e.kind === "probe");
      const zone = state.mission.extractionZone;
      taskDone = !!(
        probe &&
        probe.attached &&
        zone &&
        dist2(state.player, zone) <= (state.player.r + zone.r + 1) ** 2
      );
    }

    state.objective.current.taskDone = taskDone;
    if (targetDone && taskDone && state.objective.current.done !== true) {
      state.objective.current.done = true;
      endMission(true);
    }
  }

  function updateHub(dt) {
    const nearbyPlanet = state.hubs.find((planet) => dist2(state.player, planet) < (planet.r + 8) ** 2);

    if (state.planetLockTimer > 0) {
      if (!nearbyPlanet || nearbyPlanet.id !== state.planetLockId) {
        state.planetLockTimer = 0;
        state.messages = ["Dock lock lost", "Hold near planet"];
      } else {
        state.planetLockTimer -= 1;
        if (state.planetLockTimer <= 0) {
          startMission(nearbyPlanet);
          return;
        }
      }
    }

    state.planetLockId = nearbyPlanet ? nearbyPlanet.id : null;
    if (input.spaceEdge && nearbyPlanet && state.planetLockTimer <= 0) {
      state.planetLockId = nearbyPlanet.id;
      state.planetLockTimer = 18;
      state.messages = [`Dock lock: ${nearbyPlanet.name}`, `Launch in ${state.planetLockTimer}`];
      input.spaceEdge = false;
    }
  }

  function maybeTransitionToHub(dt) {
    if (state.mode !== "result") return;
    if (transition.timer > 0) {
      transition.timer -= 1;
      return;
    }
    if (transition.targetMode) {
      const targetMode = transition.targetMode;
      transition.targetMode = null;
      if (targetMode === "hub") {
        setMode(targetMode, {
          transitionDurationFrames: TARGET_FPS * 0.24,
        });
        resetObjective();
        state.entities = [];
        state.mission = null;
        state.battle = null;
        state.player.x = SIM_W / 2;
        state.player.y = SIM_H / 2;
        state.planetLockId = null;
        state.planetLockTimer = 0;
        state.messages = ["Back at ship", "Dock at new node"];
      }
    }
  }

  function drawPanel(x, y, w, h, options = {}) {
    const tone = sceneTone(state.mode);
    const fillColor = options.fill || tone.panelFill;
    const borderColor = options.border || options.edge || tone.edge;
    const radius = options.radius || 0;
    if (radius <= 1) {
      sceneCtx.fillStyle = fillColor;
      sceneCtx.fillRect(x, y, w, h);
      sceneCtx.strokeStyle = borderColor;
      sceneCtx.lineWidth = 1;
      sceneCtx.strokeRect(x, y, w, h);
      return;
    }

    sceneCtx.beginPath();
    sceneCtx.moveTo(x + radius, y);
    sceneCtx.lineTo(x + w - radius, y);
    sceneCtx.quadraticCurveTo(x + w, y, x + w, y + radius);
    sceneCtx.lineTo(x + w, y + h - radius);
    sceneCtx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    sceneCtx.lineTo(x + radius, y + h);
    sceneCtx.quadraticCurveTo(x, y + h, x, y + h - radius);
    sceneCtx.lineTo(x, y + radius);
    sceneCtx.quadraticCurveTo(x, y, x + radius, y);
    sceneCtx.closePath();
    sceneCtx.fillStyle = fillColor;
    sceneCtx.fill();
    sceneCtx.strokeStyle = borderColor;
    sceneCtx.lineWidth = 1;
    sceneCtx.stroke();
  }

  function drawWorldScene() {
    const tone = sceneTone(state.mode);
    const renderPolicy = resolveVisualPolicy();
    sceneCtx.setTransform(INTERNAL_RENDER_SCALE, 0, 0, INTERNAL_RENDER_SCALE, 0, 0);
    sceneCtx.imageSmoothingEnabled = renderPolicy === "smooth";
    sceneCtx.imageSmoothingQuality = renderPolicy === "smooth" ? "high" : "low";
    sceneCtx.clearRect(0, 0, SIM_W, SIM_H);
    sceneCtx.fillStyle = tone.surface;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);

    const subtleWash = sceneCtx.createRadialGradient(
      SIM_W * 0.72,
      SIM_H * 0.28,
      10,
      SIM_W * 0.72,
      SIM_H * 0.28,
      SIM_W * 0.9,
    );
    subtleWash.addColorStop(0, withAlpha(tone.subtle, 0.04));
    subtleWash.addColorStop(1, withAlpha(tone.subtle, 0));
    sceneCtx.fillStyle = subtleWash;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);
    sceneCtx.font = "7px Sora, sans-serif";
    drawModeScene(state.mode);
  }

  function drawModeScene(mode) {
    if (mode === "title") drawTitle();
    else if (mode === "hub") drawHub();
    else if (mode === "mission") drawMission();
    else if (mode === "battle") drawBattle();
    else if (mode === "result") drawResult();
    else drawTitle();
  }

  function drawTitle() {
    const accent = accentColor();
    const tone = sceneTone("title");
    sceneCtx.fillStyle = tone.surface;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);
    drawPanel(16, 16, SIM_W - 32, SIM_H - 32);
    sceneCtx.fillStyle = tone.edge;
    sceneCtx.fillRect(16, 16, SIM_W - 32, 4);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "700 18px Sora, sans-serif";
    sceneCtx.fillText("NET_TOKENS_GAME", 96, 44);
    sceneCtx.font = "700 11px Sora, sans-serif";
    sceneCtx.fillText("Proof-first mission deck", 100, 64);
    sceneCtx.fillStyle = tone.lead;
    sceneCtx.fillText("Capture a target species and complete the objective.", 54, 88);
    sceneCtx.font = "8px Sora, sans-serif";
    sceneCtx.fillText(`Seed ${state.seed}`, 24, 160);
    sceneCtx.fillStyle = tone.lead;
    sceneCtx.fillRect(26, 158, Math.max(8, (state.frame % 180) / 9), 2);
  }

  function drawHubRouteMesh({ tone, boardX, boardY, boardW, boardH, orderedPlanets }) {
    const pulse = (state.visual.routePulsePhase * Math.PI * 2 + Math.sin(state.frame * 0.12)) % 1;
    const lineW = boardW - 14;
    const lineH = boardH - 14;
    for (let y = 0; y <= 5; y += 1) {
      const t = (pulse + y * 0.2) % 1;
      const railY = boardY + 10 + y * (lineH / 5) + Math.sin(t * Math.PI * 4) * 1.5;
      sceneCtx.strokeStyle = withAlpha(tone.subtle, 0.08 + y * 0.006);
      sceneCtx.lineWidth = y % 2 === 0 ? 0.46 : 0.28;
      sceneCtx.beginPath();
      sceneCtx.moveTo(boardX + 10 + Math.sin(t * 2) * 1.8, railY);
      sceneCtx.lineTo(boardX + boardW - 10 + Math.sin((t + 0.5) * 2) * 1.8, railY);
      sceneCtx.stroke();
    }

    for (let x = 0; x <= 8; x += 1) {
      const t = (pulse + x * 0.28) % 1;
      const railX = boardX + 10 + x * (lineW / 8) + Math.cos(t * Math.PI * 3) * 1.1;
      sceneCtx.strokeStyle = withAlpha(tone.subtle, 0.055 + x * 0.004);
      sceneCtx.lineWidth = x % 2 === 0 ? 0.37 : 0.25;
      sceneCtx.beginPath();
      sceneCtx.moveTo(railX, boardY + 10);
      sceneCtx.lineTo(railX, boardY + boardH - 10);
      sceneCtx.stroke();
    }

    if (orderedPlanets.length > 1) {
      for (let i = 0; i < orderedPlanets.length; i += 1) {
        const current = orderedPlanets[i];
        const next = orderedPlanets[(i + 1) % orderedPlanets.length];
        const t = (pulse * 0.8 + (i * 0.17)) % 1;
        const bx = current.x + (next.x - current.x) * t + (Math.sin(state.frame * 0.05 + i) * 0.4);
        const by = current.y + (next.y - current.y) * t + (Math.cos(state.frame * 0.07 + i) * 0.4);
        sceneCtx.fillStyle = withAlpha(tone.accentPulse, 0.3);
        sceneCtx.fillRect(bx, by, 1.3, 1.3);
      }
    }
  }

  function drawHubPlanetNode({ planet, palette, isFocused, isLocked, pulse }) {
    const spriteSize = Math.max(38, planet.r * 4.6) * VISUAL_PLANET_SCALE;
    const lockGlow = isFocused || isLocked ? 0.24 : 0.12;
    sceneCtx.save();
    sceneCtx.shadowBlur = isFocused || isLocked ? 9 : 4;
    sceneCtx.shadowColor = withAlpha(palette.secondary, 0.28);
    sceneCtx.fillStyle = withAlpha(palette.surface, lockGlow);
    sceneCtx.beginPath();
    sceneCtx.arc(planet.x, planet.y, spriteSize * 0.52, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.shadowBlur = 0;

    const drawn = drawSpriteByKey(
      "planet",
      planet.x,
      planet.y,
      spriteSize,
      () => {
        const pulseSize = spriteSize * 0.58 * (0.85 + pulse * 0.16);
        sceneCtx.fillStyle = withAlpha(palette.lead, isLocked ? 0.18 : 0.08);
        sceneCtx.beginPath();
        sceneCtx.arc(planet.x, planet.y, pulseSize * (isFocused ? 0.55 : 0.46), 0, Math.PI * 2);
        sceneCtx.fill();
        sceneCtx.strokeStyle = isLocked ? withAlpha(palette.accentPulse, 0.72) : withAlpha(palette.edge, 0.28);
        sceneCtx.lineWidth = isLocked ? 1.3 : 1;
        sceneCtx.beginPath();
        sceneCtx.arc(planet.x, planet.y, pulseSize * (isFocused ? 0.58 : 0.5), 0, Math.PI * 2);
        sceneCtx.stroke();
      },
      {
        motionX: 0,
        motionY: 0,
        glowColor: palette.secondary,
        glowAlpha: isFocused || isLocked ? 0.07 : 0.03,
      },
    );

    if (drawn && isFocused) {
      sceneCtx.strokeStyle = withAlpha(palette.accentPulse, 0.55);
      sceneCtx.lineWidth = 1;
      sceneCtx.beginPath();
      sceneCtx.arc(planet.x, planet.y, spriteSize * 0.58, 0, Math.PI * 2);
      sceneCtx.stroke();
    }
    sceneCtx.restore();
  }

  function drawHubShipGlyph({ shipX, shipY, palette, pulse }) {
    const shipSize = 42 + pulse * 2;
    const drew = drawSpriteByKey(
      "ship",
      shipX,
      shipY,
      shipSize,
      () => {
        sceneCtx.fillStyle = withAlpha(palette.surface, 0.15);
        sceneCtx.beginPath();
        sceneCtx.arc(shipX, shipY + 0.7, 9.2 * (0.9 + pulse * 0.14), 0, Math.PI * 2);
        sceneCtx.fill();
        sceneCtx.strokeStyle = withAlpha(palette.edge, 0.66);
        sceneCtx.lineWidth = 1;
        sceneCtx.beginPath();
        sceneCtx.arc(shipX, shipY + 0.7, 9.2 * (0.9 + pulse * 0.14), 0, Math.PI * 2);
        sceneCtx.stroke();
      },
      {
        motionX: 0,
        motionY: 0,
        glowColor: palette.secondary,
        glowAlpha: 0.05,
      },
    );
    if (drew) {
      sceneCtx.fillStyle = withAlpha(palette.lead, 0.22);
      sceneCtx.beginPath();
      sceneCtx.arc(shipX, shipY, shipSize * 0.06 * (0.9 + pulse), 0, Math.PI * 2);
      sceneCtx.fill();
    }
  }

  function drawHub() {
    const tone = sceneTone("hub");
    const palette = paletteForMode("hub");
    const orderedPlanets = orderHubPlanets(state.hubs);
    const focused =
      orderedPlanets.find((planet) => dist2(state.player, planet) < (planet.r + 10) ** 2) ||
      (state.planetLockId ? orderedPlanets.find((planet) => planet.id === state.planetLockId) : null);
    const pulse = 0.8 + Math.sin(state.frame * 0.09) * 0.2;
    const routeFlow = (state.frame * 0.016) % 1;
    const shipX = SIM_W / 2;
    const shipY = SIM_H / 2;
    const boardX = 10;
    const boardY = 10;
    const boardW = SIM_W - boardX * 2;
    const boardH = SIM_H - boardY * 2;
    const boardCenterX = boardX + boardW / 2;
    const boardCenterY = boardY + boardH / 2;

    sceneCtx.fillStyle = palette.surface;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);
    drawPanel(boardX, boardY, boardW, boardH, { fill: palette.panelFill, edge: palette.panelEdge, radius: 2 });
    sceneCtx.fillStyle = withAlpha(palette.surface, 0.98);
    sceneCtx.fillRect(boardX + 2, boardY + 2, boardW - 4, boardH - 4);
    drawHubRouteMesh({
      tone,
      boardX,
      boardY,
      boardW,
      boardH,
      orderedPlanets,
    });

    const driftA = Math.floor(state.frame * 0.16) % 6;
    for (let i = 0; i <= 10; i += 1) {
      const y = boardY + 10 + i * 18;
      const band = 0.07 + (i % 2) * 0.01;
      sceneCtx.strokeStyle = withAlpha(palette.subtle, band * 0.92);
      sceneCtx.lineWidth = i % 2 === 0 ? 0.42 : 0.26;
      sceneCtx.beginPath();
      sceneCtx.moveTo(boardX + 8 + driftA, y);
      sceneCtx.lineTo(boardX + boardW - 8 - driftA, y);
      sceneCtx.stroke();
    }
    for (let i = 0; i <= 6; i += 1) {
      const x = boardX + 8 + i * ((boardW - 16) / 6);
      sceneCtx.strokeStyle = withAlpha(palette.subtle, 0.08 + (i % 2) * 0.01);
      sceneCtx.lineWidth = i % 2 === 0 ? 0.36 : 0.2;
      sceneCtx.beginPath();
      sceneCtx.moveTo(x, boardY + 9);
      sceneCtx.lineTo(x, boardY + boardH - 9);
      sceneCtx.stroke();
    }
    sceneCtx.strokeStyle = withAlpha(palette.secondary, 0.18);
    sceneCtx.lineWidth = 1;
    sceneCtx.beginPath();
    sceneCtx.moveTo(boardX + 12, boardY + boardH * 0.64);
    sceneCtx.lineTo(boardX + boardW - 12, boardY + boardH * 0.64);
    sceneCtx.stroke();
    sceneCtx.beginPath();
    sceneCtx.moveTo(boardX + boardW * 0.51, boardY + 12);
    sceneCtx.lineTo(boardX + boardW * 0.51, boardY + boardH - 12);
    sceneCtx.stroke();
    sceneCtx.fillStyle = withAlpha(palette.secondary, 0.14);
    sceneCtx.fillRect(boardCenterX - 1.6, boardY + 7, 3.2, boardH - 14);

    const cardPulse = 0.7 + Math.sin(state.frame * 0.09) * 0.17;
    const headerW = 140;
    const headerH = 16;
    drawPanel(boardX + 8, boardY + 8, headerW, headerH, {
      fill: withAlpha(palette.panelFill, 0.96),
      edge: palette.secondary,
      radius: 1,
    });
    sceneCtx.fillStyle = palette.text;
    sceneCtx.font = "700 7px Sora, sans-serif";
    sceneCtx.fillText("ASTRO DOCK COMMAND", boardX + 12, boardY + 18);
    sceneCtx.font = "6px Sora, sans-serif";
    sceneCtx.fillStyle = withAlpha(palette.text, 0.68);
    sceneCtx.fillText(`Seed ${state.seed}`, boardX + 110, boardY + 18);

    const routeColor = palette.lead;
    for (let i = 0; i < orderedPlanets.length; i += 1) {
      const current = orderedPlanets[i];
      const next = orderedPlanets[(i + 1) % orderedPlanets.length];
      const activeFlow = Math.abs(dist2(state.player, next)) < Math.pow(next.r + 17, 2) ? 1 : 0;
      const baseAlpha = 0.16 + activeFlow * 0.16;
      sceneCtx.lineWidth = activeFlow ? 2.1 : 1.6;
      sceneCtx.strokeStyle = withAlpha(routeColor, baseAlpha);
      sceneCtx.beginPath();
      sceneCtx.moveTo(current.x, current.y);
      sceneCtx.lineTo(next.x, next.y);
      sceneCtx.stroke();

      for (let k = 0; k < 2; k += 1) {
        const t = (routeFlow + k / 2) % 1;
        const mx = current.x + (next.x - current.x) * t;
        const my = current.y + (next.y - current.y) * t;
        const flick = ((state.frame * 0.2 + k * 1.5) % 3) < 1.35 ? 1 : 0.45;
        sceneCtx.fillStyle = withAlpha(routeColor, (baseAlpha + 0.08) * flick);
        sceneCtx.fillRect(mx - 0.5, my - 0.5, 1, 1);
      }
    }

    const orbitPulse = 1 + Math.sin(state.frame * 0.11) * 0.2;
    for (let i = 0; i < 2; i += 1) {
      sceneCtx.strokeStyle = withAlpha(palette.lead, 0.08 + i * 0.05);
      sceneCtx.lineWidth = 1;
      sceneCtx.beginPath();
      sceneCtx.arc(shipX, shipY, 11 + i * 9, 0, Math.PI * 2);
      sceneCtx.stroke();
    }
    sceneCtx.fillStyle = withAlpha(palette.accentPulse, 0.16);
    sceneCtx.beginPath();
    sceneCtx.arc(shipX, shipY, 4 * cardPulse, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.fillStyle = withAlpha(palette.subtle, 0.16);
    sceneCtx.fillRect(shipX - 1, shipY - 1, 2, 2);

    for (const planet of orderedPlanets) {
      const isLocked = state.planetLockId === planet.id;
      const isFocused = focused && focused.id === planet.id;

      drawHubPlanetNode({
        planet,
        palette,
        isFocused,
        isLocked,
        pulse,
      });

      sceneCtx.fillStyle = withAlpha(palette.lead, isFocused || isLocked ? 0.28 : 0.16);
      sceneCtx.beginPath();
      sceneCtx.arc(planet.x, planet.y, planet.r + 4.5 * (pulse * orbitPulse), 0, Math.PI * 2);
      sceneCtx.fill();

      sceneCtx.strokeStyle = isFocused || isLocked ? palette.edge : palette.lead;
      sceneCtx.lineWidth = isFocused || isLocked ? 2 : 1.2;
      sceneCtx.beginPath();
      sceneCtx.arc(planet.x, planet.y, planet.r + 4.7, 0, Math.PI * 2);
      sceneCtx.stroke();

      if (isFocused || isLocked) {
        const lockText = isLocked && state.planetLockTimer > 0 ? ` · ${state.planetLockTimer}` : "";
        const label = `${planet.name}${lockText}`;
        const labelW = clamp(Math.floor(20 + label.length * 3.4), 32, 118);
        const labelX = clamp(Math.floor(planet.x + 8), boardX + 6, boardX + boardW - labelW - 6);
        const labelY = clamp(Math.floor(planet.y - 18), boardY + 6, boardY + boardH - 16);
        drawPanel(labelX, labelY, labelW, 12, {
          fill: withAlpha(palette.panelFill, 0.9),
          edge: isLocked ? palette.secondary : palette.edge,
          radius: 1,
        });
        sceneCtx.fillStyle = isLocked ? palette.lead : palette.text;
        sceneCtx.font = "600 6px Sora, sans-serif";
        sceneCtx.fillText(label, labelX + 3, labelY + 8);
      }
    }

    drawPanel(14, 14, 140, 82, { fill: withAlpha(palette.panelFill, 0.92), edge: palette.panelEdge, radius: 1 });
    sceneCtx.fillStyle = toneTextShade(palette.text);
    sceneCtx.font = "700 8px Sora, sans-serif";
    sceneCtx.fillText("Route Board", 22, 24);
    sceneCtx.font = "7px Sora, sans-serif";
    if (focused) {
      const preview = makePlanetPreview(focused);
      sceneCtx.fillStyle = withAlpha(palette.text, 0.82);
      sceneCtx.fillText(`Target: ${focused.name}`, 20, 37);
      sceneCtx.fillText(`Biome: ${focused.biome}`, 20, 45);
      sceneCtx.fillText(`Mission: ${preview.taskText}`, 20, 53);
      sceneCtx.fillText(`Specimen: ${preview.targetName}`, 20, 61);
      sceneCtx.fillStyle = palette.lead;
      sceneCtx.fillText(`${state.planetLockId ? "Ready to launch" : "Hold for lock"}`, 20, 70);
    } else {
      sceneCtx.fillStyle = palette.text;
      sceneCtx.fillText("Docking rails active", 20, 37);
      sceneCtx.fillText("Scanline field holding steady", 20, 50);
      sceneCtx.fillText("Crew deck sync: active", 20, 61);
      sceneCtx.fillText("Awaiting alignment lock", 20, 70);
    }

    drawPanel(SIM_W - 126, 14, 112, 82, { fill: withAlpha(palette.panelFill, 0.92), edge: palette.panelEdge, radius: 1 });
    sceneCtx.fillStyle = palette.text;
    sceneCtx.font = "700 8px Sora, sans-serif";
    sceneCtx.fillText("Crew Deck", SIM_W - 117, 24);
    sceneCtx.font = "7px Sora, sans-serif";
    sceneCtx.fillText(`Captured: ${Object.keys(state.objective.capturedSpecies).length}`, SIM_W - 120, 36);
    sceneCtx.fillText(`Party: ${state.party.length}`, SIM_W - 120, 44);
    sceneCtx.fillText(`Ready: ${state.party.length}`, SIM_W - 120, 52);
    sceneCtx.fillStyle = toneTextShade(palette.text);
    sceneCtx.fillText(`Seed ${state.seed}`, SIM_W - 120, 60);

    drawHubShipGlyph({ shipX, shipY, palette, pulse });
    sceneCtx.fillStyle = withAlpha(palette.panelFill, 0.2);
    sceneCtx.fillRect(shipX - 9, shipY - 12, 18, 3);

    sceneCtx.fillStyle = withAlpha(palette.lead, 0.42);
    sceneCtx.beginPath();
    sceneCtx.arc(shipX, shipY, 2.2 * pulse, 0, Math.PI * 2);
    sceneCtx.fill();

    drawPlayer();
    drawHud();
  }

  function drawMission() {
    const tone = sceneTone("mission");
    const accent = tone.lead;
    const drift = state.frame * 0.12;
    sceneCtx.fillStyle = tone.surface;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);
    drawPanel(6, 6, SIM_W - 12, SIM_H - 12);
    sceneCtx.fillStyle = tone.edge;
    sceneCtx.fillRect(6, 6, SIM_W - 12, 3);

    sceneCtx.strokeStyle = withAlpha(accent, 0.2);
    sceneCtx.lineWidth = 0.4;
    for (let i = 0; i < 7; i += 1) {
      const y = 12 + ((i * 39 + drift) % (SIM_H - 24));
      sceneCtx.beginPath();
      sceneCtx.moveTo(12, y);
      sceneCtx.lineTo(SIM_W - 12, y);
      sceneCtx.stroke();
    }

    if (state.mission?.holdSector) {
      sceneCtx.fillStyle = withAlpha(tone.lead, 0.23);
      sceneCtx.beginPath();
      sceneCtx.arc(state.mission.holdSector.x, state.mission.holdSector.y, state.mission.holdSector.r, 0, Math.PI * 2);
      sceneCtx.fill();
      sceneCtx.strokeStyle = tone.text;
      sceneCtx.lineWidth = 1;
      sceneCtx.stroke();
    }

    if (state.mission?.extractionZone) {
      const zone = state.mission.extractionZone;
      sceneCtx.strokeStyle = tone.lead;
      sceneCtx.lineWidth = 1;
      sceneCtx.setLineDash([2, 1]);
      sceneCtx.beginPath();
      sceneCtx.arc(zone.x, zone.y, zone.r, 0, Math.PI * 2);
      sceneCtx.stroke();
      sceneCtx.setLineDash([]);
      sceneCtx.fillStyle = tone.text;
      sceneCtx.font = "6px Sora, sans-serif";
      sceneCtx.fillText("Extract", zone.x - 9, zone.y + zone.r + 7);
    }

    for (const entity of state.entities) {
      if (entity.kind === "alien") drawSpriteEntity(entity, () => drawAlienFallback(entity));
      else if (entity.kind === "enemy") drawSpriteEntity(entity, () => drawEnemyFallback(entity));
      else if (entity.kind === "beacon") drawSpriteEntity(entity, () => drawBeaconFallback(entity));
      else if (entity.kind === "probe") drawSpriteEntity(entity, () => drawProbeFallback(entity));
    }

    drawPlayer();

    if (state.mission && state.objective.current) {
      // Mission status is now surfaced in the external HUD panel.
    }

    drawHud();
  }

  function drawBattle() {
    if (!state.battle) return;
    const tone = sceneTone("battle");
    const ambient = (Math.sin(state.frame * 0.12) + 1) / 2;
    const battle = state.battle;
    const enemyAccent = tone.secondary;
    const playerAccent = tone.accentPulse;
    const enemy = battle.enemyPet;
    const player = activePlayerPet();
    if (!enemy || !player) return;
    const targetEnemyHp = Math.max(0, Math.min(1, enemy.hp / Math.max(1, enemy.maxHp)));
    const targetPlayerHp = Math.max(0, Math.min(1, player.hp / Math.max(1, player.maxHp)));
    const easedEnemyHp = lerp(state.visual.battleHud.enemyHp || targetEnemyHp, targetEnemyHp, 0.34);
    const easedPlayerHp = lerp(state.visual.battleHud.playerHp || targetPlayerHp, targetPlayerHp, 0.34);
    state.visual.battleHud.enemyHp = easedEnemyHp;
    state.visual.battleHud.playerHp = easedPlayerHp;

    const enemySpecies = speciesForId(enemy.speciesId);
    const playerSpecies = speciesForId(player.speciesId);

    sceneCtx.fillStyle = tone.surface;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);
    drawPanel(8, 8, SIM_W - 16, SIM_H - 16, {
      fill: withAlpha(tone.panelFill, 0.88),
      edge: tone.edge,
      radius: 2,
    });

    sceneCtx.fillStyle = tone.edge;
    sceneCtx.fillRect(8, 8, SIM_W - 16, 4);
    sceneCtx.fillStyle = withAlpha(tone.edge, 0.18);
    for (let i = 0; i < 5; i += 1) {
      const x = 10 + i * ((SIM_W - 20) / 4);
      sceneCtx.fillRect(x, 8, 1, 6);
    }

    const sidePad = 14;
    const sideGapReserve = Math.max(78, Math.floor(SIM_W * 0.18));
    const combatCardW = clamp(Math.floor((SIM_W - sidePad * 2 - sideGapReserve) / 2), 140, 240);
    const combatCardH = clamp(Math.floor(SIM_H * 0.56), 130, 208);
    const combatCardY = 22;
    const centerGap = SIM_W - sidePad * 2 - combatCardW * 2;
    const enemyCardX = sidePad;
    const playerCardX = sidePad + combatCardW + centerGap;
    const portraitSize = Math.min(Math.floor(Math.min(combatCardW, combatCardH) * 0.54), 116);
    const barW = combatCardW - 28;
    const barH = 6;

    function drawCombatCard(cardX, species, portraitKey, hpText, hpPercent, accent, level, isPlayerCard, title) {
      drawPanel(cardX, combatCardY, combatCardW, combatCardH, {
        fill: withAlpha(tone.panelFill, 0.94),
        edge: tone.edge,
        radius: 2,
      });

      const portraitX = cardX + Math.floor(combatCardW / 2);
      const portraitY = combatCardY + Math.floor(combatCardH * 0.46);
      drawSpriteByKey(
        portraitKey,
        portraitX,
        portraitY,
        portraitSize,
        () => drawAlienFallback({ x: portraitX, y: portraitY, r: Math.max(8, Math.floor(portraitSize * 0.16)), species }),
      );

      const titleX = cardX + 12;
      const titleY = combatCardY + 17;
      const barX = cardX + 14;
      const barY = combatCardY + combatCardH - 32;
      const hpY = combatCardY + combatCardH - 22;
      sceneCtx.fillStyle = tone.text;
      sceneCtx.textAlign = "left";
      sceneCtx.font = "700 8px Sora, sans-serif";
      sceneCtx.fillText(title, titleX, titleY);
      sceneCtx.font = "700 7px Sora, sans-serif";
      sceneCtx.fillText(species.name, titleX, titleY + 12);
      sceneCtx.font = "6px Sora, sans-serif";
      sceneCtx.fillText(level, titleX, titleY + 20);
      sceneCtx.fillStyle = isPlayerCard ? withAlpha(playerAccent, 0.2) : withAlpha(enemyAccent, 0.2);
      sceneCtx.fillRect(barX, barY, barW, barH);
      sceneCtx.fillStyle = accent;
      sceneCtx.fillRect(barX, barY, Math.max(2, Math.floor(barW * hpPercent)), barH);
      sceneCtx.fillStyle = withAlpha(accent, 0.35);
      sceneCtx.fillRect(barX, barY, Math.max(2, Math.floor(barW * hpPercent * (0.3 + ambient * 0.18))), barH);
      sceneCtx.strokeStyle = tone.text;
      sceneCtx.strokeRect(barX, barY, barW, barH);
      sceneCtx.fillStyle = tone.text;
      sceneCtx.font = "6px Sora, sans-serif";
      sceneCtx.fillText(hpText, barX, hpY);
    }

    drawCombatCard(
      enemyCardX,
      enemySpecies,
      `alien-${enemy.speciesId}`,
      `HP ${enemy.hp}/${enemy.maxHp}`,
      easedEnemyHp,
      enemyAccent,
      `Lv ${enemy.level}`,
      false,
      "Enemy",
    );
    drawCombatCard(
      playerCardX,
      playerSpecies,
      `alien-${player.speciesId}`,
      `HP ${player.hp}/${player.maxHp}`,
      easedPlayerHp,
      playerAccent,
      `Lv ${player.level}`,
      true,
      "Player",
    );

    drawPanel(12, SIM_H - 74, SIM_W - 24, 58, {
      fill: withAlpha(tone.panelFill, 0.9),
      edge: tone.edge,
      radius: 2,
    });
    sceneCtx.fillStyle = tone.text;
    sceneCtx.textAlign = "center";
    sceneCtx.font = "700 8px Sora, sans-serif";
    sceneCtx.fillText(`TURN ${battle.turn} — BATTLE`, SIM_W / 2, SIM_H - 57);
    sceneCtx.font = "6px Sora, sans-serif";
    sceneCtx.fillText("Use side action rail to execute abilities and switch options.", SIM_W / 2, SIM_H - 45);
    sceneCtx.fillText("Combat state updates are streamed in the console panel.", SIM_W / 2, SIM_H - 37);

    const sideGlow = 12;
    sceneCtx.fillStyle = withAlpha(enemyAccent, 0.06);
    sceneCtx.fillRect(enemyCardX + 2, combatCardY + combatCardH * 0.9, combatCardW - 4, sideGlow);
    sceneCtx.fillStyle = withAlpha(playerAccent, 0.06);
    sceneCtx.fillRect(playerCardX + 2, combatCardY + combatCardH * 0.9, combatCardW - 4, sideGlow);

    sceneCtx.textAlign = "left";
  }

  function drawResult() {
    const tone = sceneTone("result");
    sceneCtx.fillStyle = tone.surface;
    sceneCtx.fillRect(0, 0, SIM_W, SIM_H);
    drawPanel(44, 40, 232, 102);
    sceneCtx.fillStyle = tone.edge;
    sceneCtx.fillRect(44, 40, 232, 4);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "700 10px Sora, sans-serif";
    sceneCtx.fillText(state.messages[0] || "Mission result", 102, 66);
    sceneCtx.font = "7px Sora, sans-serif";
    sceneCtx.fillText(state.messages[1] || "", 96, 86);
    sceneCtx.fillText(state.messages[2] || "", 96, 96);
    sceneCtx.fillText(`Score ${state.score}`, 130, 112);
    sceneCtx.fillText(`Captured species ${Object.keys(state.objective.capturedSpecies).length}`, 84, 123);
  }

  function drawPlayer() {
    const tone = sceneTone(state.mode);
    const pulse = 1 + Math.sin(state.frame * 0.18) * 0.12;
    const playerEntity = {
      kind: "player",
      x: state.player.x,
      y: state.player.y,
      r: Math.max(4, state.player.r * pulse),
    };
    const trailBase = state.player.invulnFrames > 0 ? tone.lead : withAlpha(tone.edge, 0.12);
    for (let i = 1; i <= 3; i += 1) {
      const t = i / 3;
      sceneCtx.fillStyle = withAlpha(trailBase, 0.14 * (1 - t));
      sceneCtx.beginPath();
      sceneCtx.arc(
        state.player.x - i * 0.8,
        state.player.y - i * 0.6,
        state.player.r * pulse * (0.7 + t * 0.1),
        0,
        Math.PI * 2
      );
      sceneCtx.fill();
    }
    drawSpriteEntity(
      playerEntity,
      () => {
        sceneCtx.fillStyle = state.player.invulnFrames > 0 ? tone.lead : tone.edge;
        sceneCtx.beginPath();
        sceneCtx.arc(state.player.x, state.player.y, state.player.r * pulse, 0, Math.PI * 2);
        sceneCtx.fill();
        sceneCtx.strokeStyle = tone.text;
        sceneCtx.lineWidth = 0.8;
        sceneCtx.stroke();
      }
    );
  }

  function drawHud() {
    const tone = sceneTone(state.mode);
    const hudH = 10;
    const hudX = 8;
    const hudY = SIM_H - hudH - 6;
    const presetText = `${visualPresetLabel()} / ${resolveVisualProfileLabel()}`;
    const statusText = `HP ${state.player.hp}/${state.player.maxHp}  SCORE ${state.score}`;
    const lastMessage = state.messages[state.messages.length - 1] || "";
    const warning =
      state.player.hp <= 1 || state.mode === "result"
        ? " ! "
        : state.mode === "battle" && state.player.invulnFrames > 0
          ? " ⚠ "
          : " ";
    sceneCtx.fillStyle = withAlpha(tone.panelFill, 0.9);
    sceneCtx.fillRect(hudX, hudY, SIM_W - hudX * 2, hudH);
    sceneCtx.strokeStyle = withAlpha(tone.edge, 0.38);
    sceneCtx.lineWidth = 0.8;
    sceneCtx.strokeRect(hudX, hudY, SIM_W - hudX * 2, hudH);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "6px Sora, sans-serif";
    sceneCtx.fillText(`${warning}${statusText}`, hudX + 4, hudY + 7);
    if (lastMessage) {
      sceneCtx.fillStyle = tone.secondary;
      sceneCtx.fillText(lastMessage, hudX + 112, hudY + 7);
    }
    const presetX = SIM_W - hudX - 4 - sceneCtx.measureText(presetText).width;
    sceneCtx.fillStyle = tone.text;
    sceneCtx.fillText(presetText, presetX, hudY + 7);
  }

  function drawPostProcess(profileOverride = null) {
    const tone = paletteForMode(state.mode);
    const displayW = canvas.width;
    const displayH = canvas.height;
    const rawScale = Math.min(displayW / SIM_W, displayH / SIM_H);
    const renderPolicy = resolveVisualPolicy();
    const isMinimal = isMinimalVisualPreset();
    const isModern = isModernVisualPreset();
    const resolvedScale = resolveRenderScale(rawScale, displayW, displayH);
    const drawW = Math.max(1, Math.round(SIM_W * resolvedScale));
    const drawH = Math.max(1, Math.round(SIM_H * resolvedScale));
    const scale = drawW / SIM_W;
    const offsetX = Math.floor((displayW - drawW) / 2);
    const offsetY = Math.floor((displayH - drawH) / 2);
    const modeProfile = profileOverride || resolveActiveVfxProfile();
    const vfxPulses = resolveVfxPulses();
    const transitionBlend = clamp(modeProfile.transitionBlend || 0, 0, 1);
    const transitionPulse = Math.sin(transitionBlend * Math.PI * 0.5);
    const sourceProfile = {
      ...modeProfile,
      chromaShift: (modeProfile.chromaShift || 0) * (0.62 + vfxPulses.split * 1.2 + vfxPulses.battle * 0.4),
      frameJitter:
        (modeProfile.frameJitter || 0) * (0.72 + vfxPulses.camera * 1.4 + vfxPulses.modeShift * 0.4 + vfxPulses.transition * 0.6),
      flickerChance:
        (modeProfile.flickerChance || 0) * (1 + vfxPulses.battle * 1.2 + vfxPulses.ambient * 0.45 + vfxPulses.modeShift * 0.3),
    };
    const motionEnvelope = isModern ? 0 : prefersReducedMotion() ? 0.28 : isMinimal ? 0 : 1;
    const jitter =
      isMinimal || isModern
      ? 0
      : renderPolicy === "smooth"
        ? (frameNoise(97, state.frame, 13) - 0.5) *
          0.5 *
          (sourceProfile.frameJitter || 0) *
          motionEnvelope
        : 0;
    const frameSource = resolvePostProcessSourceCanvas(sourceProfile);
    const flickerChance = isMinimal || isModern
      ? 0
      : clamp((modeProfile.flickerChance || 0) * (0.85 + vfxPulses.battle * 1.1), 0, 0.22);
    const activeFlicker =
      flickerChance > 0 && !isModern && frameNoise(11, state.visual.fxFrame, 17) < flickerChance
        ? withAlpha(BRAND_TOKENS.INK, 0.07 + vfxPulses.battle * 0.03)
        : null;
    const baseNoiseAlpha =
      isMinimal
      ? 0
      : (state.mode === "hub" ? 0.15 : state.mode === "mission" ? 0.12 : 0.1) *
        modeProfile.noiseDensity *
        (0.85 + vfxPulses.ambient * 0.45 + transitionPulse * 0.25) *
        motionEnvelope;
    const driftPulse = (state.frame * 0.015 + state.seed * 0.0000001) % 1;
    const orbitKick =
      isMinimal || isModern
      ? 0
      : (Math.sin(state.visual.fxFrame * 0.09) + 1) *
          (0.12 + vfxPulses.camera * 0.16 + transitionPulse * 0.06) *
          motionEnvelope;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = withAlpha(tone.surface, 1);
    ctx.fillRect(0, 0, displayW, displayH);

    ctx.imageSmoothingEnabled = renderPolicy === "smooth";
    ctx.imageSmoothingQuality = renderPolicy === "smooth" ? "high" : "low";
    const worldX = offsetX + Math.round(jitter + Math.sin(driftPulse * Math.PI * 2) * orbitKick * scale);
    const worldY = offsetY + Math.round(jitter * 0.55 + Math.cos(driftPulse * Math.PI * 2) * orbitKick * scale);
    ctx.drawImage(frameSource, worldX, worldY, drawW, drawH);
    if (activeFlicker) {
      ctx.fillStyle = activeFlicker;
      ctx.fillRect(offsetX, offsetY, drawW, drawH);
    }

    if (isModern) {
      drawModeEffectsEnvelope({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        baseNoiseAlpha,
        orbitPulse: orbitKick,
        profile: modeProfile,
        transitionPulse,
        motionEnvelope,
        isModern,
      });
      drawModernDisplayShell({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
        isModern,
      });
    } else if (isMinimal) {
      ctx.strokeStyle = withAlpha(tone.edge, 0.12);
      ctx.lineWidth = Math.max(0.5, scale * 0.5);
      ctx.strokeRect(offsetX + 0.5, offsetY + 0.5, drawW - 1, drawH - 1);
    } else {
      drawModeEffectsEnvelope({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        baseNoiseAlpha,
        orbitPulse: orbitKick,
        profile: modeProfile,
        transitionPulse,
        motionEnvelope,
      });

      drawModeFrameChrome({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
        transitionPulse,
        orbitPulse: orbitKick,
      });
      drawModernDisplayShell({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
      });
    }

    const vignette = ctx.createLinearGradient(offsetX, offsetY, offsetX, offsetY + drawH);
    const vignetteStrength = isMinimal
      ? 0.012
      : isModern
        ? 0.004 + transitionPulse * 0.001 + (modeProfile.bloom || 0) * 0.015 + vfxPulses.ambient * 0.004
        : 0.03 + transitionPulse * 0.02 + (modeProfile.bloom || 0) * 0.04 + vfxPulses.ambient * 0.02;
    const vignetteCenter = isMinimal ? 0.004 : 0.008;
    vignette.addColorStop(0, withAlpha(tone.text, vignetteStrength));
    vignette.addColorStop(0.5, withAlpha(tone.text, vignetteCenter));
    vignette.addColorStop(1, withAlpha(tone.text, vignetteStrength));
    ctx.fillStyle = vignette;
    ctx.fillRect(offsetX, offsetY, drawW, drawH);
    ctx.strokeStyle = withAlpha(tone.text, 0.24);
    if (isModern) {
      ctx.strokeStyle = withAlpha(tone.text, MODERN_STYLE.frameAlpha);
    }
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY, drawW, drawH);
  }

  function drawModernDisplayShell({
    tone,
    offsetX,
    offsetY,
    drawW,
    drawH,
    scale,
    profile,
    isModern = false,
  }) {
    if (isModern) {
      const glowColor = tone.accentPulse || tone.secondary || tone.text;
      const strokeColor = withAlpha(tone.text, MODERN_STYLE.edgeAlpha);
      const markerSize = Math.max(8, Math.round(scale * 10));
      ctx.setLineDash([]);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(0.6, scale * 0.35);
      ctx.strokeRect(offsetX + 1.5, offsetY + 1.5, drawW - 3, drawH - 3);
      ctx.fillStyle = withAlpha(glowColor, MODERN_STYLE.edgeAlpha);
      ctx.fillRect(offsetX + 2, offsetY + 2, markerSize, 2);
      ctx.fillRect(offsetX + drawW - markerSize - 2, offsetY + 2, markerSize, 2);
      ctx.fillRect(offsetX + 2, offsetY + drawH - 4, markerSize, 2);
      ctx.fillRect(offsetX + drawW - markerSize - 2, offsetY + drawH - 4, markerSize, 2);
      ctx.fillStyle = withAlpha(tone.secondary, MODERN_STYLE.softLineAlpha);
      ctx.fillRect(offsetX + drawW - Math.round(scale * 3.8), offsetY + 2, Math.round(scale * 2.4), markerSize);
      return;
    }

    const beams = 10;
    const alpha = clamp((profile && profile.toneStrength ? profile.toneStrength : 0.7) * 0.15, 0.05, 0.24);
    const glowColor = tone.accentPulse || tone.secondary || tone.text;
    const drift = (state.visual.fxFrame * 0.08) % (drawW || 1);

    ctx.setLineDash([Math.max(2, Math.round(scale * 2.4)), Math.max(3, Math.round(scale * 3.4))]);
    ctx.lineWidth = Math.max(0.7, scale * 0.7);
    for (let i = 0; i < 2; i += 1) {
      const top = offsetY + (i === 0 ? 0.5 : drawH - 0.8);
      ctx.strokeStyle = withAlpha(glowColor, alpha - i * 0.04);
      ctx.beginPath();
      ctx.moveTo(offsetX + drift * (i + 1), top);
      ctx.lineTo(offsetX + Math.min(drawW, drawW - 2) - ((drift * (i + 1)) % drawW), top);
      ctx.stroke();
    }

    ctx.lineWidth = Math.max(0.55, scale * 0.55);
    ctx.setLineDash([]);
    for (let i = 0; i < beams; i += 1) {
      const seed = frameNoise(i, state.visual.fxFrame, 33);
      const x = offsetX + seed * drawW;
      const h = drawH * (0.03 + (seed % 0.07));
      const y = offsetY + ((state.visual.fxFrame * 0.14 + i * 11) % Math.max(1, drawH - 3));
      ctx.fillStyle = withAlpha(glowColor, alpha * (0.14 + (seed % 0.25)));
      ctx.fillRect(x, y, Math.max(1, Math.round(scale * 1.4)), h);
    }

    ctx.fillStyle = withAlpha(tone.secondary, alpha * 0.7);
    ctx.fillRect(offsetX + drawW - Math.max(10, Math.round(10 * scale)), offsetY + 2, Math.max(8, Math.round(8 * scale)), Math.max(5, Math.round(5 * scale)));
  }

  function drawModeEffectsEnvelope({
    tone,
    offsetX,
    offsetY,
    drawW,
    drawH,
    scale,
    baseNoiseAlpha,
    orbitPulse = 0.2,
    profile,
    transitionPulse = 0,
    motionEnvelope = 1,
    isModern = false,
  }) {
    const modeProfile = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const cleanHubMode = state.mode === "hub" && isModernVisualPreset();
    const envelopeStrength = clamp(motionEnvelope, 0, 1);
    const frame = state.frame;
    const pulses = resolveVfxPulses();
    if (isModern) {
      return;
    }
    const starMotion = (modeProfile.motionAmp !== undefined ? modeProfile.motionAmp : 0.16) * envelopeStrength;
    const starBudget = cleanHubMode ? 0.45 : 1;
    const starCount = Math.max(
      14,
      Math.round(
        (state.mode === "hub" ? 66 : state.mode === "mission" ? 46 : 34) *
          starBudget *
          (modeProfile.effectCap || 1) *
          (1 + 0.18 * pulses.ambient + 0.1 * transitionPulse) *
          (
            modeProfile.particles /
              (VISUAL_PIPELINE.vfxProfiles[state.mode] && VISUAL_PIPELINE.vfxProfiles[state.mode].particles
                ? VISUAL_PIPELINE.vfxProfiles[state.mode].particles
                : 1) || 1
          ) *
          envelopeStrength
      )
    );
    const toneStrength = (modeProfile.toneStrength !== undefined ? modeProfile.toneStrength : 0.16) * envelopeStrength;

    for (let i = 0; i < starCount; i++) {
      const depth = frameNoise(i * 13, state.seed, 91);
      const drift = ((frame * (0.12 + depth * starMotion)) % 80) * (state.mode === "mission" ? 1.4 : 1);
      const baseX = frameNoise(i * 23, state.seed, 81) * SIM_W;
      const baseY = frameNoise(i * 29, state.seed + 27, 77) * SIM_H;
      const x = (baseX + (i % 2 === 0 ? drift : -drift)) % SIM_W;
      const y = (baseY + (i % 3 === 0 ? drift : -drift) * 0.6) % SIM_H;
      const starX = offsetX + ((x + SIM_W) % SIM_W) * scale;
      const starY = offsetY + ((y + SIM_H) % SIM_H) * scale;
      const flicker = ((frame * 0.17 + i) % 11) < 4 ? 1 : 0.35;
      const alpha = (0.05 + depth * 0.13) * flicker * (state.mode === "result" ? 0.5 : 1) * (1 + pulses.ambient * 0.24 + pulses.battle * 0.1);
      const starColor = i % 2 === 0 ? tone.secondary : tone.accentPulse;
      ctx.fillStyle = withAlpha(starColor, alpha);
      const dot = Math.max(1, Math.round(scale * (0.5 + depth * 0.7)));
      ctx.fillRect(starX, starY, dot, dot);
    }

    if (!cleanHubMode) {
      drawPalettePulseBands({ tone, offsetX, offsetY, drawW, drawH, scale, toneStrength });
      drawPostProcessDeadspaceVeins({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
        transitionPulse,
        pulses,
      });
      drawCreepInterferenceBars({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        transitionPulse,
        pulses,
      });
      if (transitionPulse > 0.02) {
        drawDoorwayRiftPulse({
          tone,
          offsetX,
          offsetY,
          drawW,
          drawH,
          scale,
          transitionPulse,
          pulses,
        });
      }
    }

    if (state.mode === "hub") {
      drawHubRouteFlow({ tone, offsetX, offsetY, drawW, drawH, scale });
      if (!cleanHubMode) {
        drawHubDeckAtmosphere({ tone, offsetX, offsetY, drawW, drawH, scale });
      }
    }

    if (state.mode === "mission") {
      drawMissionObjectiveHalo({ tone, offsetX, offsetY, drawW, drawH, scale, baseNoiseAlpha, t: toneStrength });
      drawMissionCometLanes({ tone, offsetX, offsetY, drawW, drawH, scale, toneStrength });
      drawMissionFluxBubbles({ tone, offsetX, offsetY, drawW, drawH, scale, t: toneStrength });
      drawMissionOrbitPulse({ tone, offsetX, offsetY, drawW, drawH, scale });
      drawMissionSectorField({ tone, offsetX, offsetY, drawW, drawH, scale, t: toneStrength });
      drawMissionBeaconSweep({ tone, offsetX, offsetY, drawW, drawH, scale });
      drawMissionHazardCorners({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
      });
    }

    if (state.mode === "battle") {
      drawBattleImpactStreak({ tone, offsetX, offsetY, drawW, drawH, scale, toneStrength });
      drawBattleImpactFlash({ tone, offsetX, offsetY, drawW, drawH, scale });
      drawBattleFocusLanes({ tone, offsetX, offsetY, drawW, drawH, scale });
      drawBattleTurnPulse({ tone, offsetX, offsetY, drawW, drawH, scale });
      drawBattleCommandGrid({ tone, offsetX, offsetY, drawW, drawH, scale, toneStrength });
      drawEntityCreepOutlines({
        entities: state.entities,
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
      });
    }

    if (state.mode === "mission") {
      drawEntityCreepOutlines({
        entities: state.entities,
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
      });
    }

    if (
      !isModern &&
      (state.mode === "mission" || state.mode === "battle" || (state.mode === "hub" && !cleanHubMode))
    ) {
      drawPostProcessStaticWash({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
        pulses,
        transitionPulse,
      });
      drawPostProcessChromaticBleed({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        profile: modeProfile,
        pulses,
        transitionPulse,
        scale,
      });
    }

    if (state.mode === "title" || state.mode === "result") {
      const ringPulse = 0.45 + Math.sin(frame * 0.06) * 0.2;
      const pulseX = offsetX + drawW * 0.84;
      const pulseY = offsetY + drawH * 0.16;
      const ring = ctx.createRadialGradient(pulseX, pulseY, 2, pulseX, pulseY, 18 * scale);
      ring.addColorStop(0, withAlpha(tone.accentPulse, 0.2 * ringPulse));
      ring.addColorStop(1, withAlpha(tone.lead, 0));
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 18 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    const scanStep = Math.max(
      1,
      Math.round((scale * 0.8) / Math.max(0.35, modeProfile.scanlineDensity || 1)),
    );
    const scanlineStrength = (modeProfile.scanlineStrength || 1) * (cleanHubMode ? 0.22 : 1);
    const scanAlpha =
      (state.mode === "battle" ? 0.065 : 0.055) *
      toneStrength *
      (modeProfile.scanlineDensity || 1) *
      scanlineStrength *
      (1 + pulses.battle * 0.28 + pulses.modeShift * 0.18 + transitionPulse * 0.12);
    for (let y = 0; y < drawH; y += scanStep) {
      if (pulses.ambient > 0.6 && frame % 97 < 1) continue;
      const sine = Math.sin((frame + y * 0.2) / 11);
      const dy = offsetY + y + (state.mode === "battle" ? 0.8 : 0.4) * sine;
      const stripe = Math.max(0.5, 0.25 + (((frame + y + Math.floor(pulses.ambient * 3)) % 4) * 0.08));
      ctx.fillStyle = withAlpha(tone.subtle, scanAlpha * stripe);
      ctx.fillRect(offsetX, dy, drawW, 1);
    }

    if (!cleanHubMode) {
      drawPostProcessParticleCloud({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
      });

      drawPostProcessBloom({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
        scale,
        profile: modeProfile,
        orbitPulse,
      });
    }
  }

  function drawPostProcessParticleCloud({ tone, offsetX, offsetY, drawW, drawH, scale, profile }) {
    const pulses = resolveVfxPulses();
    const count = Math.max(
      6,
      Math.round((profile.particles || 18) * 0.55 * (1 + pulses.ambient * 0.18 + pulses.modeShift * 0.16)),
    );
    const cloudPulse = state.visual.fxFrame * 0.13;
    const density = 1 + (profile.particleDensity || 1) * 0.5 + pulses.battle * 0.08;
    for (let i = 0; i < count; i += 1) {
      const base = frameNoise(i * 29, state.seed, 97);
      const life = frameNoise(i * 41, state.seed + 13, 43);
      const x = (frameNoise(i * 17, state.seed, 19) * drawW + Math.sin(cloudPulse + base) * drawW * 0.12 * density) % drawW;
      const y = (frameNoise(i * 23, state.seed + 77, 27) * drawH + Math.cos(cloudPulse + life) * drawH * 0.1 * density) % drawH;
      const px = offsetX + ((x + drawW) % drawW);
      const py = offsetY + ((y + drawH) % drawH);
      const pulse = (Math.sin(cloudPulse + i * 0.4) + 1) * 0.5;
      const isNode = life < 0.1;
      const size = Math.max(1, Math.floor((0.5 + life * 0.9) * scale));
      const alpha = (isNode ? 0.21 : 0.09) * (1 + pulses.ambient * 0.25);
      ctx.fillStyle = withAlpha(isNode ? tone.secondary : tone.accentPulse, alpha * pulse * density);
      if (isNode) {
        ctx.beginPath();
        ctx.arc(px, py, size + 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(px, py, size, size);
      }
    }
  }

  function drawPostProcessBloom({ tone, offsetX, offsetY, drawW, drawH, scale, profile, orbitPulse }) {
    const pulses = resolveVfxPulses();
    const ringScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const bloomStrength = (profile.bloom || 0) * (0.42 + orbitPulse) * (1 + pulses.battle * 0.12 + pulses.modeShift * 0.2);
    if (bloomStrength <= 0) return;
    const orbitPulseNorm = clamp(orbitPulse, 0, 1);
    const centerX = offsetX + drawW / 2;
    const centerY = offsetY + drawH / 2;
    const arcCount = Math.max(1, Math.round(1.2 + (profile.effectCap || 1) * 2.2));
    const baseRadius = Math.min(drawW, drawH) * 0.16;
    const radiusStep = Math.max(9, Math.min(drawW, drawH) * 0.12);
    const baseAlpha = 0.008 + 0.028 * bloomStrength;
    for (let i = 0; i < arcCount; i += 1) {
      const pulse = i / Math.max(1, arcCount - 1);
      const radius = baseRadius + radiusStep * pulse;
      const alpha = baseAlpha * (1 - pulse * 0.46) * (0.6 + pulses.ambient * 0.35);
      const arcDrift = Math.sin(state.visual.fxFrame * 0.12 + i * 1.3) * ringScale * 1.5;
      const arcDash = Math.max(2, Math.round(ringScale * (3 + i)));
      const arcGap = Math.max(1, Math.round(ringScale * 3));
      ctx.setLineDash([arcDash, arcGap]);
      ctx.lineWidth = Math.max(0.45, 1.35 - pulse * 0.35);
      ctx.strokeStyle = withAlpha(tone.text, alpha);
      ctx.beginPath();
      ctx.arc(centerX + arcDrift, centerY - arcDrift * 0.55, radius * (1 + orbitPulseNorm * 0.06), 0, Math.PI * 2);
      ctx.stroke();
      if (i === 0 || i === arcCount - 1) {
        ctx.setLineDash([]);
        ctx.fillStyle = withAlpha(tone.subtle, alpha * 0.4);
        const pulseY = centerY + ((i + 1) % 2 === 0 ? 1 : -1) * (radius + 6);
        const pulseX = centerX + arcDrift * 0.35;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, ringScale * (1.9 + i * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.setLineDash([]);
  }

  function drawDoorwayRiftPulse({ tone, offsetX, offsetY, drawW, drawH, scale, transitionPulse, pulses }) {
    const pulse = clamp(transitionPulse + pulses.modeShift * 0.3, 0, 1);
    const riftDensity = Math.max(2, VISUAL_PIPELINE.effects.ruptureFrequencies || 4);
    const layerCount = Math.max(2, Math.round(2 + pulse * riftDensity));
    const stripHeight = Math.max(1, Math.round(scale * 0.8));
    const drift = (state.visual.fxFrame * 0.4) % drawH;
    const pulseShift = (state.frame * 0.12) % Math.max(1, drawW / 3);
    for (let i = 0; i < layerCount; i += 1) {
      const wave = Math.sin(i * 0.9 + state.visual.fxFrame * 0.09) * 2 * scale;
      const y = ((drift + (i / layerCount) * drawH + wave) % drawH) + offsetY;
      const x = offsetX + (i % 2 === 0 ? Math.floor(pulseShift * 0.12 * scale) : -Math.floor(pulseShift * 0.09 * scale));
      const width = Math.max(8, drawW * (0.38 + i * 0.09));
      ctx.fillStyle = withAlpha(tone.text, 0.03 + pulse * 0.05 + pulses.split * 0.02);
      ctx.fillRect(x, y, width, stripHeight);
      ctx.fillStyle = withAlpha(tone.secondary, 0.02 + pulse * 0.04);
      ctx.fillRect(offsetX + drawW - x, y + stripHeight * (i % 2 ? 1 : -1), Math.max(4, width * 0.75), stripHeight);
    }
  }

  function drawPostProcessChromaticBleed({
    tone,
    offsetX,
    offsetY,
    drawW,
    drawH,
    profile,
    pulses,
    transitionPulse,
    scale,
  }) {
    const resolvedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const modeProfile = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const bleed = Math.max(
      0,
      Math.min(
        0.35,
        (modeProfile.chromaShift || 0) +
          (pulses.split || 0) * 0.26 +
          transitionPulse * 0.17 +
          (pulses.ambient || 0) * 0.08,
      ),
    );
    if (bleed <= 0) return;
    const riftCount = Math.round(3 + bleed * VISUAL_PIPELINE.effects.riftPulseDensity * 2);
    for (let i = 0; i < riftCount; i += 1) {
      const segmentY = Math.floor(offsetY + frameNoise(i * 17, state.visual.fxFrame, 29) * drawH);
      const bandH = Math.max(1, Math.floor(0.8 + resolvedScale * (0.6 + (i % 4) * 0.3)));
      const drift = Math.sin(state.visual.fxFrame * 0.16 + i * 1.5) * (resolvedScale * 1.2);
      const bleedAlpha = 0.018 + bleed * 0.05;
      const jitterLen = Math.round(drawW * (0.6 + (i % 4) * 0.1));
      const start = offsetX + drift;
      const end = offsetX + Math.min(drawW - 1, jitterLen);
      ctx.fillStyle = withAlpha(tone.accentPulse, bleedAlpha * 0.75);
      ctx.fillRect(start, segmentY, end - start, bandH);
      ctx.fillStyle = withAlpha(tone.secondary, bleedAlpha * 0.55);
      ctx.fillRect(start + Math.max(0, Math.floor(bandH * 0.6)), segmentY + bandH, end - start, bandH);
    }
  }

  function drawPostProcessDeadspaceVeins({
    tone,
    offsetX,
    offsetY,
    drawW,
    drawH,
    scale,
    profile,
    transitionPulse,
    pulses,
  }) {
    const modeProfile = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const menace = clamp(
      0.2 + (modeProfile.effectCap || 0) * 0.45 + (pulses.ambient || 0) * 0.5 + transitionPulse * 0.4,
      0,
      1.2,
    );
    const density = Math.round((VISUAL_PIPELINE.effects.veilDensity || 20) * menace);
    const stripeGap = Math.max(4, Math.round(16 / Math.max(1, scale)));
    for (let i = 0; i < density; i += 1) {
      const n1 = frameNoise(i * 13, state.visual.fxFrame, 77);
      const n2 = frameNoise(i * 23, state.visual.fxFrame + i, 61);
      const x = offsetX + n1 * drawW;
      const y = offsetY + n2 * drawH;
      const segmentLen = Math.max(2, (Math.sin(i * 0.8 + state.visual.fxFrame * 0.22) * 0.5 + 0.8) * drawW * 0.33);
      const width = Math.max(1, Math.round(scale * (0.45 + (i % 4) * 0.12)));
      const alpha = Math.max(0.01, 0.01 + (0.016 * menace) * (0.55 + Math.sin(i + state.visual.fxFrame * 0.2)));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + segmentLen, y + (i % 2 ? -width : width));
      ctx.strokeStyle = withAlpha(tone.subtle, alpha);
      ctx.lineWidth = width;
      ctx.stroke();
      if (i % stripeGap === 0) {
        const dotCount = Math.max(2, Math.round(scale * 3));
        for (let j = 0; j < dotCount; j += 1) {
          const sparkX = x + ((segmentLen / dotCount) * j) % drawW;
          const sparkY = y + ((j % 2) * width) - 0.5;
          ctx.fillStyle = withAlpha(tone.text, alpha * 0.7);
          ctx.fillRect(sparkX, sparkY, width * 0.6, width * 0.6);
        }
      }
    }
  }

  function drawCreepInterferenceBars({ tone, offsetX, offsetY, drawW, drawH, scale, transitionPulse, pulses }) {
    const intensity = clamp(0.28 + pulses.ambient + pulses.split * 1.2 + transitionPulse * 1.1, 0, 1.6);
    const lineCount = Math.max(3, Math.round(VISUAL_PIPELINE.effects.creepLineCount * intensity * 0.5));
    for (let i = 0; i < lineCount; i += 1) {
      const base = (state.frame * 0.62 + i * 17 + transitionPulse * 19) % drawH;
      const y = Math.floor(offsetY + base * 0.55 + Math.sin(state.frame * 0.06 + i) * scale * 2);
      const jitter = Math.sin(state.frame * 0.15 + i * 0.9) * (1.5 * scale);
      const len = Math.round(drawW * (0.4 + (i % 3) * 0.16));
      const alpha = 0.012 + (0.015 * intensity) * (0.75 + (i % 4) * 0.08) * (1 + Math.sin(state.visual.fxFrame * 0.25));
      ctx.fillStyle = withAlpha(tone.subtle, alpha);
      ctx.fillRect(offsetX + jitter, y % (offsetY + drawH), len, Math.max(0.6, scale * 0.75));
    }
  }

  function drawPostProcessStaticWash({
    tone,
    offsetX,
    offsetY,
    drawW,
    drawH,
    scale,
    profile,
    pulses,
    transitionPulse,
  }) {
    const resolvedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const modeProfile = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const menace = clamp(
      0.25 + (modeProfile.effectCap || 0) * 0.45 + (pulses.ambient || 0) * 0.42 + transitionPulse * 0.32 + (pulses.modeShift || 0) * 0.22,
      0,
      1.2,
    );
    const majorLayer = Math.max(2, Math.round(3 + menace * 4));
    const seedPulse = state.visual.fxFrame * 0.09 + (state.seed || 0);
    for (let i = 0; i < majorLayer; i += 1) {
      const pulse = i / Math.max(1, majorLayer);
      const y = offsetY + ((seedPulse * 12 + i * (drawH / majorLayer)) % drawH);
      const xJitter = Math.sin(seedPulse * 0.7 + i * 0.9) * resolvedScale * 1.5;
      const bandH = Math.max(1, Math.round(0.85 + (i % 3) * 0.35 + resolvedScale * 0.2));
      const bandAlpha = (0.012 + menace * 0.016 + transitionPulse * 0.006) * (1 + Math.sin(seedPulse + i) * 0.15 + pulses.ambient * 0.14);
      ctx.fillStyle = withAlpha(tone.subtle, bandAlpha);
      ctx.fillRect(offsetX + Math.floor(xJitter), Math.floor(y), drawW, bandH);
      ctx.fillStyle = withAlpha(tone.text, bandAlpha * 0.42);
      const span = drawW * (0.38 + pulse * 0.2);
      ctx.fillRect(offsetX + Math.max(0, drawW - span), Math.floor(y + bandH + resolvedScale * 0.5), span, bandH * 0.55);
    }

    const fractureCount = Math.max(3, Math.round((VISUAL_PIPELINE.effects.veilDensity || 20) * 0.36 * (0.6 + menace)));
    for (let i = 0; i < fractureCount; i += 1) {
      const lineY = offsetY + ((i / Math.max(1, fractureCount)) * drawH + Math.cos(seedPulse + i * 0.45) * resolvedScale * 2.2) % drawH;
      const lineX = offsetX + ((i * 17 + Math.sin(seedPulse * 0.2) * 9) % drawW);
      const width = Math.max(1, Math.round((modeProfile.motionAmp || 1) * (1 + (i % 2)) * resolvedScale * 0.45));
      const dash = Math.max(1, Math.round(drawW * (0.12 + (i % 3) * 0.02)));
      const alpha = 0.006 + menace * 0.018;
      ctx.fillStyle = withAlpha(tone.secondary, alpha);
      ctx.fillRect(lineX, Math.floor(lineY), dash, width);
      ctx.fillStyle = withAlpha(tone.accentPulse, alpha * 0.45);
      ctx.fillRect(lineX + Math.floor(resolvedScale), Math.floor(lineY + width), Math.max(1, Math.round(dash * 0.36)), Math.max(1, width - 0.2));
    }
  }

  function drawModeFrameChrome({ tone, offsetX, offsetY, drawW, drawH, scale, orbitPulse, profile, transitionPulse = 0 }) {
    const budget = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const pulses = resolveVfxPulses();
    const cleanHubMode = state.mode === "hub" && isModernVisualPreset();
    const edgePulse = 0.5 + Math.sin(state.visual.fxFrame * 0.11) * 0.28;
    const accentPulse = Math.min(1, edgePulse + (budget.toneStrength || 0));
    const lineStep = Math.max(2, Math.floor(scale * 1.8));
    const frameW = Math.max(1, Math.round(scale * 1.2));
    const framePulse = 0.12 + 0.24 * accentPulse + (budget.bloom || 0) * 0.08;
    ctx.strokeStyle = withAlpha(tone.edge, Math.min(0.42, framePulse));
    ctx.lineWidth = frameW;
    ctx.strokeRect(offsetX + 1.2, offsetY + 1.2, drawW - 2.4, drawH - 2.4);
    if (!cleanHubMode) {
      ctx.setLineDash([lineStep, lineStep * 2]);
      ctx.strokeStyle = withAlpha(tone.secondary, 0.16 + orbitPulse * 0.12);
      ctx.lineWidth = Math.max(0.5, scale * 0.7);
      ctx.beginPath();
      ctx.moveTo(offsetX + 6, offsetY + drawH - 6);
      ctx.lineTo(offsetX + drawW - 6, offsetY + 6);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = withAlpha(tone.accentPulse, 0.2 + orbitPulse * 0.14);
      for (let i = 0; i < 5; i += 1) {
        const cornerX = offsetX + (i % 2 === 0 ? 4 : drawW - 4);
        const cornerY = offsetY + (i < 2 ? 4 : (i === 2 ? drawH / 2 : drawH - 4));
        ctx.fillRect(cornerX, cornerY, lineStep * 0.8, lineStep * 0.8);
      }
    }
    const edgeVignette = Math.max(0.01, 0.03 + budget.vignetteAmount * 0.2 + transitionPulse * 0.03 + pulses.ambient * 0.02);
    ctx.fillStyle = withAlpha(tone.text, edgeVignette);
    ctx.fillRect(offsetX, offsetY, drawW, 1.1 * scale);
    ctx.fillRect(offsetX, offsetY + drawH - 1.1 * scale, drawW, 1.1 * scale);
    ctx.fillRect(offsetX, offsetY, 1.1 * scale, drawH);
    ctx.fillRect(offsetX + drawW - 1.1 * scale, offsetY, 1.1 * scale, drawH);

    const riftPulse = clamp(pulses.ambient + transitionPulse + pulses.modeShift * 0.3, 0, 1.3);
    if (!cleanHubMode && riftPulse > 0.2) {
      const crackCount = Math.round(3 + riftPulse * 4);
      for (let i = 0; i < crackCount; i += 1) {
        const axisY = offsetY + ((i + 1) / (crackCount + 1)) * drawH;
        const axisX = offsetX + ((i + 1) / (crackCount + 1)) * drawW;
        const drift = Math.sin(i * 1.5 + state.frame * 0.3) * scale * 2.5;
        const slash = Math.max(1, Math.round(scale * 0.45));
        ctx.fillStyle = withAlpha(tone.text, 0.02 + riftPulse * 0.04);
        ctx.fillRect(axisX + drift, axisY, scale * 2, slash);
        ctx.fillRect(axisX, axisY + Math.floor(drift * 0.4), slash, scale * 2);
      }
    }
  }

  function drawMissionHazardCorners({ tone, offsetX, offsetY, drawW, drawH }) {
    const pulse = 0.24 + Math.sin(state.visual.fxFrame * 0.18) * 0.12;
    const cornerSize = 10;
    const edgeGlow = withAlpha(tone.accentPulse, pulse);
    const corners = [
      [offsetX + 2, offsetY + 2],
      [offsetX + drawW - 2 - cornerSize, offsetY + 2],
      [offsetX + 2, offsetY + drawH - 2 - cornerSize],
      [offsetX + drawW - 2 - cornerSize, offsetY + drawH - 2 - cornerSize],
    ];
    for (const [x, y] of corners) {
      ctx.fillStyle = edgeGlow;
      ctx.fillRect(x, y, 2, cornerSize);
      ctx.fillRect(x, y, cornerSize, 2);
      ctx.fillRect(x + cornerSize - 2, y, 2, cornerSize);
      ctx.fillRect(x, y + cornerSize - 2, cornerSize, 2);
    }
  }

  function drawEntityCreepOutlines({ entities, tone, offsetX, offsetY, drawW, drawH, scale }) {
    if (!Array.isArray(entities) || entities.length === 0) return;
    const profilePulse = resolveVfxPulses();
    const outlineAlpha = 0.12 + profilePulse.battle * 0.1 + profilePulse.ambient * 0.08;
    for (const entity of entities) {
      if (!entity || typeof entity.x !== "number" || typeof entity.y !== "number" || typeof entity.r !== "number") {
        continue;
      }
      const x = offsetX + entity.x * scale;
      const y = offsetY + entity.y * scale;
      const r = Math.max(1, entity.r * scale * (1.55 + profilePulse.modeShift * 0.15));
      ctx.strokeStyle = withAlpha(tone.secondary, outlineAlpha);
      ctx.lineWidth = Math.max(0.45, 0.45 * scale * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawPalettePulseBands({ tone, offsetX, offsetY, drawW, drawH, scale, toneStrength }) {
    const pulse = 0.5 + Math.sin(state.frame * 0.08) * 0.45 * toneStrength;
    const bandHeight = Math.max(1, Math.round(scale * 2.2));
    const scanY1 = drawH * (0.35 + Math.sin(state.frame * 0.04) * 0.014);
    const scanY2 = drawH * (0.64 + Math.cos(state.frame * 0.05) * 0.014);
    const bandSoft = Math.max(1, Math.round(scale * 1.2));
    ctx.fillStyle = withAlpha(tone.secondary, 0.09 * toneStrength);
    ctx.fillRect(offsetX + 4, offsetY + scanY1, drawW - 8, bandHeight);
    ctx.fillStyle = withAlpha(tone.accentPulse, 0.08 * toneStrength);
    ctx.fillRect(offsetX + 4, offsetY + scanY2, drawW - 8, bandHeight);
    for (let i = 0; i < 4; i += 1) {
      const rowY = ((state.frame * 0.3 + i * 7) % drawW) * 0.002 * drawH + offsetY;
      const soft = withAlpha(tone.secondary, (0.02 + i * 0.01) * toneStrength);
      ctx.fillStyle = soft;
      ctx.fillRect(offsetX + 4, offsetY + rowY % drawH, drawW - 8, bandSoft);
    }
  }

  function drawHubDeckAtmosphere({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const orderedPlanets = orderHubPlanets(state.hubs);
    if (orderedPlanets.length < 2) return;
    const bandCount = VISUAL_PIPELINE.effects.hubAtmosphereBands;
    const fxSeed = state.visual.routePulsePhase * 0.5 + state.seed * 0.0002;
    for (let i = 0; i < bandCount; i += 1) {
      const laneT = (state.frame * 0.006 + i / bandCount) % 1;
      const y = offsetY + (laneT * drawH) % drawH;
      const drift = (Math.sin(state.frame * 0.09 + i) * 2 + 1.5) * scale;
      const lineW = Math.max(1, Math.round(0.5 * scale));
      ctx.fillStyle = withAlpha(tone.secondary, 0.08 + (i % 3) * 0.02);
      ctx.fillRect(offsetX + 4 + Math.sin(fxSeed + i) * 2, y, drawW - 8, lineW);
      const start = orderedPlanets[(i * 2) % orderedPlanets.length];
      const end = orderedPlanets[(i * 2 + 1) % orderedPlanets.length];
      ctx.strokeStyle = withAlpha(tone.accentPulse, 0.06 + i * 0.01);
      ctx.lineWidth = Math.max(0.5, 0.5 * scale);
      ctx.beginPath();
      ctx.moveTo(offsetX + start.x * scale, offsetY + start.y * scale + drift);
      ctx.lineTo(offsetX + end.x * scale, offsetY + end.y * scale + drift * 0.9);
      ctx.stroke();
    }
  }

  function drawMissionFluxBubbles({ tone, offsetX, offsetY, drawW, drawH, scale, t = 1 }) {
    const rowCount = VISUAL_PIPELINE.effects.missionNebulaRows;
    const wavePhase = state.visual.fxFrame * 0.019;
    for (let i = 0; i < rowCount; i += 1) {
      const y = offsetY + ((i + wavePhase) / rowCount) * drawH;
      const amp = 4 * scale * (1 + ((i + state.frame * 0.01) % 5) * 0.03);
      ctx.fillStyle = withAlpha(tone.secondary, 0.03 + (i % 4) * 0.006 * t);
      for (let x = 0; x < drawW; x += 18 * scale) {
        const bubbleY = y + Math.sin((x / drawW) * 5 + wavePhase + i * 0.3) * amp;
        const r = 0.8 + (i % 3) * 0.3;
        ctx.beginPath();
        ctx.arc(offsetX + x, bubbleY, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawHubRouteFlow({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const orderedPlanets = orderHubPlanets(state.hubs);
    if (orderedPlanets.length === 0) return;
    const focused = orderedPlanets.find((planet) => dist2(state.player, planet) < (planet.r + 12) ** 2);
    const routePulse = state.visual.routePulsePhase;
    const dockPulse = state.visual.hubPulseOffset;
    const shipX = offsetX + SIM_W * 0.5 * scale;
    const shipY = offsetY + SIM_H * 0.5 * scale;

    for (let i = 0; i < orderedPlanets.length; i += 1) {
      const current = orderedPlanets[i];
      const next = orderedPlanets[(i + 1) % orderedPlanets.length];
      const activeFlow = focused && focused.id === next.id ? 1 : 0.25;
      const px = current.x * scale + offsetX;
      const py = current.y * scale + offsetY;
      const nx = next.x * scale + offsetX;
      const ny = next.y * scale + offsetY;
      const dashAlpha = 0.12 + activeFlow * 0.16;
      for (let k = 0; k < 10; k += 1) {
        const t = (routePulse + k * 0.2) % 1;
        const lx = px + (nx - px) * t;
        const ly = py + (ny - py) * t;
        const glow = Math.max(1, Math.round(scale * 1.2));
        ctx.fillStyle = withAlpha(tone.secondary, dashAlpha * (0.22 + 0.06 * k));
        ctx.beginPath();
        ctx.arc(lx, ly, glow * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      const markerX = current.x * scale + offsetX + Math.sin(state.frame * 0.07 + current.routeIndex * 0.8) * 5 * scale;
      const markerY = current.y * scale + offsetY + Math.cos(state.frame * 0.07 + current.routeIndex * 0.9) * 5 * scale;
      ctx.fillStyle = withAlpha(tone.accentPulse, 0.22 + 0.08 * Math.sin(state.frame * 0.11 + dockPulse));
      ctx.beginPath();
      ctx.arc(markerX, markerY, Math.max(1, scale * 1.15), 0, Math.PI * 2);
      ctx.fill();
    }

    const orbitPulse = 0.72 + Math.sin(state.frame * 0.12) * 0.28;
    ctx.beginPath();
    ctx.arc(shipX, shipY, Math.max(8, 10 * scale * orbitPulse), 0, Math.PI * 2);
    ctx.strokeStyle = withAlpha(tone.secondary, 0.18);
    ctx.lineWidth = Math.max(0.8, scale * 0.8);
    ctx.stroke();
    for (let i = 0; i < 4; i += 1) {
      const arcRadius = (5 + i * 2.4) * scale * orbitPulse * (i % 2 ? 0.84 : 1);
      ctx.beginPath();
      ctx.arc(shipX, shipY, arcRadius, 0.08 * state.frame + i, Math.PI * (1 + i * 0.12) + 0.08 * state.frame);
      ctx.strokeStyle = withAlpha(tone.accentPulse, 0.14 - i * 0.02);
      ctx.lineWidth = Math.max(0.45, scale * 0.45);
      ctx.stroke();
    }
  }

  function drawMissionOrbitPulse({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const pulseBase = 0.52 + (Math.sin(state.frame * 0.13) + 1) * 0.24;
    const cx = offsetX + drawW * 0.5;
    const cy = offsetY + drawH * 0.12;
    for (let i = 0; i < 3; i += 1) {
      const bandRadius = scale * (12 + i * 12) * pulseBase;
      ctx.beginPath();
      ctx.arc(cx, cy, bandRadius, 0, Math.PI * 2);
      ctx.strokeStyle = withAlpha(i % 2 === 0 ? tone.accentPulse : tone.secondary, 0.12 - i * 0.03);
      ctx.lineWidth = Math.max(0.7, scale * 0.55);
      ctx.stroke();
    }
    const drift = (state.frame * 0.12) % (drawW + drawH);
    const laneW = scale * 20;
    ctx.fillStyle = withAlpha(tone.secondary, 0.12);
    ctx.fillRect(offsetX + ((drift % drawW) - laneW), offsetY + drawH * 0.2, laneW, 4 * scale);
    ctx.fillRect(offsetX + drawW - ((drift % drawW) - laneW), offsetY + drawH * 0.77, laneW, 2 * scale);
  }

  function drawMissionObjectiveHalo({ tone, offsetX, offsetY, drawW, drawH, scale, baseNoiseAlpha, t }) {
    const o = state.objective.current;
    if (!o) return;
    const targetReady = o.targetCaptured >= o.targetRequired;
    const taskDone = o.taskDone;
    const missionTargetTone = o.targetId ? speciesForId(o.targetId).color : null;
    const pulse = targetReady ? 0.9 + 0.1 * Math.sin(state.frame * 0.13) : 0.6 + 0.4 * Math.sin(state.frame * 0.09) * t;
    const huePulse = targetReady ? missionTargetTone || tone.secondary : tone.accentPulse;
    const objScreenX = offsetX + (SIM_W - 22) * scale;
    const objScreenY = offsetY + SIM_H * 0.18 * scale;
    const baseRadius = Math.max(6, 10 * scale * (0.72 + pulse * 0.24));
    const radiusBoost = taskDone ? 1.5 : 1;
    const glow = ctx.createRadialGradient(objScreenX, objScreenY, baseRadius * 0.2, objScreenX, objScreenY, baseRadius * (1.85 * radiusBoost));
    glow.addColorStop(0, withAlpha(huePulse, (targetReady ? 0.22 : 0.12) + 0.06 * t));
    glow.addColorStop(1, withAlpha(huePulse, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(objScreenX, objScreenY, baseRadius * (1.7 * radiusBoost), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = withAlpha(tone.subtle, 0.24);
    for (let i = 0; i < 5; i += 1) {
      const ringOffset = (state.frame * 0.11 + i * 0.5) % drawW;
      const ringY = objScreenY + Math.sin((ringOffset + i) * 0.05) * 2 * scale;
      ctx.fillRect(offsetX + (ringOffset % drawW), ringY, 1.2 * scale, 1);
    }
    if (taskDone) {
      const readyText = "Ready";
      const readyX = Math.max(offsetX + 4, objScreenX - scale * 8);
      const readyY = objScreenY - baseRadius * 1.9;
      ctx.fillStyle = withAlpha(tone.secondary, 0.85);
      ctx.font = `${Math.max(6, Math.floor(scale * 4))}px Sora, sans-serif`;
      ctx.fillText(readyText, readyX, readyY);
    }
    ctx.fillStyle = withAlpha(tone.accentPulse, baseNoiseAlpha * 0.84);
    ctx.fillRect(objScreenX - 3 * scale, objScreenY - baseRadius * 2, 6 * scale, baseRadius * 4);
  }

  function drawMissionCometLanes({ tone, offsetX, offsetY, drawW, drawH, scale, t }) {
    const cometCount = Math.max(3, Math.round(VISUAL_PIPELINE.effects.missionCometCount * t * 2));
    for (let i = 0; i < cometCount; i++) {
      const lane = (state.frame * 0.013 + i * 0.23) % 1;
      const cx = offsetX + Math.round((SIM_W * ((i + 1) / (cometCount + 1))) * scale);
      const cy = offsetY + Math.round((SIM_H * (0.24 + 0.52 * lane)) * scale);
      const tail = Math.max(3, Math.floor(scale * 6 * (0.5 + lane)));
      const accent = i % 2 === 0 ? tone.secondary : tone.accentPulse;
      ctx.fillStyle = withAlpha(accent, 0.14 * (0.7 + lane));
      ctx.fillRect(cx, cy, Math.max(1, Math.floor(scale)), tail);
    }
  }

  function drawMissionSectorField({ tone, offsetX, offsetY, drawW, drawH, scale, t }) {
    const missionPhase = (state.visual.fxFrame || 0) * 0.07;
    const rowCount = Math.max(4, Math.floor((SIM_H / 44) * (t || 1)));
    const rowGap = Math.max(2, Math.floor(drawW / 28));
    for (let i = 0; i < rowCount; i += 1) {
      const bandY = offsetY + ((i * 44 + (i % 2) * 12 + missionPhase) % drawH);
      const phase = missionPhase * 0.42 + i * 0.7;
      const drift = Math.sin(phase) * 2 * scale;
      const alpha = 0.03 + (i % 3) * 0.013;
      ctx.strokeStyle = withAlpha(tone.secondary, alpha);
      ctx.lineWidth = Math.max(0.4, scale * 0.38);
      ctx.beginPath();
      for (let x = 0; x <= drawW; x += rowGap) {
        const px = offsetX + x;
        const wav = Math.sin((x / drawW) * 3.6 + phase) * (2 * scale);
        if (x === 0) {
          ctx.moveTo(px, bandY + drift + wav);
        } else {
          ctx.lineTo(px, bandY + drift + wav);
        }
      }
      ctx.stroke();
    }

    const sweep = (missionPhase * 4) % 1;
    for (let i = 0; i < 3; i += 1) {
      const px = offsetX + ((sweep + i * 0.34) % 1) * drawW;
      ctx.fillStyle = withAlpha(tone.accentPulse, 0.04 + i * 0.012);
      ctx.fillRect(px - 0.5 * scale, offsetY, scale * 1.1, drawH);
    }
  }

  function drawMissionBeaconSweep({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    if (state.mission?.task?.id !== "activate_beacon") return;
    const beacon = state.entities.find((entity) => entity.kind === "beacon");
    if (!beacon) return;
    const bx = offsetX + beacon.x * scale;
    const by = offsetY + beacon.y * scale;
    const pulse = 0.55 + 0.45 * Math.sin(state.visual.fxFrame * 0.12);
    const haloRadius = Math.max(2, 6 * scale * (0.7 + 0.24 * pulse));
    const halo = ctx.createRadialGradient(bx, by, 0.4, bx, by, haloRadius);
    halo.addColorStop(0, withAlpha(tone.secondary, 0.18));
    halo.addColorStop(1, withAlpha(tone.secondary, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(bx, by, haloRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBattleFocusLanes({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const burst = Math.max(0, state.visual.battleImpactBurst || 0);
    const burstFocus = Math.min(1, burst / 8);
    const midY = offsetY + drawH * (burstFocus > 0 ? 0.53 : 0.5);
    const midX = offsetX + drawW * (0.22 + burstFocus * 0.16);
    const width = Math.max(1, Math.round(drawW * 0.002 * scale));
    ctx.strokeStyle = withAlpha(tone.secondary, 0.12 + 0.25 * burstFocus);
    ctx.lineWidth = Math.max(0.5, scale * 0.5);
    ctx.beginPath();
    ctx.moveTo(midX, midY - 8 * scale);
    ctx.lineTo(midX + drawW * 0.52, midY + 8 * scale);
    ctx.stroke();
    ctx.fillStyle = withAlpha(tone.accentPulse, 0.07 + 0.2 * burstFocus);
    ctx.fillRect(midX - width, midY - 6, width, 12);
    ctx.fillRect(offsetX + drawW * 0.52 - width, midY - 10, width, 12);
  }

  function drawBattleTurnPulse({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const battle = state.battle;
    if (!battle) return;
    const pulse = 0.5 + Math.sin(state.visual.fxFrame * 0.12 + battle.turn * 0.8) * 0.25;
    const turnBandY = offsetY + drawH * 0.18;
    const left = offsetX + drawW * 0.13;
    const right = offsetX + drawW * 0.87;
    const width = right - left;
    const active = (battle.turn % 2) + 1;
    const barPulse = 0.42 + pulse * 0.25;
    ctx.fillStyle = withAlpha(tone.secondary, 0.1);
    ctx.fillRect(left, turnBandY, width, Math.max(1, scale * 0.72));
    ctx.fillStyle = withAlpha(active % 2 ? tone.accentPulse : tone.lead, 0.22 * barPulse);
    ctx.fillRect(left, turnBandY, Math.max(2, width * Math.min(1, barPulse)), Math.max(1, scale * 0.72));
    ctx.fillStyle = tone.text;
    ctx.font = `${Math.max(6, Math.floor(scale * 4))}px Sora, sans-serif`;
    ctx.fillText(`T${battle.turn}`, left + 2 * scale, turnBandY + Math.max(2.8, 4.4 * scale));
  }

  function drawBattleImpactStreak({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const burst = Math.max(0, state.visual.battleImpactBurst || 0);
    if (burst <= 0) return;
    const severity = clamp(Number.isFinite(Number(state.visual.battleImpactSeverity))
      ? Number(state.visual.battleImpactSeverity)
      : 1, 1, 4);
    const burstFocus = Math.min(1, burst / 10);
    const direction = state.visual.battleImpactSide === "enemy" ? -1 : 1;
    const laneY = state.visual.battleImpactSide === "enemy" ? offsetY + drawH * 0.44 : offsetY + drawH * 0.56;
    const laneStart = direction === 1 ? offsetX + drawW * 0.17 : offsetX + drawW * 0.77;
    const laneWidth = Math.max(
      8,
      Math.round(drawW * 0.36 * (0.56 + burstFocus * 0.75) * (0.5 + severity * 0.12)),
    );
    const drift = Math.sin(state.visual.fxFrame * 0.36 + burst * 0.2) * scale * 3 * direction;
    const pulse = 0.14 + burstFocus * (0.16 + severity * 0.02);
    const primary = state.visual.battleImpactColor || tone.accentPulse;
    const secondary = tone.secondary;
    const edge = state.visual.battleImpactSide === "enemy" ? tone.secondary : tone.accentPulse;
    const x0 = laneStart + drift;
    const x1 = x0 + laneWidth * direction;
    const burstGlow = ctx.createLinearGradient(x0, laneY, x1, laneY);
    burstGlow.addColorStop(0, withAlpha(primary, 0.3 * pulse));
    burstGlow.addColorStop(0.5, withAlpha(secondary, 0.16 * pulse));
    burstGlow.addColorStop(1, withAlpha(edge, 0.06 * pulse));
    ctx.fillStyle = burstGlow;
    ctx.fillRect(
      Math.min(x0, x1),
      laneY - Math.max(1, scale * 0.9),
      Math.abs(x1 - x0),
      Math.max(1.6, scale * 2.2),
    );
    ctx.strokeStyle = withAlpha(primary, 0.26 + 0.16 * burstFocus + severity * 0.025);
    ctx.lineWidth = Math.max(1.3, scale * (0.95 + severity * 0.08));
    ctx.beginPath();
    ctx.moveTo(x0, laneY);
    ctx.lineTo(x1, laneY);
    ctx.stroke();
    ctx.strokeStyle = withAlpha(edge, 0.16 + 0.2 * burstFocus);
    ctx.lineWidth = Math.max(0.65, scale * 0.42);
    ctx.setLineDash([Math.max(1, scale * 2), Math.max(1, scale * 2.2)]);
    ctx.beginPath();
    ctx.moveTo(x0, laneY);
    ctx.lineTo(x1, laneY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawBattleImpactFlash({ tone, offsetX, offsetY, drawW, drawH, scale }) {
    const burst = Math.max(0, state.visual.battleImpactBurst || 0);
    if (burst <= 0) return;
    const severity = clamp(Number.isFinite(Number(state.visual.battleImpactSeverity))
      ? Number(state.visual.battleImpactSeverity)
      : 1, 1, 4);
    const burstFocus = Math.min(1, burst / 10);
    const isMinimal = isMinimalVisualPreset();
    const reducedMotion = prefersReducedMotion() || (state.visual && state.visual.visualProfileAuto === false && isMinimal);
    const motionScale = reducedMotion ? 0.22 : 1;
    const direction = state.visual.battleImpactSide === "enemy" ? -1 : 1;
    const centerY = state.visual.battleImpactSide === "enemy" ? offsetY + drawH * 0.42 : offsetY + drawH * 0.58;
    const impactX = (direction === 1 ? offsetX + drawW * 0.5 : offsetX + drawW * 0.5) + direction * drawW * 0.03;
    const impactY = centerY + Math.sin(state.visual.fxFrame * 0.42 + burst) * scale * 1.5 * motionScale * direction;
    const primary = state.visual.battleImpactColor || tone.accentPulse;
    const secondary = tone.secondary;
    const impactPulse = 0.2 + burstFocus * 0.2 + severity * 0.03;
    const flashLength = Math.max(
      20 * scale,
      drawW * 0.05 * (0.72 + burstFocus * (0.74 + severity * 0.06)),
    );
    const flashEndX = impactX + direction * flashLength;
    const flashGlow = ctx.createLinearGradient(impactX, impactY, flashEndX, impactY);
    flashGlow.addColorStop(0, withAlpha(primary, clamp(0.34 * impactPulse * motionScale, 0, 0.75)));
    flashGlow.addColorStop(1, withAlpha(secondary, clamp(0.09 * impactPulse * motionScale, 0, 0.42)));
    ctx.strokeStyle = flashGlow;
    ctx.lineWidth = Math.max(1.4, scale * 1.9 * (0.7 + burstFocus));
    ctx.beginPath();
    ctx.moveTo(impactX, impactY);
    ctx.lineTo(flashEndX, impactY);
    ctx.stroke();

    const ringRadius = Math.max(
      14,
      Math.round(
        Math.min(drawW, drawH) *
          (0.058 + burstFocus * 0.04 + severity * 0.012),
      ),
    );
    const ringPulse = 1 + Math.sin(state.visual.fxFrame * 0.3 + state.visual.battleImpactSeed) * (0.12 + severity * 0.02);
    const ring = ctx.createRadialGradient(impactX, impactY, 0.4, impactX, impactY, ringRadius * ringPulse);
    ring.addColorStop(0, withAlpha(primary, 0.22 * impactPulse * motionScale));
    ring.addColorStop(0.45, withAlpha(secondary, 0.11 * impactPulse * motionScale));
    ring.addColorStop(1, withAlpha(secondary, 0));
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(impactX, impactY, ringRadius * (1 + burstFocus * (0.35 + severity * 0.08)), 0, Math.PI * 2);
    ctx.fill();

    const sparks = Math.max(6, 6 + Math.floor(burstFocus * 6) + Math.floor(severity));
    for (let i = 0; i < sparks; i += 1) {
      const angle = state.visual.fxFrame * 0.14 + (state.visual.battleImpactSeed + i * 17) * 0.28;
      const radial = Math.max(
        scale * 2.5,
        ringRadius * (0.24 + i * (0.06 + burstFocus * 0.04) + severity * 0.02),
      );
      const drift = frameNoise(i * 7, state.visual.battleImpactSeed + i, 37) * Math.PI * 2;
      const px = impactX + Math.cos(angle + drift) * radial * motionScale;
      const py = impactY + Math.sin(angle * 0.9 + drift) * radial * 0.62 * motionScale;
      const sparkW = Math.max(0.9, scale * (1 + (i % 3) * 0.28));
      const sparkH = Math.max(0.9, scale * (1.9 - (i % 3) * 0.28));
      const phase = 1 - i / Math.max(1, sparks);
      const sparkAlpha = Math.max(
        0.03,
        0.16 * phase * (0.58 + burstFocus * 0.44 + severity * 0.06) * motionScale,
      );
      ctx.fillStyle = withAlpha(primary, sparkAlpha);
      ctx.beginPath();
      ctx.ellipse(px, py, sparkW, sparkH * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = withAlpha(secondary, sparkAlpha * 0.45);
      ctx.fillRect(px - sparkW * 0.2, py - sparkW * 0.3, sparkW * 0.4, sparkH * 0.6);
    }
  }

  function drawBattleCommandGrid({ tone, offsetX, offsetY, drawW, drawH, scale, t = 1 }) {
    const battle = state.battle;
    if (!battle) return;
    const bars = VISUAL_PIPELINE.effects.battlePulseBars;
    const pulse = (state.visual.fxFrame * 0.11 + battle.turn * 0.7) % 1;
    const laneTop = offsetY + drawH * 0.1;
    const laneBottom = offsetY + drawH * 0.85;
    for (let i = 0; i < bars; i += 1) {
      const x = offsetX + (i + 1) * (drawW / (bars + 1));
      const baseY = laneTop + ((i % 2) === 0 ? 0 : drawH * 0.18);
      const sweep = (pulse + i * 0.22) % 1;
      const w = Math.max(1, Math.round(scale * (0.8 + i * 0.05)));
      const y = laneTop + sweep * (laneBottom - laneTop);
      ctx.strokeStyle = withAlpha(i % 2 ? tone.secondary : tone.accentPulse, 0.07 + 0.03 * t);
      ctx.lineWidth = Math.max(0.5, 0.45 * scale);
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = withAlpha(tone.accentPulse, 0.08);
      ctx.fillRect(x - w * 0.5, y - (3 * scale), w, 2.5 * scale);
    }
  }

  function render() {
    if (!sceneCtx || !ctx) return;
    state.visual.renderQualityMode = state.visual.renderQualityMode || "smooth";
    state.visual.renderPolicy = resolveVisualPolicy();
    state.visual.accentLead = pickAccentLead(state.mode, state.mission, state.seed);
    state.visual.contrastMode = (SCENE_RECIPES[state.mode] && SCENE_RECIPES[state.mode].contrastMode) || "light";
    state.visual.fxProfile = VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const activeProfile = resolveActiveVfxProfile();
    assertSingleAccent(activeProfile);
    assertReadableContrast(activeProfile, sceneTone(state.mode));

    drawWorldScene();
    drawPostProcess(activeProfile);
    syncExternalControlsUI();
  }

  function update(dt) {
    state.frame += 1;
    state.visual.fxFrame += 1;
    state.visual.routePulsePhase = (state.visual.routePulsePhase + 0.022) % 1;
    state.visual.hubPulseOffset = (state.visual.hubPulseOffset + 0.008) % 1;
    state.visual.battleImpactBurst = Math.max(0, state.visual.battleImpactBurst - 1);
    const frameMs = Number.isFinite(state.visual.lastFrameMs) ? state.visual.lastFrameMs : FRAME_MS * 1000;
    if (!state.visual.frameWarnings) state.visual.frameWarnings = [];
    if (frameMs >= 40) {
      state.visual.frameWarnings.push(frameMs);
      const maxFrameWarnings = Math.max(1, state.visual.frameWarningLimit || 6);
      while (state.visual.frameWarnings.length > maxFrameWarnings) {
        state.visual.frameWarnings.shift();
      }
    } else if (state.visual.frameWarnings.length > 0) {
      state.visual.frameWarnings.shift();
    }
    const transition = state.visual && state.visual.modeTransition;
    if (transition && transition.duration > 0 && transition.timer > 0) {
      transition.timer = Math.max(0, transition.timer - Math.max(1, Math.round(dt * TARGET_FPS)));
    }
    const decayScale = Math.max(0, (dt || 1 / TARGET_FPS) * TARGET_FPS);
    decayVfxPulse("transition", 0.018 * decayScale);
    decayVfxPulse("modeShift", 0.022 * decayScale);
    decayVfxPulse("battle", 0.028 * decayScale);
    decayVfxPulse("ambient", 0.014 * decayScale);
    decayVfxPulse("split", 0.01 * decayScale);
    decayVfxPulse("camera", 0.02 * decayScale);
    if (state.mode === "title") {
      state.flash = Math.max(0, state.flash - dt);
      if (state.mode === "title" && state.messages.length === 0) state.messages = ["NET_TOKENS_GAME"];
    }
    if (state.mode === "hub") updateHub(dt);
    if (state.mode === "mission") updateMission(dt);
    if (state.mode === "battle") updateBattle(dt);
    maybeTransitionToHub(dt);

    if (state.mode === "hub" || state.mode === "mission" || state.mode === "result") {
      handlePlayerMovement(dt);
    }

    input.spaceEdge = false;
    input.leftEdge = false;
    input.rightEdge = false;
    input.upEdge = false;
    input.downEdge = false;
    input.confirmEdge = false;
    input.cancelEdge = false;
  }

  function step(dt) {
    update(dt);
    render();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(2, Math.floor(rect.width));
    const cssH = Math.max(2, Math.floor(rect.height));
    const deviceScale = window.devicePixelRatio || 1;
    canvas.width = Math.max(2, Math.floor(cssW * deviceScale));
    canvas.height = Math.max(2, Math.floor(cssH * deviceScale));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = resolveVisualPolicy() === "smooth";
    ctx.imageSmoothingQuality = "high";
  }

  function keyEvent(e, isDown) {
    const key = e.code;
    if (key === "ArrowLeft" || key === "KeyA") {
      setInputDown("left", "leftEdge", isDown);
    } else if (key === "ArrowRight" || key === "KeyD") {
      setInputDown("right", "rightEdge", isDown);
    } else if (key === "ArrowUp" || key === "KeyW") {
      setInputDown("up", "upEdge", isDown);
    } else if (key === "ArrowDown" || key === "KeyS") {
      setInputDown("down", "downEdge", isDown);
    } else if (key === "Space") {
      setInputDown("space", "spaceEdge", isDown);
      if (isDown && !input.confirmEdge) input.confirmEdge = true;
      if (isDown && state.mode === "title") {
        startFromTitle();
      }
    } else if (key === "Enter" && isDown) {
      if (isDown && !input.confirmEdge) input.confirmEdge = true;
      if (state.mode === "title") startFromTitle();
    } else if ((key === "Backspace" || key === "Escape") && isDown) {
      input.cancelEdge = true;
    } else if (key === "KeyH" && isDown) {
      state.ui.helpPinned = true;
      state.ui.helpVisible = !state.ui.helpVisible;
      syncExternalControlsUI();
    } else if (key === "KeyV" && isDown) {
      cycleVisualPreset();
    } else if (key === "KeyP" && isDown) {
      cycleVisualQualityProfile();
    } else if (key === "KeyF" && isDown) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    }
    if (key === "Escape" && !isDown && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if (
      isDown &&
      (key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "Space" ||
        key === "Enter" ||
        key === "Backspace" ||
        key === "KeyV" ||
        key === "KeyP")
    ) {
      e.preventDefault();
    }
  }

  function renderGameToText() {
    const hudMetrics = syncModeMetricsPayload();
    const visible = state.entities
      .filter((entity) => entity.x >= -20 && entity.x <= SIM_W + 20 && entity.y >= -20 && entity.y <= SIM_H + 20)
      .slice(0, 18)
      .map((entity) => ({
        kind: entity.kind,
        x: rounded(entity.x),
        y: rounded(entity.y),
        r: rounded(entity.r),
        species: entity.species ? entity.species.id : entity.enemySpeciesId || entity.kind,
        hp: entity.hp !== undefined ? entity.hp : undefined,
      }));

    const battlePayload = state.battle
      ? {
          active: true,
          phase: state.battle.phase,
          turn: state.battle.turn,
          actingSide: state.battle.actingSide,
          playerPet: (() => {
            const pet = activePlayerPet();
            return pet
              ? {
                  id: pet.id,
                  speciesId: pet.speciesId,
                  hp: pet.hp,
                  maxHp: pet.maxHp,
                  status: pet.status,
                  moves: pet.moves,
                }
              : null;
          })(),
          enemyPet: state.battle.enemyPet
            ? {
                speciesId: state.battle.enemyPet.speciesId,
                hp: state.battle.enemyPet.hp,
                maxHp: state.battle.enemyPet.maxHp,
                status: state.battle.enemyPet.status,
              }
            : null,
          options: {
            root: BATTLE_ROOT_ACTIONS,
            layer: state.battle.menu.layer,
          },
          logTail: state.battle.log.slice(-3),
        }
      : { active: false };

    return JSON.stringify({
      mode: state.mode,
      frame: state.frame,
      seed: state.seed,
      coordSystem: coordNote,
      player: {
        x: rounded(state.player.x),
        y: rounded(state.player.y),
        vx: rounded(state.player.vx),
        vy: rounded(state.player.vy),
        hp: state.player.hp,
      },
      planetId: state.selectedPlanet ? state.selectedPlanet.id : null,
      planetLockId: state.planetLockId,
      planetLockTimer: state.planetLockTimer,
      objective: state.objective.current,
      mission: state.mission
        ? {
            id: state.mission.planetId,
            task: state.mission.task.id,
            encounter: state.mission.encounter,
          }
        : null,
      entities: visible,
      capturedSpecies: Object.keys(state.objective.capturedSpecies).length,
      capturedCount: state.objective.capturedCount,
      party: {
        totalCaptured: Object.keys(state.petDex).length,
        partySize: state.party.length,
        aliveCount: alivePartyIds().length,
        activePetId: state.activePetId,
      },
      battle: battlePayload,
      score: state.score,
      modeFlags: {
        invulnFrames: state.player.invulnFrames,
        shootCd: state.player.shootCd,
        flash: rounded(state.flash),
      },
      ui: {
        helpVisible: helpOverlayVisible(),
        contextActions: externalActionsForMode(state.mode),
        objectiveHint: objectiveHintText(),
        metrics: {
          phase: hudMetrics.modePhase,
          threatScore: hudMetrics.threatScore,
          objectiveProgress: hudMetrics.objectiveProgress,
          enemyCount: hudMetrics.enemyCount,
          comboHint: hudMetrics.missionCombo,
          cooldownState: hudMetrics.missionCooldown,
          frameBudget: hudMetrics.frameBudget,
        },
        brand: {
          accentLead: state.visual.accentLead,
          contrastMode: state.visual.contrastMode,
          visualPreset: state.visual.vfxPreset,
          visualPresetLabel: visualPresetLabel(),
          visualProfile: resolveVisualQualityMode(),
          visualProfileLabel: resolveVisualProfileLabel(),
        },
        brandAudit: brandAuditSnapshot(),
      },
      assets: {
        total: spriteStatus.total,
        loaded: spriteStatus.loaded,
        missing: spriteStatus.missing,
      },
      messages: state.messages.slice(-2),
    });
  }

  window.render_game_to_text = renderGameToText;
  window.advanceTime = (ms) => {
    const durationMs = Number(ms);
    if (!Number.isFinite(durationMs) || durationMs <= 0) return Promise.resolve();
    const steps = Math.max(0, Math.round(durationMs / FRAME_MS));
    if (steps <= 0) return Promise.resolve();
    for (let i = 0; i < steps; i += 1) {
      step(1 / TARGET_FPS);
    }
    return Promise.resolve();
  };

  window.gameState = state;

  function startFromTitle() {
    if (state.mode !== "title") return;
    state.player.x = SIM_W / 2;
    state.player.y = SIM_H / 2;
    state.player.vx = 0;
    state.player.vy = 0;
    setMode("hub");
    state.messages = ["Booting hub", "Mission board online"];
  }

  startBtn.addEventListener("click", () => {
    startFromTitle();
  });
  if (controlsToggle) {
    controlsToggle.addEventListener("click", () => {
      state.ui.helpPinned = true;
      state.ui.helpVisible = !state.ui.helpVisible;
      syncExternalControlsUI();
    });
  }
  document.addEventListener("keydown", (e) => keyEvent(e, true));
  document.addEventListener("keyup", (e) => keyEvent(e, false));
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("blur", () => {
    input.left = false;
    input.right = false;
    input.up = false;
    input.down = false;
    input.space = false;
    input.leftEdge = false;
    input.rightEdge = false;
    input.upEdge = false;
    input.downEdge = false;
    input.spaceEdge = false;
    input.confirmEdge = false;
    input.cancelEdge = false;
  });
  applyReducedMotionState();
  bindReducedMotionPreference();

  initializeSpriteRegistry();
  seed(state.seed);
  state.hubs = generateHub(state.seed);
  resetGame();
  setMode("title");
  resizeCanvas();
  syncExternalControlsUI();
  state.messages = ["NET_TOKENS_GAME", "System ready"];
  render();

  let accumulator = 0;
  let last = performance.now();
  function loop(now) {
    const dt = (now - last) / 1000;
    last = now;
    state.visual.lastFrameMs = Number.isFinite(dt) ? Math.max(1, dt * 1000) : FRAME_MS * 1000;
    accumulator += dt;
    accumulator = Math.min(accumulator, 0.25);
    while (accumulator >= FRAME_MS / 1000) {
      update(FRAME_MS / 1000);
      accumulator -= FRAME_MS / 1000;
    }
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

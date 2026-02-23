(() => {
  "use strict";

  const SIM_W = 640;
  const SIM_H = 360;
  const INTERNAL_RENDER_SCALE = 4;
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
    defaultPolicy: "nearest",
    allowSmoothFallback: false,
    sceneScaleMode: "integer",
    hudLineHeight: 8,
    vfxProfiles: EFFECT_MODES,
    effects: {
      baseScanAlpha: 0.08,
      grainCount: 92,
      noiseCount: 84,
      routeGlowAlpha: 0.16,
      routePulseAlpha: 0.28,
      missionCometCount: 6,
      missionNebulaRows: 12,
      hubAtmosphereBands: 8,
      battlePulseBars: 3,
      creepLineCount: 18,
      riftStripeDensity: 6,
      staticWashDensity: 52,
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
      toneStrength: 1.08,
      motionAmp: 1.12,
      effectCap: 1.1,
      noiseDensity: 1.04,
      scanlineDensity: 1,
      scanlineStrength: 1,
      noiseSpeed: 1,
      bloom: 0.16,
      chromaShift: 0.02,
      jitterShift: 1,
      flickerShift: 1,
      vignetteBoost: 1,
      chromaticShift: 1,
      shakeBoost: 1,
    }),
    neon: Object.freeze({
      label: "NEON",
      particleDensity: 1.55,
      toneStrength: 1.25,
      motionAmp: 1.35,
      effectCap: 1.3,
      noiseDensity: 1.22,
      scanlineDensity: 1.25,
      scanlineStrength: 1.35,
      noiseSpeed: 1.12,
      bloom: 0.24,
      chromaShift: 0.06,
      jitterShift: 1.22,
      flickerShift: 1.5,
      vignetteBoost: 1.08,
      chromaticShift: 1.2,
      shakeBoost: 1.08,
    }),
    minimal: Object.freeze({
      label: "MINIMAL",
      particleDensity: 0.55,
      toneStrength: 0.75,
      motionAmp: 0.68,
      effectCap: 0.68,
      noiseDensity: 0.54,
      scanlineDensity: 0.62,
      scanlineStrength: 0.62,
      noiseSpeed: 0.8,
      bloom: 0.05,
      chromaShift: 0.0,
      jitterShift: 0.7,
      flickerShift: 0.35,
      vignetteBoost: 0.72,
      chromaticShift: 0.15,
      shakeBoost: 0.6,
    }),
  });

  const VISUAL_PRESET_ORDER = Object.freeze(["cinematic", "neon", "minimal"]);

  const BRAND_TOKENS = Object.freeze({
    COG_YELLOW: "#FCDC70",
    COG_BLUE: "#71BFDD",
    COG_MINT: "#82CC98",
    COG_PINK: "#F5B4BC",
    INK: "#101824",
    WHITE: "#FFFFFF",
    FOG: "#ECECE8",
    SHADOW: "rgba(16, 24, 36, 0.08)",
    SCANLINE: "rgba(16, 24, 36, 0.045)",
    NOISE: "rgba(16, 24, 36, 0.045)",
    HUD_PANEL: "rgba(236, 236, 232, 0.82)",
    SUBTLE_GRID: "rgba(16, 24, 36, 0.12)",
    ROUTE_STROKE: "rgba(16, 24, 36, 0.23)",
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
  const coordNote = "Origin top-left, +x right, +y down";

  const input = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    spaceEdge: false,
    upEdge: false,
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

  const SPRITE_ROOT = "/assets/sprites";
  const spriteManifest = (() => {
    const base = {
      player: `${SPRITE_ROOT}/astronaut.png`,
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

  function normalizeModeTransition(profile, mode) {
    if (!profile || !state.visual) return null;
    return {
      mode: mode || state.mode,
      timer: profile.timer || 0,
      duration: profile.duration || 0,
      fromMode: profile.fromMode || mode || state.mode,
      toMode: profile.toMode || mode || state.mode,
      transitionBlend: profile.transitionBlend || 0,
      accentColor: profile.accentColor || BRAND_TOKENS.COG_BLUE,
    };
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

  function resolveVisualPreset() {
    return VISUAL_PRESETS[resolveVisualPresetKey()];
  }

  function visualPresetLabel() {
    const preset = resolveVisualPreset();
    return preset && preset.label ? preset.label : "CINEMATIC";
  }

  function resolveModeVfxProfile(mode) {
    const selectedMode = mode || "title";
    const preset = resolveVisualPreset();
    const baseProfile = VISUAL_PIPELINE.vfxProfiles[selectedMode] || VISUAL_PIPELINE.vfxProfiles.title;
    const accentLead = baseProfile.accentColor || pickAccentLead(selectedMode, state.mission, state.seed);
    return {
      ...baseProfile,
      toneStrength: (baseProfile.toneStrength || 0) * (preset.toneStrength || 1),
      motionAmp: (baseProfile.motionAmp || 0) * (preset.motionAmp || 1) * (preset.noiseSpeed || 1),
      particles: Math.max(1, Math.round((baseProfile.particles || 0) * (preset.particleDensity || 1))),
      particleDensity: preset.particleDensity || 1,
      effectCap: (baseProfile.effectCap || 0) * (preset.effectCap || 1),
      noiseDensity: (baseProfile.noiseDensity || 1) * (preset.noiseDensity || 1),
      scanlineDensity: (baseProfile.scanlineDensity || 1) * (preset.scanlineDensity || 1),
      scanlineStrength: (baseProfile.scanlineStrength || 0.5) * (preset.scanlineStrength || 1),
      noiseSpeed: (baseProfile.noiseSpeed || 1) * (preset.noiseSpeed || 1),
      bloom: (baseProfile.bloom || 0) * (preset.bloom || 1),
      chromaShift: (baseProfile.chromaticSplit || 0) * (preset.chromaShift || 1) * (preset.chromaticShift || 1),
      frameJitter: (baseProfile.frameJitter || 0) * (preset.jitterShift || 1),
      shakeGain: (baseProfile.shakeGain || 0) * (preset.shakeBoost || 1),
      flickerChance: (baseProfile.flickerChance || 0) * (preset.flickerShift || 1),
      vignetteAmount: Math.min(0.14, (baseProfile.vignetteAmount || 0) * (preset.vignetteBoost || 1)),
      accentLead,
      accentColor: BRAND_TOKENS[accentLead] || BRAND_TOKENS.COG_BLUE,
      presetKey: resolveVisualPresetKey(),
      presetLabel: preset.label || "CINEMATIC",
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
    const chromaShift = Math.max(0, activeProfile.chromaShift || 0);
    if (chromaShift <= 0 || !postFxCtx) return scene;

    const shiftPx = Math.max(1, Math.round(chromaShift * 40));
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
    fetch(entry.src, { method: "HEAD", cache: "no-store" })
      .then((res) => {
        if (!res || !res.ok) {
          markSpriteUnavailable(entry);
          return;
        }
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          if (entry.state !== "loading") return;
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
      })
      .catch(() => markSpriteUnavailable(entry));
  }

  function markSpriteUnavailable(entry) {
    if (entry.state !== "loading") return;
    entry.state = "missing";
    spriteStatus.missing += 1;
    spriteStatus.loading -= 1;
    state.visual.useVectorFallback = spriteStatus.loading > 0 || spriteStatus.missing > 0;
  }

  function drawSpriteByKey(key, x, y, diameter, fallbackDraw = null) {
    const entry = spriteRegistry[key];
    const image = entry ? entry.image : null;
    if (entry && entry.state === "ready" && image && image.complete && image.naturalWidth > 0) {
      const snappedDiameter = Math.max(1, Math.round(diameter));
      const half = snappedDiameter * 0.5;
      const snapX = Math.round(x - half);
      const snapY = Math.round(y - half);
      sceneCtx.drawImage(image, snapX, snapY, snappedDiameter, snappedDiameter);
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
    if (entity.kind === "player") return Math.max(6, entity.r * 3.2);
    if (entity.kind === "alien") return Math.max(7, entity.r * 2.6);
    if (entity.kind === "enemy") return Math.max(8, entity.r * 3.3);
    if (entity.kind === "beacon") return Math.max(9, entity.r * 5.2);
    if (entity.kind === "probe") return Math.max(8, entity.r * 5.4);
    return Math.max(6, entity.r * 2.4);
  }

  function drawSpriteEntity(entity, fallbackDraw) {
    const tone = sceneTone(state.mode);
    const size = spriteSizeForEntity(entity);
    const prevAlpha = sceneCtx.globalAlpha;
    const capturedFade = entity.kind === "alien" && entity.captured ? 0.3 : 1;
    sceneCtx.globalAlpha = capturedFade;
    if (state.visual && state.visual.useVectorFallback) {
      if (fallbackDraw) fallbackDraw(tone);
      sceneCtx.globalAlpha = prevAlpha;
      return false;
    }
    const drawn = drawSpriteByKey(spriteKeyForEntity(entity), entity.x, entity.y, size, fallbackDraw);
    if (drawn && entity.kind === "alien" && entity.captured) {
      sceneCtx.fillStyle = withAlpha(tone.lead, 0.28);
      sceneCtx.beginPath();
      sceneCtx.arc(entity.x, entity.y, entity.r + 1, 0, Math.PI * 2);
      sceneCtx.fill();
    }
    sceneCtx.globalAlpha = prevAlpha;
    return drawn;
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
      renderQualityMode: "nearest",
      fxProfile: VISUAL_PIPELINE.vfxProfiles.title,
      vfxPreset: "cinematic",
      fxFrame: 0,
      routePulsePhase: 0,
      hubPulseOffset: 0,
      battleImpactBurst: 0,
      battleImpactSide: "neutral",
      vfxPulse: {
        transition: 0,
        modeShift: 0,
        battle: 0,
        ambient: 0,
        split: 0,
        camera: 0,
      },
      useVectorFallback: true,
      scaleMode: "nearest",
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
    const toneProfile = {
      primary: BRAND_TOKENS[governor.primary] || BRAND_TOKENS.COG_BLUE,
      secondary: governor.missionTint || BRAND_TOKENS[governor.secondary] || BRAND_TOKENS.COG_YELLOW,
      lead: BRAND_TOKENS[governor.primary] || BRAND_TOKENS.COG_BLUE,
      accentPulse: BRAND_TOKENS[governor.accentPulse] || BRAND_TOKENS.COG_BLUE,
      panelFill: BRAND_TOKENS[tone.panelFill] || BRAND_TOKENS.HUD_PANEL,
      edge: BRAND_TOKENS[tone.edgeToken] || BRAND_TOKENS.INK,
      surface: BRAND_TOKENS[tone.surface] || BRAND_TOKENS.WHITE,
      text: BRAND_TOKENS[tone.textToken] || BRAND_TOKENS.INK,
      subtle: BRAND_TOKENS[tone.subtleToken] || withAlpha(BRAND_TOKENS.INK, 0.2),
    };
    toneProfile.primary = profileLead;
    toneProfile.lead = profileLead;
    toneProfile.secondary = profileLead;
    toneProfile.accentPulse = profileLead;
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
        "Up/Down: choose",
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

  function externalActionsForMode(mode) {
    return contextActionsForMode(mode).filter((action) => !/^H:\s*help$/i.test(action));
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
    const visible = helpOverlayVisible();
    controlsPanel.classList.toggle("is-collapsed", !visible);
    controlsPanel.setAttribute("data-expanded", visible ? "true" : "false");
    controlsToggle.setAttribute("aria-pressed", visible ? "true" : "false");
    controlsToggle.textContent = visible ? "H: Hide Help" : "H: Show Help";

    const actions = externalActionsForMode(state.mode);
    controlsActions.textContent = "";
    for (const action of actions) {
      const item = document.createElement("li");
      item.textContent = action;
      controlsActions.appendChild(item);
    }
    controlsObjective.textContent = objectiveHintText();
  }

  function brandAuditSnapshot() {
    return {
      oneAccentLead: true,
      accentLead: state.visual.accentLead,
      secondaryTone: "active",
      toneDepth: "twoTone",
      glowEffects: state.visual.vfxPreset !== "minimal",
      heavyGradients: false,
      overlayWordCap: true,
      contrastMode: state.visual.contrastMode,
    };
  }

  function makePlanetSeed(base, index) {
    return (base ^ ((index + 1) * 2654435761)) >>> 0;
  }

  function hubBiomeByIndex(index) {
    return HUB_BIOMES[index % HUB_BIOMES.length];
  }

  function biomeAccentToken(biome) {
    if (biome === "Nix") return "COG_BLUE";
    if (biome === "Gloom") return "COG_PINK";
    if (biome === "Core") return "COG_YELLOW";
    if (biome === "Ash") return "COG_MINT";
    return "COG_BLUE";
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
    state.visual.battleImpactBurst = Math.min(14, Math.max(0, damage + 2));
    const attackerSpecies = activePlayerPet() && attacker.id === activePlayerPet().id;
    state.visual.battleImpactSide = attackerSpecies ? "player" : "enemy";
    queueVfxPulse("battle", 0.38, { scale: 1 + Math.min(0.9, damage / 16) });
    queueVfxPulse("camera", 0.18, { scale: 1 + Math.min(0.5, damage / 20) });
    if (damage >= 5) queueVfxPulse("split", 0.2);
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
    if (battle.menu.layer === "root") {
      if (input.upEdge) battle.menu.rootIndex = (battle.menu.rootIndex + BATTLE_ROOT_ACTIONS.length - 1) % BATTLE_ROOT_ACTIONS.length;
      if (input.downEdge) battle.menu.rootIndex = (battle.menu.rootIndex + 1) % BATTLE_ROOT_ACTIONS.length;
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
      if (input.upEdge) battle.menu.moveIndex = (battle.menu.moveIndex + moves.length - 1) % moves.length;
      if (input.downEdge) battle.menu.moveIndex = (battle.menu.moveIndex + 1) % moves.length;
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
      if (input.upEdge) battle.menu.switchIndex = (battle.menu.switchIndex + switchChoices.length - 1) % switchChoices.length;
      if (input.downEdge) battle.menu.switchIndex = (battle.menu.switchIndex + 1) % switchChoices.length;
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
  }

  function maybeKillEnemy(entity) {
    return entity;
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

  function drawHubFocusCard({ tone, palette, cardX, cardY, cardW, cardH, focused }) {
    const preview = makePlanetPreview(focused);
    const lockPulse = state.planetLockId === focused.id ? 0.78 : 0.43 + Math.sin(state.frame * 0.11) * 0.16;
    drawPanel(cardX - 1, cardY - 1, cardW + 2, cardH + 2, {
      fill: withAlpha(palette.panelFill, 0.16),
      edge: withAlpha(palette.accentPulse, 0.35),
      radius: 1,
    });
    sceneCtx.fillStyle = withAlpha(tone.accentPulse, 0.12);
    sceneCtx.fillRect(cardX + 3, cardY + 3, cardW - 6, cardH - 6);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "700 7px Sora, sans-serif";
    sceneCtx.fillText(focused.name, cardX + 4, cardY + 10);
    sceneCtx.font = "6px Sora, sans-serif";
    sceneCtx.fillStyle = toneTextShade(palette.text);
    sceneCtx.fillText(preview.taskText, cardX + 4, cardY + 18);
    sceneCtx.fillStyle = withAlpha(palette.secondary, 0.45);
    sceneCtx.fillRect(cardX + 4, cardY + 23, Math.max(22, preview.targetName.length * 2.3), 4);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.fillText(preview.targetName, cardX + 5, cardY + 26);
    sceneCtx.strokeStyle = withAlpha(palette.accentPulse, 0.38 + lockPulse * 0.1);
    sceneCtx.lineWidth = 0.7;
    sceneCtx.strokeRect(cardX + 1, cardY + 1, cardW, cardH);
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

    const driftA = Math.floor(state.frame * 0.2) % 8;
    for (let i = 0; i <= 18; i += 1) {
      const y = boardY + 7 + i * 11;
      const band = 0.11 + (i % 3) * 0.01;
      sceneCtx.strokeStyle = withAlpha(palette.subtle, band * 0.92);
      sceneCtx.lineWidth = i % 2 === 0 ? 0.55 : 0.38;
      sceneCtx.beginPath();
      sceneCtx.moveTo(boardX + 8 + driftA, y);
      sceneCtx.lineTo(boardX + boardW - 8 - driftA, y);
      sceneCtx.stroke();
    }
    for (let i = 0; i <= 11; i += 1) {
      const x = boardX + 6 + i * ((boardW - 14) / 11);
      sceneCtx.strokeStyle = withAlpha(palette.subtle, 0.1 + (i % 2) * 0.015);
      sceneCtx.lineWidth = i % 2 === 0 ? 0.48 : 0.26;
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

      for (let k = 0; k < 4; k += 1) {
        const t = (routeFlow + k / 4) % 1;
        const mx = current.x + (next.x - current.x) * t;
        const my = current.y + (next.y - current.y) * t;
        const flick = ((state.frame * 0.2 + k * 1.5) % 3) < 1.35 ? 1 : 0.45;
        sceneCtx.fillStyle = withAlpha(routeColor, (baseAlpha + 0.08) * flick);
        sceneCtx.fillRect(mx - 1, my - 1, 2, 2);
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
      const cardW = 124;
      const cardH = 30;
      const targetSide = planet.x > SIM_W / 2;
      const cardX = clamp(Math.floor(targetSide ? planet.x - cardW - 10 : planet.x + 10), boardX + 6, boardX + boardW - cardW - 6);
      const cardY = clamp(Math.floor(planet.y - 1), boardY + 16, SIM_H - cardH - 6);
      const cardTone = isFocused || isLocked ? withAlpha(palette.panelFill, 0.96) : withAlpha(palette.panelFill, 0.86);
      const cardEdge = isFocused || isLocked ? palette.secondary : palette.edge;
      drawPanel(cardX, cardY, cardW, cardH, { fill: cardTone, edge: cardEdge, radius: 1 });

      drawSpriteByKey(
        "planet",
        planet.x,
        planet.y,
        Math.max(planet.r * 4.6, 18),
        () => {
          sceneCtx.fillStyle = withAlpha(palette.surface, 0.55);
          sceneCtx.beginPath();
          sceneCtx.arc(planet.x, planet.y, planet.r + 1.6, 0, Math.PI * 2);
          sceneCtx.fill();
          sceneCtx.strokeStyle = palette.panelEdge;
          sceneCtx.lineWidth = 1;
          sceneCtx.stroke();
        }
      );

      sceneCtx.fillStyle = withAlpha(palette.lead, isFocused || isLocked ? 0.28 : 0.16);
      sceneCtx.beginPath();
      sceneCtx.arc(planet.x, planet.y, planet.r + 4.5 * (pulse * orbitPulse), 0, Math.PI * 2);
      sceneCtx.fill();

      sceneCtx.strokeStyle = isFocused || isLocked ? palette.edge : palette.lead;
      sceneCtx.lineWidth = isFocused || isLocked ? 2 : 1.2;
      sceneCtx.beginPath();
      sceneCtx.arc(planet.x, planet.y, planet.r + 4.7, 0, Math.PI * 2);
      sceneCtx.stroke();

      const preview = makePlanetPreview(planet);
      const missionChip = `${preview.taskText} • ${preview.targetName}`;
      const chipText = `${preview.taskText}`;
      const chipAccent = withAlpha(tone.secondary, 0.28);
      const leftPad = cardX + 4;
      const textY = cardY + 8;
      sceneCtx.fillStyle = palette.text;
      sceneCtx.font = "600 8px Sora, sans-serif";
      sceneCtx.fillText(planet.name, leftPad, textY);
      sceneCtx.font = "7px Sora, sans-serif";
      sceneCtx.fillStyle = toneTextShade(palette.text);
      sceneCtx.fillText(planet.biome, leftPad, textY + 8);
      sceneCtx.fillStyle = toneTextShade(palette.secondary);
      sceneCtx.fillRect(leftPad, textY + 14.5, Math.max(20, chipText.length * 2.9), 5);
      sceneCtx.fillStyle = tone.text;
      sceneCtx.fillText(chipText, leftPad + 1.5, textY + 18);
      sceneCtx.fillStyle = chipAccent;
      sceneCtx.fillText(preview.targetName, leftPad + 60, textY + 18);

      if (isLocked && state.planetLockTimer > 0) {
        sceneCtx.fillStyle = palette.lead;
        sceneCtx.fillText(`Lock ${state.planetLockTimer}`, leftPad, cardY + 28);
      } else if (isFocused) {
        sceneCtx.fillStyle = palette.accentPulse;
        sceneCtx.fillText("Docked", leftPad, cardY + 28);
      }
    }

    if (focused) {
      const focusSide = focused.x > SIM_W / 2;
      const focusCardW = 138;
      const focusCardH = 30;
      const focusCardX = clamp(
        Math.floor(focusSide ? focused.x - focusCardW - 14 : focused.x + 14),
        boardX + 6,
        boardX + boardW - focusCardW - 6,
      );
      const focusCardY = clamp(Math.floor(focused.y + 12), boardY + 6, boardY + boardH - focusCardH - 6);
      drawHubFocusCard({
        tone,
        palette,
        cardX: focusCardX,
        cardY: focusCardY,
        cardW: focusCardW,
        cardH: focusCardH,
        focused,
      });
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

    drawSpriteByKey(
      "ship",
      shipX,
      shipY,
      24,
      () => {
        sceneCtx.fillStyle = toneTextShade(palette.panelEdge);
        sceneCtx.beginPath();
        sceneCtx.moveTo(shipX - 6, shipY - 2);
        sceneCtx.lineTo(shipX + 6, shipY - 2);
        sceneCtx.lineTo(shipX + 10, shipY + 7);
        sceneCtx.lineTo(shipX - 10, shipY + 7);
        sceneCtx.closePath();
        sceneCtx.fill();
        sceneCtx.strokeStyle = palette.edge;
        sceneCtx.lineWidth = 1;
        sceneCtx.stroke();
      }
    );
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
      drawMissionStatusStrip({ tone });
    }

    drawHud();
  }

  function drawMissionStatusStrip({ tone }) {
    const mission = state.mission;
    const objective = state.objective.current;
    if (!mission || !objective) return;
    const barY = SIM_H - 34;
    const hudH = 12;
    const panelY = barY - 3;
    const taskX = 12;
    const targetX = 156;
    const statusX = 318;
    const baseY = barY + 7;
    const statReady = objective.taskDone ? "Ready" : "In progress";
    const targetTone = mission.target ? speciesForId(mission.target.id).color : tone.accentPulse;
    const targetPulse = 0.55 + Math.sin(state.visual.fxFrame * 0.1 + mission.task.targetValue) * 0.2;

    sceneCtx.fillStyle = withAlpha(tone.panelFill, 0.94);
    sceneCtx.fillRect(4, panelY, SIM_W - 8, hudH);
    sceneCtx.strokeStyle = withAlpha(tone.edge, 0.32);
    sceneCtx.lineWidth = 1;
    sceneCtx.strokeRect(4, panelY, SIM_W - 8, hudH);

    const captureRatio = Math.min(1, objective.targetCaptured / Math.max(1, objective.targetRequired));
    const clearWaveRatio = mission.task.id === "clear_wave"
      ? Math.max(0, 1 - objective.enemyCount / Math.max(1, mission.enemyTarget || mission.task.targetValue || 1))
      : 0;
    const taskRatio = objective.taskDone ? 1 : clearWaveRatio;
    sceneCtx.fillStyle = withAlpha(tone.surface, 0.74);
    sceneCtx.fillRect(taskX + 2, barY + 2, 120, 8);
    sceneCtx.fillStyle = withAlpha(tone.secondary, 0.55);
    sceneCtx.fillRect(taskX + 2, barY + 2, 120 * captureRatio * taskRatio, 8);
    sceneCtx.fillStyle = withAlpha(tone.accentPulse, Math.max(0.22, targetPulse * 0.18));
    sceneCtx.fillRect(taskX + 2, barY + 2, 120 * captureRatio, 8);

    sceneCtx.fillStyle = withAlpha(tone.text, 0.88);
    sceneCtx.font = "7px Sora, sans-serif";
    sceneCtx.fillText(`Task: ${mission.task.text}`, taskX + 124, baseY);
    sceneCtx.fillStyle = withAlpha(targetTone, targetPulse);
    sceneCtx.fillText(`Target ${objective.targetName}`, targetX + 14, baseY);
    sceneCtx.fillText(`x${objective.targetCaptured}/${objective.targetRequired}`, targetX + 82, baseY);
    sceneCtx.fillStyle = tone.text;
    if (mission.task.id === "clear_wave") {
      sceneCtx.fillText(`Enemies ${Math.max(0, objective.enemyCount)}`, statusX, baseY);
    } else if (mission.task.id === "hold_sector") {
      const holdPct = Math.round((state.objective.holdProgress / mission.task.targetValue) * 100);
      sceneCtx.fillText(`Hold ${holdPct}%`, statusX, baseY);
    } else if (mission.task.id === "activate_beacon") {
      const beacon = state.entities.find((entity) => entity.kind === "beacon");
      sceneCtx.fillText(`Beacon ${beacon && beacon.activated ? "ready" : "off"}`, statusX, baseY);
    } else if (mission.task.id === "escort_probe") {
      const probe = state.entities.find((entity) => entity.kind === "probe");
      sceneCtx.fillText(`Probe ${probe && probe.attached ? "linked" : "free"}`, statusX, baseY);
    }
    sceneCtx.fillText(`Status ${statReady}`, statusX - 26, panelY + 9);

    if (taskRatio > 0 && objective.targetCaptured >= objective.targetRequired) {
      const readyX = 570;
      const readyY = panelY + 5;
      const readyPulse = 0.7 + Math.sin(state.visual.fxFrame * 0.22) * 0.22;
      sceneCtx.fillStyle = withAlpha(tone.secondary, Math.max(0.15, readyPulse * 0.25));
      sceneCtx.fillRect(readyX, readyY, 36, 6);
      sceneCtx.fillStyle = tone.text;
      sceneCtx.fillText("READY", readyX + 3, panelY + 9);
    }
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
    drawPanel(8, 8, SIM_W - 16, SIM_H - 16);
    sceneCtx.fillStyle = tone.edge;
    sceneCtx.fillRect(8, 8, SIM_W - 16, 4);
    const battleGlow = Math.floor(4.2 * (0.7 + ambient * 0.6));
    sceneCtx.fillStyle = withAlpha(tone.edge, 0.15);
    for (let i = 0; i < battleGlow; i += 1) {
      sceneCtx.fillRect(12 + i * 1.2, 22, 1, 56);
    }

    drawPanel(18, 22, 122, 52);
    drawPanel(180, 94, 122, 52);

    drawSpriteByKey(`alien-${enemy.speciesId}`, 254, 52, 22, () => drawAlienFallback({ x: 254, y: 52, r: 6, species: enemySpecies }));
    drawSpriteByKey(`alien-${player.speciesId}`, 66, 122, 22, () => drawAlienFallback({ x: 66, y: 122, r: 6, species: playerSpecies }));

    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "700 8px Sora, sans-serif";
    sceneCtx.fillText(enemySpecies.name, 22, 34);
    sceneCtx.fillText(playerSpecies.name, 184, 106);
    sceneCtx.font = "7px Sora, sans-serif";
    sceneCtx.fillText(`Lv ${enemy.level}`, 22, 44);
    sceneCtx.fillText(`Lv ${player.level}`, 184, 116);
    sceneCtx.fillText(`Turn ${battle.turn}`, 254, 18);

    sceneCtx.fillStyle = tone.panelFill;
    sceneCtx.fillRect(22, 50, 108, 6);
    sceneCtx.fillRect(184, 122, 108, 6);
    sceneCtx.fillStyle = enemyAccent;
    sceneCtx.fillRect(22, 50, Math.floor(easedEnemyHp * 108), 6);
    sceneCtx.fillStyle = playerAccent;
    sceneCtx.fillRect(184, 122, Math.floor(easedPlayerHp * 108), 6);
    sceneCtx.fillStyle = withAlpha(playerAccent, 0.4);
    sceneCtx.fillRect(184, 122, Math.max(2, Math.floor(easedPlayerHp * 108 * ambient * 0.25)), 6);
    sceneCtx.fillStyle = withAlpha(enemyAccent, 0.16);
    sceneCtx.fillRect(22, 50, Math.max(2, Math.floor((easedEnemyHp + 0.04) * 108 * ambient * 0.22)), 6);
    sceneCtx.strokeStyle = tone.text;
    sceneCtx.strokeRect(22, 50, 108, 6);
    sceneCtx.strokeRect(184, 122, 108, 6);

    drawPanel(8, 138, 182, 34);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "7px Sora, sans-serif";
    const logs = battle.log.slice(-3);
    for (let i = 0; i < logs.length; i += 1) {
      sceneCtx.fillText(logs[i], 14, 150 + i * 8);
    }

    drawPanel(196, 138, 116, 34);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "700 7px Sora, sans-serif";
    if (battle.menu.layer === "root") {
      for (let i = 0; i < BATTLE_ROOT_ACTIONS.length; i += 1) {
      if (i === battle.menu.rootIndex) {
          sceneCtx.fillStyle = playerAccent;
          sceneCtx.fillRect(200, 145 + i * 8 - 5, 3, 3);
        }
        sceneCtx.fillStyle = tone.text;
        sceneCtx.fillText(BATTLE_ROOT_ACTIONS[i], 206, 145 + i * 8);
      }
    } else if (battle.menu.layer === "fight") {
      const moves = player.moves;
      for (let i = 0; i < moves.length; i += 1) {
        const move = MOVE_DB[moves[i]];
        if (i === battle.menu.moveIndex) {
          sceneCtx.fillStyle = playerAccent;
          sceneCtx.fillRect(200, 145 + i * 7 - 5, 3, 3);
        }
        sceneCtx.fillStyle = tone.text;
        sceneCtx.fillText(move ? move.name : moves[i], 206, 145 + i * 7);
      }
    } else if (battle.menu.layer === "switch") {
      const candidates = alivePartyIds();
      for (let i = 0; i < candidates.length; i += 1) {
        const pet = petById(candidates[i]);
        if (!pet) continue;
        if (i === battle.menu.switchIndex) {
          sceneCtx.fillStyle = playerAccent;
          sceneCtx.fillRect(200, 145 + i * 8 - 5, 3, 3);
        }
        sceneCtx.fillStyle = tone.text;
        sceneCtx.fillText(speciesForId(pet.speciesId).name, 206, 145 + i * 8);
      }
    }
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
    const hudH = 12;
    const hudX = 6;
    const hudY = SIM_H - hudH - 4;
    const presetText = `Preset ${visualPresetLabel()}`;
    sceneCtx.fillStyle = tone.panelFill;
    sceneCtx.fillRect(hudX, hudY, SIM_W - hudX * 2, hudH);
    sceneCtx.strokeStyle = tone.edge;
    sceneCtx.lineWidth = 1;
    sceneCtx.strokeRect(hudX, hudY, SIM_W - hudX * 2, hudH);
    sceneCtx.fillStyle = tone.text;
    sceneCtx.font = "7px Sora, sans-serif";
    const text = `HP ${state.player.hp}/${state.player.maxHp}  Score ${state.score}  Planets ${state.completedPlanets}`;
    sceneCtx.fillText(text, hudX + 6, hudY + 9);
    const lastMessage = state.messages[state.messages.length - 1] || "";
    if (lastMessage) sceneCtx.fillText(lastMessage, hudX + 6, hudY + 6);
    const presetX = SIM_W - 8 - sceneCtx.measureText(presetText).width;
    sceneCtx.fillText(presetText, presetX, hudY + 9);
  }

  function drawPostProcess(profileOverride = null) {
    const tone = paletteForMode(state.mode);
    const displayW = canvas.width;
    const displayH = canvas.height;
    const rawScale = Math.min(displayW / SIM_W, displayH / SIM_H);
    const renderPolicy = resolveVisualPolicy();
    const scale = resolveRenderScale(rawScale, displayW, displayH);
    const drawW = SIM_W * scale;
    const drawH = SIM_H * scale;
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
    const jitter = renderPolicy === "smooth"
      ? (frameNoise(97, state.frame, 13) - 0.5) * 0.5 * (sourceProfile.frameJitter || 0)
      : 0;
    const frameSource = resolvePostProcessSourceCanvas(sourceProfile);
    const flickerChance = clamp((modeProfile.flickerChance || 0) * (0.85 + vfxPulses.battle * 1.1), 0, 0.22);
    const activeFlicker = frameNoise(11, state.visual.fxFrame, 17) < flickerChance
      ? withAlpha(BRAND_TOKENS.INK, 0.07 + vfxPulses.battle * 0.03)
      : null;
    const baseNoiseAlpha =
      (state.mode === "hub" ? 0.15 : state.mode === "mission" ? 0.12 : 0.1) *
      modeProfile.noiseDensity *
      (0.85 + vfxPulses.ambient * 0.45 + transitionPulse * 0.25);
    const driftPulse = (state.frame * 0.015 + state.seed * 0.0000001) % 1;
    const orbitKick = (Math.sin(state.visual.fxFrame * 0.09) + 1) * (0.12 + vfxPulses.camera * 0.16 + transitionPulse * 0.06);

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

    const vignette = ctx.createLinearGradient(offsetX, offsetY, offsetX, offsetY + drawH);
    vignette.addColorStop(0, withAlpha(tone.text, 0.03 + transitionPulse * 0.02 + (modeProfile.bloom || 0) * 0.04 + vfxPulses.ambient * 0.02));
    vignette.addColorStop(0.5, withAlpha(tone.text, 0.008));
    vignette.addColorStop(1, withAlpha(tone.text, 0.03 + transitionPulse * 0.02 + (modeProfile.bloom || 0) * 0.04 + vfxPulses.ambient * 0.02));
    ctx.fillStyle = vignette;
    ctx.fillRect(offsetX, offsetY, drawW, drawH);
    ctx.strokeStyle = withAlpha(tone.text, 0.24);
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY, drawW, drawH);
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
  }) {
    const modeProfile = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const frame = state.frame;
    const pulses = resolveVfxPulses();
    const starMotion = modeProfile.motionAmp !== undefined ? modeProfile.motionAmp : 0.16;
    const starCount = Math.max(
      14,
      Math.round(
        (state.mode === "hub" ? 66 : state.mode === "mission" ? 46 : 34) *
          (modeProfile.effectCap || 1) *
          (1 + 0.18 * pulses.ambient + 0.1 * transitionPulse) *
          (
            modeProfile.particles /
              (VISUAL_PIPELINE.vfxProfiles[state.mode] && VISUAL_PIPELINE.vfxProfiles[state.mode].particles
                ? VISUAL_PIPELINE.vfxProfiles[state.mode].particles
                : 1) || 1
          )
      )
    );
    const toneStrength = modeProfile.toneStrength !== undefined ? modeProfile.toneStrength : 0.16;

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

    if (state.mode === "hub") {
      drawHubRouteFlow({ tone, offsetX, offsetY, drawW, drawH, scale });
      drawHubDeckAtmosphere({ tone, offsetX, offsetY, drawW, drawH, scale });
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

    if (state.mode === "mission" || state.mode === "battle" || state.mode === "hub") {
      drawPostProcessStaticWash({
        tone,
        offsetX,
        offsetY,
        drawW,
        drawH,
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
    const scanAlpha =
      (state.mode === "battle" ? 0.065 : 0.055) *
      toneStrength *
      (modeProfile.scanlineDensity || 1) *
      (1 + pulses.battle * 0.28 + pulses.modeShift * 0.18 + transitionPulse * 0.12);
    for (let y = 0; y < drawH; y += scanStep) {
      if (pulses.ambient > 0.6 && frame % 97 < 1) continue;
      const sine = Math.sin((frame + y * 0.2) / 11);
      const dy = offsetY + y + (state.mode === "battle" ? 0.8 : 0.4) * sine;
      const stripe = Math.max(0.5, 0.25 + (((frame + y + Math.floor(pulses.ambient * 3)) % 4) * 0.08));
      ctx.fillStyle = withAlpha(tone.subtle, scanAlpha * stripe);
      ctx.fillRect(offsetX, dy, drawW, 1);
    }

    const noiseCount = Math.round(VISUAL_PIPELINE.effects.noiseCount * (modeProfile.noiseDensity || 1));
    for (let i = 0; i < noiseCount; i++) {
      const nx = frameNoise(i * 13, frame, 19);
      const ny = frameNoise(i * 17, frame, 23);
      const wobble = ((i % 3) - 1) * 0.4;
      const drift = (state.mode === "mission" ? 1 : 0.2) * Math.sin(frame * 0.11 + i);
      const noiseBlend = withAlpha(
        tone.subtle,
        baseNoiseAlpha * (state.mode === "mission" ? 0.92 : 0.74) * (0.82 + pulses.ambient * 0.24 + pulses.battle * 0.12),
      );
      ctx.fillStyle = noiseBlend;
      const dot = 1 + Math.floor(scale * 0.5);
      ctx.fillRect(offsetX + Math.floor(nx * drawW) + wobble + drift, offsetY + Math.floor(ny * drawH), dot, dot);
    }

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
      profile: modeProfile,
      orbitPulse,
    });
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

  function drawPostProcessBloom({ tone, offsetX, offsetY, drawW, drawH, profile, orbitPulse }) {
    const pulses = resolveVfxPulses();
    const bloomStrength = (profile.bloom || 0) * (0.5 + orbitPulse) * (1 + pulses.battle * 0.12 + pulses.modeShift * 0.2);
    if (bloomStrength <= 0) return;
    const glow = ctx.createRadialGradient(
      offsetX + drawW / 2,
      offsetY + drawH / 2,
      Math.max(6, Math.min(drawW, drawH) * 0.08),
      offsetX + drawW / 2,
      offsetY + drawH / 2,
      Math.max(drawW, drawH) * 0.7,
    );
    glow.addColorStop(0, withAlpha(tone.accentPulse, 0.0));
    glow.addColorStop(0.42, withAlpha(tone.secondary, 0.09 * bloomStrength));
    glow.addColorStop(1, withAlpha(tone.secondary, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(offsetX, offsetY, drawW, drawH);
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

  function drawPostProcessChromaticBleed({ tone, offsetX, offsetY, drawW, drawH, profile, pulses, transitionPulse }) {
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
      const bandH = Math.max(1, Math.floor(0.8 + scale * (0.6 + (i % 4) * 0.3)));
      const drift = Math.sin(state.visual.fxFrame * 0.16 + i * 1.5) * (scale * 1.2);
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

  function drawPostProcessStaticWash({ tone, offsetX, offsetY, drawW, drawH, pulses, transitionPulse }) {
    const density = clamp(
      VISUAL_PIPELINE.effects.staticWashDensity *
        (0.4 + pulses.battle * 0.5 + pulses.ambient * 0.4 + transitionPulse * 0.2),
      0,
      140,
    );
    const noiseDensity = Math.round(density / 4);
    const salt = 17 + Math.round(state.visual.fxFrame * 0.6);
    for (let i = 0; i < noiseDensity; i += 1) {
      const nx = frameNoise(i * 37, state.visual.fxFrame, salt);
      const ny = frameNoise(i * 41, state.visual.fxFrame, salt + 11);
      const noiseAlpha = 0.02 + pulses.battle * 0.04 + transitionPulse * 0.03;
      const dot = 1 + Math.floor(Math.max(1, drawW / 640));
      ctx.fillStyle = withAlpha(tone.subtle, noiseAlpha);
      ctx.fillRect(offsetX + Math.floor(nx * drawW), offsetY + Math.floor(ny * drawH), dot, dot);
    }
  }

  function drawModeFrameChrome({ tone, offsetX, offsetY, drawW, drawH, scale, orbitPulse, profile, transitionPulse = 0 }) {
    const budget = profile || VISUAL_PIPELINE.vfxProfiles[state.mode] || VISUAL_PIPELINE.vfxProfiles.title;
    const pulses = resolveVfxPulses();
    const edgePulse = 0.5 + Math.sin(state.visual.fxFrame * 0.11) * 0.28;
    const accentPulse = Math.min(1, edgePulse + (budget.toneStrength || 0));
    const lineStep = Math.max(2, Math.floor(scale * 1.8));
    const frameW = Math.max(1, Math.round(scale * 1.2));
    const framePulse = 0.12 + 0.24 * accentPulse + (budget.bloom || 0) * 0.08;
    ctx.strokeStyle = withAlpha(tone.edge, Math.min(0.42, framePulse));
    ctx.lineWidth = frameW;
    ctx.strokeRect(offsetX + 1.2, offsetY + 1.2, drawW - 2.4, drawH - 2.4);
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
    const edgeVignette = Math.max(0.01, 0.03 + budget.vignetteAmount * 0.2 + transitionPulse * 0.03 + pulses.ambient * 0.02);
    ctx.fillStyle = withAlpha(tone.text, edgeVignette);
    ctx.fillRect(offsetX, offsetY, drawW, 1.1 * scale);
    ctx.fillRect(offsetX, offsetY + drawH - 1.1 * scale, drawW, 1.1 * scale);
    ctx.fillRect(offsetX, offsetY, 1.1 * scale, drawH);
    ctx.fillRect(offsetX + drawW - 1.1 * scale, offsetY, 1.1 * scale, drawH);

    const riftPulse = clamp(pulses.ambient + transitionPulse + pulses.modeShift * 0.3, 0, 1.3);
    if (riftPulse > 0.2) {
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
    const laneStart = offsetX + drawW * 0.19;
    const laneY = state.visual.battleImpactSide === "enemy" ? offsetY + drawH * 0.44 : offsetY + drawH * 0.56;
    const width = Math.max(2, Math.round(drawW * 0.58 * Math.min(1, burst / 10)));
    const dash = Math.max(1, Math.round(scale * 1.2));
    const x = laneStart + Math.sin(state.frame * 0.36 + burst * 0.2) * scale * 3;
    const hue = state.visual.battleImpactSide === "enemy" ? tone.secondary : tone.accentPulse;
    const burstGlow = ctx.createLinearGradient(x, laneY, x + width, laneY);
    burstGlow.addColorStop(0, withAlpha(hue, 0.18));
    burstGlow.addColorStop(1, withAlpha(hue, 0.01));
    ctx.fillStyle = burstGlow;
    ctx.fillRect(x, laneY, width, dash);
    ctx.strokeStyle = withAlpha(hue, 0.35);
    ctx.lineWidth = Math.max(0.6, scale * 0.55);
    ctx.beginPath();
    ctx.moveTo(x, laneY);
    ctx.lineTo(x + width, laneY);
    ctx.stroke();
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
    state.visual.renderQualityMode = state.visual.renderQualityMode || "nearest";
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
      input.left = isDown;
    } else if (key === "ArrowRight" || key === "KeyD") {
      input.right = isDown;
    } else if (key === "ArrowUp" || key === "KeyW") {
      input.up = isDown;
      if (isDown) input.upEdge = true;
    } else if (key === "ArrowDown" || key === "KeyS") {
      input.down = isDown;
      if (isDown) input.downEdge = true;
    } else if (key === "Space") {
      input.space = isDown;
      if (isDown) {
        input.spaceEdge = true;
        input.confirmEdge = true;
      }
      if (isDown && state.mode === "title") {
        startFromTitle();
      }
    } else if (key === "Enter" && isDown) {
      input.confirmEdge = true;
      if (state.mode === "title") startFromTitle();
    } else if ((key === "Backspace" || key === "Escape") && isDown) {
      input.cancelEdge = true;
    } else if (key === "KeyH" && isDown) {
      state.ui.helpPinned = true;
      state.ui.helpVisible = !state.ui.helpVisible;
      syncExternalControlsUI();
    } else if (key === "KeyV" && isDown) {
      cycleVisualPreset();
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
        key === "KeyV")
    ) {
      e.preventDefault();
    }
  }

  function renderGameToText() {
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
          enemyPet: {
            speciesId: state.battle.enemyPet.speciesId,
            hp: state.battle.enemyPet.hp,
            maxHp: state.battle.enemyPet.maxHp,
            status: state.battle.enemyPet.status,
          },
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
        contextActions: contextActionsForMode(state.mode),
        objectiveHint: objectiveHintText(),
        brand: {
          accentLead: state.visual.accentLead,
          contrastMode: state.visual.contrastMode,
          visualPreset: state.visual.vfxPreset,
          visualPresetLabel: visualPresetLabel(),
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
    const steps = Math.max(1, Math.round(ms / FRAME_MS));
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
    input.left = input.right = input.up = input.down = input.space = false;
    input.spaceEdge = input.upEdge = input.downEdge = input.confirmEdge = input.cancelEdge = false;
  });

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
    accumulator += dt;
    const clamped = Math.min(accumulator, 0.25);
    while (accumulator >= FRAME_MS / 1000) {
      update(FRAME_MS / 1000);
      accumulator -= FRAME_MS / 1000;
    }
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

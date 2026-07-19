import { Decimal } from "./decimal";
import { OFFLINE_CAP_HOURS, SAVE_KEY, SAVE_VERSION } from "./constants";
import { createInitialState, recomputeNextCosts, type GameState } from "./state";
import { totalProductionPerSec } from "./formulas";

/** Serialisierbare Form: alle Decimals als Strings. */
interface SavePayload {
  version: number;
  state: unknown;
}

function decToStr(d: Decimal): string {
  return d.toString();
}

function serialize(state: GameState): string {
  const gens: Record<string, { owned: number; nextCost: string }> = {};
  for (const id in state.generators) {
    gens[id] = {
      owned: state.generators[id].owned,
      nextCost: decToStr(state.generators[id].nextCost),
    };
  }
  const payload: SavePayload = {
    version: SAVE_VERSION,
    state: {
      h: decToStr(state.h),
      runEarnedH: decToStr(state.runEarnedH),
      runSeconds: state.runSeconds,
      elements: {
        He: decToStr(state.elements.He),
        Li: decToStr(state.elements.Li),
        Be: decToStr(state.elements.Be),
      },
      particles: {
        protons: decToStr(state.particles.protons),
        neutrons: decToStr(state.particles.neutrons),
        electrons: decToStr(state.particles.electrons),
        positrons: decToStr(state.particles.positrons),
      },
      ae: decToStr(state.ae),
      kelvin: decToStr(state.kelvin),
      gravitons: decToStr(state.gravitons),
      ignited: state.ignited,
      autoFusion: state.autoFusion,
      unlocked: { ...state.unlocked },
      generators: gens,
      clickUpgrades: [...state.clickUpgrades],
      generatorUpgrades: [...state.generatorUpgrades],
      achievements: [...state.achievements],
      totalClicks: state.totalClicks,
      totalGeneratorsBought: state.totalGeneratorsBought,
      collapseCount: state.collapseCount,
      nebulaCount: state.nebulaCount,
      igniteCount: state.igniteCount,
      lifetimeH: decToStr(state.lifetimeH),
      playtimeSeconds: state.playtimeSeconds,
      lastSaved: Date.now(),
    },
  };
  return JSON.stringify(payload);
}

function deserialize(raw: string): GameState {
  const payload = JSON.parse(raw) as SavePayload;
  const base = createInitialState();
  const s = payload.state as Record<string, any>;
  if (!s) return base;

  base.h = new Decimal(s.h ?? 0);
  base.runEarnedH = new Decimal(s.runEarnedH ?? s.h ?? 0);
  base.runSeconds = Number(s.runSeconds ?? 0);
  if (s.elements) {
    base.elements.He = new Decimal(s.elements.He ?? 0);
    base.elements.Li = new Decimal(s.elements.Li ?? 0);
    base.elements.Be = new Decimal(s.elements.Be ?? 0);
  }
  if (s.particles) {
    base.particles.protons = new Decimal(s.particles.protons ?? 0);
    base.particles.neutrons = new Decimal(s.particles.neutrons ?? 0);
    base.particles.electrons = new Decimal(s.particles.electrons ?? 0);
    base.particles.positrons = new Decimal(s.particles.positrons ?? 0);
  }
  base.ae = new Decimal(s.ae ?? 0);
  base.kelvin = new Decimal(s.kelvin ?? 0);
  base.gravitons = new Decimal(s.gravitons ?? 0);
  base.ignited = Boolean(s.ignited);
  base.autoFusion = Boolean(s.autoFusion);
  if (s.unlocked) {
    base.unlocked.He = Boolean(s.unlocked.He);
    base.unlocked.Li = Boolean(s.unlocked.Li);
    base.unlocked.Be = Boolean(s.unlocked.Be);
  }
  if (s.generators) {
    for (const id in base.generators) {
      const g = s.generators[id];
      if (g) base.generators[id].owned = Number(g.owned ?? 0);
    }
  }
  if (Array.isArray(s.clickUpgrades)) {
    base.clickUpgrades = s.clickUpgrades.filter((x: unknown) => typeof x === "string");
  }
  if (Array.isArray(s.generatorUpgrades)) {
    base.generatorUpgrades = s.generatorUpgrades.filter((x: unknown) => typeof x === "string");
  }
  if (Array.isArray(s.achievements)) {
    base.achievements = s.achievements.filter((x: unknown) => typeof x === "string");
  }
  base.totalClicks = Number(s.totalClicks ?? 0);
  base.totalGeneratorsBought = Number(s.totalGeneratorsBought ?? 0);
  base.collapseCount = Number(s.collapseCount ?? 0);
  base.nebulaCount = Number(s.nebulaCount ?? 0);
  base.igniteCount = Number(s.igniteCount ?? 0);
  base.lifetimeH = new Decimal(s.lifetimeH ?? 0);
  base.playtimeSeconds = Number(s.playtimeSeconds ?? 0);
  base.lastSaved = Number(s.lastSaved ?? Date.now());

  recomputeNextCosts(base);
  return base;
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, serialize(state));
  } catch {
    /* localStorage nicht verfügbar – ignorieren */
  }
}

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createInitialState();
    return deserialize(raw);
  } catch {
    return createInitialState();
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignorieren */
  }
}

/** Rechnet Offline-Produktion seit lastSaved auf (gedeckelt) und gibt die
 *  gutgeschriebene H-Menge sowie die verstrichene Zeit (s) zurück. */
export function applyOfflineProgress(state: GameState): { gained: Decimal; seconds: number } {
  const now = Date.now();
  const elapsedMs = Math.max(0, now - state.lastSaved);
  const capMs = OFFLINE_CAP_HOURS * 3600 * 1000;
  const seconds = Math.min(elapsedMs, capMs) / 1000;
  if (seconds <= 0) return { gained: new Decimal(0), seconds: 0 };
  const gained = totalProductionPerSec(state).mul(seconds);
  state.h = state.h.add(gained);
  state.lastSaved = now;
  return { gained, seconds };
}

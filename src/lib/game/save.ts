import { Decimal } from "./decimal";
import { OFFLINE_CAP_HOURS, SAVE_KEY, SAVE_VERSION } from "./constants";
import { BUILDINGS } from "./buildings";
import { createInitialState, recomputeNextCosts, type GameState } from "./state";
import { totalProductionPerSec } from "./formulas";

interface SavePayload {
  version: number;
  state: unknown;
}

function serialize(state: GameState): string {
  const buildings: Record<string, { owned: number }> = {};
  for (const id in state.buildings) buildings[id] = { owned: state.buildings[id].owned };
  const payload: SavePayload = {
    version: SAVE_VERSION,
    state: {
      sand: state.sand.toString(),
      buildings,
      glas: state.glas.toString(),
      prestigeCount: state.prestigeCount,
      completions: state.completions,
      digCompletions: state.digCompletions,
      eventRemaining: state.eventRemaining,
      eventCooldown: state.eventCooldown,
      dinoBones: state.dinoBones,
      amber: state.amber,
      meteorShards: state.meteorShards,
      metal: state.metal,
      excavationHelpers: state.excavationHelpers,
      dinosBuilt: state.dinosBuilt,
      excavatedMeter: state.excavatedMeter,
      totalSandEver: state.totalSandEver.toString(),
      runSandEver: state.runSandEver.toString(),
      totalClicks: state.totalClicks,
      playtimeSeconds: state.playtimeSeconds,
      runPlaytimeSeconds: state.runPlaytimeSeconds,
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

  base.sand = new Decimal(s.sand ?? 0);
  if (s.buildings) {
    for (const b of BUILDINGS) {
      const saved = s.buildings[b.id];
      if (saved) base.buildings[b.id].owned = Number(saved.owned ?? 0);
    }
  }
  base.glas = new Decimal(s.glas ?? 0);
  base.prestigeCount = Number(s.prestigeCount ?? 0);
  if (s.completions && typeof s.completions === "object") base.completions = { ...s.completions };
  if (s.digCompletions && typeof s.digCompletions === "object")
    base.digCompletions = { ...s.digCompletions };
  base.eventRemaining = Number(s.eventRemaining ?? 0);
  base.eventCooldown = Number(s.eventCooldown ?? base.eventCooldown);
  base.dinoBones = Number(s.dinoBones ?? 0);
  base.amber = Number(s.amber ?? 0);
  base.meteorShards = Number(s.meteorShards ?? 0);
  base.metal = Number(s.metal ?? 0);
  base.excavationHelpers = Number(s.excavationHelpers ?? 0);
  if (s.dinosBuilt && typeof s.dinosBuilt === "object") base.dinosBuilt = { ...s.dinosBuilt };
  base.excavatedMeter = Number(s.excavatedMeter ?? 0);
  // Ältere Saves kennen totalSandEver nicht: mindestens den aktuellen Sand ansetzen.
  base.totalSandEver =
    s.totalSandEver != null ? new Decimal(s.totalSandEver) : base.sand;
  // runSandEver: ältere Saves → Bauwerke/Graben-Stand aus totalSandEver übernehmen.
  base.runSandEver =
    s.runSandEver != null ? new Decimal(s.runSandEver) : base.totalSandEver;
  base.totalClicks = Number(s.totalClicks ?? 0);
  base.playtimeSeconds = Number(s.playtimeSeconds ?? 0);
  base.runPlaytimeSeconds = Number(s.runPlaytimeSeconds ?? 0);
  base.lastSaved = Number(s.lastSaved ?? Date.now());

  recomputeNextCosts(base);
  return base;
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, serialize(state));
  } catch {
    /* localStorage nicht verfügbar */
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

/** Offline-Produktion seit lastSaved (gedeckelt) aufrechnen. */
export function applyOfflineProgress(state: GameState): { gained: Decimal; seconds: number } {
  const now = Date.now();
  const elapsedMs = Math.max(0, now - state.lastSaved);
  const capMs = OFFLINE_CAP_HOURS * 3600 * 1000;
  const seconds = Math.min(elapsedMs, capMs) / 1000;
  if (seconds <= 0) return { gained: new Decimal(0), seconds: 0 };
  const gained = totalProductionPerSec(state).mul(seconds);
  state.sand = state.sand.add(gained);
  state.totalSandEver = state.totalSandEver.add(gained);
  state.runSandEver = state.runSandEver.add(gained);
  state.lastSaved = now;
  return { gained, seconds };
}

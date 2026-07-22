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
      totalSandEver: state.totalSandEver.toString(),
      totalClicks: state.totalClicks,
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

  base.sand = new Decimal(s.sand ?? 0);
  if (s.buildings) {
    for (const b of BUILDINGS) {
      const saved = s.buildings[b.id];
      if (saved) base.buildings[b.id].owned = Number(saved.owned ?? 0);
    }
  }
  base.glas = new Decimal(s.glas ?? 0);
  base.prestigeCount = Number(s.prestigeCount ?? 0);
  // Ältere Saves kennen totalSandEver nicht: mindestens den aktuellen Sand ansetzen.
  base.totalSandEver =
    s.totalSandEver != null ? new Decimal(s.totalSandEver) : base.sand;
  base.totalClicks = Number(s.totalClicks ?? 0);
  base.playtimeSeconds = Number(s.playtimeSeconds ?? 0);
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
  state.lastSaved = now;
  return { gained, seconds };
}

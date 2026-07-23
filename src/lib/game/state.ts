import { Decimal, ZERO } from "./decimal";
import { BUILDINGS } from "./buildings";
import { costForNext, costMultiplier } from "./formulas";

export interface BuildingState {
  owned: number;
  nextCost: Decimal;
}

export interface GameState {
  sand: Decimal;
  buildings: Record<string, BuildingState>;

  // Prestige
  glas: Decimal;
  prestigeCount: number;

  // Statistik / Lifetime
  totalSandEver: Decimal; // je gesammelte Sandkörner (bleibt bei Prestige)
  runSandEver: Decimal; // in diesem Run gesammelt (Basis für Bauwerke & Graben, Reset bei Prestige)
  totalClicks: number;
  playtimeSeconds: number;
  lastSaved: number;
}

export function createInitialState(): GameState {
  const buildings: Record<string, BuildingState> = {};
  for (const b of BUILDINGS) buildings[b.id] = { owned: 0, nextCost: b.baseCost };
  return {
    sand: ZERO,
    buildings,
    glas: ZERO,
    prestigeCount: 0,
    totalSandEver: ZERO,
    runSandEver: ZERO,
    totalClicks: 0,
    playtimeSeconds: 0,
    lastSaved: Date.now(),
  };
}

/** Stellt nextCost aller Gebäude aus den `owned`-Zahlen wieder her (inkl. Bauwerk-Rabatt). */
export function recomputeNextCosts(state: GameState): void {
  const costMult = costMultiplier(state);
  for (const b of BUILDINGS) {
    const bs = state.buildings[b.id];
    bs.nextCost = costForNext(b.baseCost, bs.owned, b.costGrowth, costMult);
  }
}

/**
 * Prestige-Reset: Sand + Gebäude + Run-Fortschritt (Bauwerke & Graben) zurück.
 * Glas, Lifetime-Statistik (totalSandEver) & Meta bleiben.
 */
export function prestigeReset(state: GameState): void {
  state.sand = ZERO;
  state.runSandEver = ZERO; // Bauwerke & Graben setzen sich zurück
  for (const b of BUILDINGS) {
    state.buildings[b.id] = { owned: 0, nextCost: b.baseCost };
  }
  // Kosten neu (Bauwerk-Rabatt jetzt weg, da runSandEver = 0).
  recomputeNextCosts(state);
}

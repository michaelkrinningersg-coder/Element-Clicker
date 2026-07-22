import { Decimal, ZERO } from "./decimal";
import { BUILDINGS } from "./buildings";
import { costForNext } from "./formulas";

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

  // Meta
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
    totalClicks: 0,
    playtimeSeconds: 0,
    lastSaved: Date.now(),
  };
}

/** Stellt nextCost aller Gebäude aus den `owned`-Zahlen wieder her. */
export function recomputeNextCosts(state: GameState): void {
  for (const b of BUILDINGS) {
    const bs = state.buildings[b.id];
    bs.nextCost = costForNext(b.baseCost, bs.owned, b.costGrowth);
  }
}

/** Prestige-Reset: Sand + Gebäude zurück (Glas & Meta bleiben). */
export function prestigeReset(state: GameState): void {
  state.sand = ZERO;
  for (const b of BUILDINGS) {
    state.buildings[b.id] = { owned: 0, nextCost: b.baseCost };
  }
}

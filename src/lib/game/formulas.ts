import { Decimal, ZERO, ONE } from "./decimal";
import {
  COST_GROWTH_FLOOR,
  COST_GROWTH_KAPPA,
  COST_GROWTH_SPAN,
  GLAS_BONUS_PER,
  GLAS_UNLOCK,
} from "./constants";
import { BUILDINGS, BUILDING_BY_ID } from "./buildings";
import type { GameState } from "./state";

/** Reine Formelfunktionen (keine Seiteneffekte). */

/** Abflachende Wachstumsrate für den Kauf der (ownedIndex+1)-ten Einheit. */
export function growthRate(ownedIndex: number): number {
  return COST_GROWTH_FLOOR + COST_GROWTH_SPAN * Math.pow(0.5, ownedIndex / COST_GROWTH_KAPPA);
}

/** Kosten der nächsten Einheit, komplett aus `owned` neu berechnet. */
export function costForNext(baseCost: Decimal, owned: number): Decimal {
  let cost = baseCost;
  for (let i = 0; i < owned; i++) cost = cost.mul(growthRate(i));
  return cost;
}

/** Gesamtkosten, um `count` Einheiten ab `owned` zu kaufen (Start: nextCost). */
export function bulkCost(nextCost: Decimal, owned: number, count: number): Decimal {
  let total = ZERO;
  let cost = nextCost;
  for (let i = 0; i < count; i++) {
    total = total.add(cost);
    cost = cost.mul(growthRate(owned + i));
  }
  return total;
}

/** Wie viele Einheiten mit `sand` leistbar sind (gedeckelt durch `limit`). */
export function maxAffordable(
  nextCost: Decimal,
  owned: number,
  sand: Decimal,
  limit = 1_000_000,
): number {
  let count = 0;
  let cost = nextCost;
  let spent = ZERO;
  while (count < limit) {
    const next = spent.add(cost);
    if (next.gt(sand)) break;
    spent = next;
    cost = cost.mul(growthRate(owned + count));
    count++;
  }
  return count;
}

/** Globaler Multiplikator aus Glas: 1 + 0,1 je Glas (Produktion & Klick). */
export function glasMultiplier(state: GameState): Decimal {
  return ONE.add(state.glas.mul(GLAS_BONUS_PER));
}

/** Wert eines Klicks: (1 + Σ Klick-Gebäude) × Glas. */
export function clickValue(state: GameState): Decimal {
  let base = 1;
  for (const b of BUILDINGS) {
    if (b.kind === "click" && b.clickPerUnit) {
      base += b.clickPerUnit * state.buildings[b.id].owned;
    }
  }
  return new Decimal(base).mul(glasMultiplier(state));
}

/** Sand/Sek. eines einzelnen Generator-Gebäudes inkl. Glas (für die Anzeige). */
export function buildingProduction(state: GameState, id: string): Decimal {
  const b = BUILDING_BY_ID[id];
  if (b?.kind === "generator" && b.prodPerUnit) {
    return b.prodPerUnit.mul(state.buildings[id].owned).mul(glasMultiplier(state));
  }
  return ZERO;
}

/** Gesamte Sand/Sek. inkl. Glas. */
export function totalProductionPerSec(state: GameState): Decimal {
  let sum = ZERO;
  for (const b of BUILDINGS) {
    if (b.kind === "generator" && b.prodPerUnit) {
      sum = sum.add(b.prodPerUnit.mul(state.buildings[b.id].owned));
    }
  }
  return sum.mul(glasMultiplier(state));
}

/** Prestige erlaubt, sobald Sand ≥ 1e9. */
export function canPrestige(state: GameState): boolean {
  return state.sand.gte(GLAS_UNLOCK);
}

/** Wie viel Glas ein Prestige einbringt: floor(sqrt(Sand / 1e9)), min. 1. */
export function glasGain(state: GameState): Decimal {
  if (state.sand.lt(GLAS_UNLOCK)) return ZERO;
  const g = state.sand.div(GLAS_UNLOCK).sqrt().floor();
  return g.lt(1) ? ONE : g;
}

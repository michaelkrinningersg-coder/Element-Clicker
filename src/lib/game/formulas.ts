import { Decimal, ZERO, ONE } from "./decimal";
import {
  ACH_COST_PER,
  ACH_PROD_PER,
  COST_GROWTH_FLOOR,
  COST_GROWTH_KAPPA,
  COST_GROWTH_SPAN,
  DIG_TIERS,
  EARTH_DIAMETER_M,
  GLAS_BONUS_PER,
  GLAS_UNLOCK,
  TONNE_IN_GRAINS,
} from "./constants";
import { BUILDINGS, BUILDING_BY_ID } from "./buildings";
import { unlockedCount } from "./achievements";
import type { GameState } from "./state";

/** Reine Formelfunktionen (keine Seiteneffekte). */

/**
 * Wachstumsrate pro Kauf. Mit `constant` eine feste Rate je Gebäude,
 * ohne `constant` die globale abflachende Kurve (Fallback).
 */
export function growthRate(ownedIndex: number, constant?: number): number {
  if (constant !== undefined) return constant;
  return COST_GROWTH_FLOOR + COST_GROWTH_SPAN * Math.pow(0.5, ownedIndex / COST_GROWTH_KAPPA);
}

/** Kosten der nächsten Einheit, komplett aus `owned` neu berechnet. */
export function costForNext(
  baseCost: Decimal,
  owned: number,
  constant?: number,
  costMult: Decimal = ONE,
): Decimal {
  let cost = baseCost.mul(costMult);
  for (let i = 0; i < owned; i++) cost = cost.mul(growthRate(i, constant));
  return cost;
}

/** Gesamtkosten, um `count` Einheiten ab `owned` zu kaufen (Start: nextCost). */
export function bulkCost(
  nextCost: Decimal,
  owned: number,
  count: number,
  constant?: number,
): Decimal {
  let total = ZERO;
  let cost = nextCost;
  for (let i = 0; i < count; i++) {
    total = total.add(cost);
    cost = cost.mul(growthRate(owned + i, constant));
  }
  return total;
}

/** Wie viele Einheiten mit `sand` leistbar sind (gedeckelt durch `limit`). */
export function maxAffordable(
  nextCost: Decimal,
  owned: number,
  sand: Decimal,
  limit = 1_000_000,
  constant?: number,
): number {
  let count = 0;
  let cost = nextCost;
  let spent = ZERO;
  while (count < limit) {
    const next = spent.add(cost);
    if (next.gt(sand)) break;
    spent = next;
    cost = cost.mul(growthRate(owned + count, constant));
    count++;
  }
  return count;
}

/** Globaler Multiplikator aus Glas: 1 + 0,1 je Glas (Produktion & Klick). */
export function glasMultiplier(state: GameState): Decimal {
  return ONE.add(state.glas.mul(GLAS_BONUS_PER));
}

/** Produktions-Multiplikator aus Bauwerken: (1 + 0,02)^Anzahl (nur Produktion). */
export function achievementProductionMult(state: GameState): Decimal {
  return new Decimal(Math.pow(1 + ACH_PROD_PER, unlockedCount(state)));
}

/** Kosten-Multiplikator aus Bauwerken: (1 − 0,01)^Anzahl (multiplikativ, günstiger). */
export function costMultiplier(state: GameState): Decimal {
  return new Decimal(Math.pow(1 - ACH_COST_PER, unlockedCount(state)));
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

/** Sand/Sek. eines einzelnen Generator-Gebäudes inkl. Glas & Bauwerken (für die Anzeige). */
export function buildingProduction(state: GameState, id: string): Decimal {
  const b = BUILDING_BY_ID[id];
  if (b?.kind === "generator" && b.prodPerUnit) {
    return b.prodPerUnit
      .mul(state.buildings[id].owned)
      .mul(glasMultiplier(state))
      .mul(achievementProductionMult(state));
  }
  return ZERO;
}

/** Gesamte Sand/Sek. inkl. Glas & Bauwerk-Bonus. */
export function totalProductionPerSec(state: GameState): Decimal {
  let sum = ZERO;
  for (const b of BUILDINGS) {
    if (b.kind === "generator" && b.prodPerUnit) {
      sum = sum.add(b.prodPerUnit.mul(state.buildings[b.id].owned));
    }
  }
  return sum.mul(glasMultiplier(state)).mul(achievementProductionMult(state));
}

// ---- Graben: Tiefe aus gesammeltem Sandgewicht ----

/** Stufen mit kumulierter Tonnage bis zu ihrem Beginn (einmalig berechnet). */
const DIG_BOUNDS = (() => {
  const out: { fromM: number; tPerM: number; cumWeight: number }[] = [];
  let cum = 0;
  for (let i = 0; i < DIG_TIERS.length; i++) {
    const t = DIG_TIERS[i];
    out.push({ fromM: t.fromM, tPerM: t.tPerM, cumWeight: cum });
    const nextFrom = DIG_TIERS[i + 1]?.fromM ?? EARTH_DIAMETER_M;
    cum += (nextFrom - t.fromM) * t.tPerM;
  }
  return out;
})();

/** Tonnage, um bis zum Erddurchmesser zu graben (Deckel). */
const DIG_MAX_WEIGHT = (() => {
  const last = DIG_BOUNDS[DIG_BOUNDS.length - 1];
  return last.cumWeight + (EARTH_DIAMETER_M - last.fromM) * last.tPerM;
})();

/** Gegrabene Tiefe (Meter) aus gesammelten Sandkörnern, gedeckelt beim Erddurchmesser. */
export function digDepthMeters(grains: Decimal): number {
  const tonnes = grains.div(TONNE_IN_GRAINS);
  if (tonnes.gte(DIG_MAX_WEIGHT)) return EARTH_DIAMETER_M;
  const w = tonnes.toNumber();
  let depth = 0;
  for (let i = DIG_BOUNDS.length - 1; i >= 0; i--) {
    if (w >= DIG_BOUNDS[i].cumWeight) {
      depth = DIG_BOUNDS[i].fromM + (w - DIG_BOUNDS[i].cumWeight) / DIG_BOUNDS[i].tPerM;
      break;
    }
  }
  return Math.min(depth, EARTH_DIAMETER_M);
}

/** Tonnage, die ein Meter in der aktuellen Tiefe kostet. */
export function tonnesPerMeterAt(depthM: number): number {
  let tPerM = DIG_TIERS[0].tPerM;
  for (const t of DIG_TIERS) if (depthM >= t.fromM) tPerM = t.tPerM;
  return tPerM;
}

/** Gesammeltes Gewicht in Tonnen (für die Graben-Anzeige). */
export function weightInTonnes(grains: Decimal): Decimal {
  return grains.div(TONNE_IN_GRAINS);
}

/** Ist die maximale Grabtiefe (Erddurchmesser) erreicht? */
export function isMaxDepth(depthM: number): boolean {
  return depthM >= EARTH_DIAMETER_M;
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

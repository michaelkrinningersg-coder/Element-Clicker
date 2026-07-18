import { Decimal, ZERO, ONE } from "./decimal";
import {
  AE_BASE_H,
  AE_PRODUCTION_BONUS,
  AE_RATIO,
  COST_GROWTH_FLOOR,
  COST_GROWTH_KAPPA,
  COST_GROWTH_SPAN,
  GRAVITON_THRESHOLD_FACTOR,
  PERK_MILESTONES,
  PERK_MILESTONE_PLACEHOLDER_MULT,
} from "./constants";
import { GENERATOR_BY_ID } from "./generators";
import type { GameState } from "./state";

/**
 * Reine Formelfunktionen (keine Seiteneffekte). Kern des Balancings.
 */

/** Abflachende Wachstumsrate für den Kauf der (ownedIndex+1)-ten Einheit. */
export function growthRate(ownedIndex: number): number {
  return (
    COST_GROWTH_FLOOR + COST_GROWTH_SPAN * Math.pow(0.5, ownedIndex / COST_GROWTH_KAPPA)
  );
}

/** Kosten der nächsten Einheit, komplett aus `owned` neu berechnet. */
export function costForNext(baseCost: Decimal, owned: number): Decimal {
  let cost = baseCost;
  for (let i = 0; i < owned; i++) cost = cost.mul(growthRate(i));
  return cost;
}

/** Wie viele Perk-Meilensteine bei `owned` Stück erreicht sind. */
export function reachedMilestones(owned: number): number {
  let count = 0;
  for (const m of PERK_MILESTONES) if (owned >= m) count++;
  return count;
}

/** Platzhalter-Multiplikator aus erreichten Meilensteinen (Perks folgen). */
export function milestoneMultiplier(owned: number): Decimal {
  const count = reachedMilestones(owned);
  return new Decimal(Math.pow(PERK_MILESTONE_PLACEHOLDER_MULT, count));
}

/** Globaler Multiplikator aus gehaltener Aktivierungsenergie (+2% je AE). */
export function globalMultiplier(state: GameState): Decimal {
  return ONE.add(state.ae.mul(AE_PRODUCTION_BONUS));
}

/** H/Sek. eines einzelnen Generators (ohne globalen Multiplikator). */
export function generatorProduction(id: string, owned: number): Decimal {
  if (owned <= 0) return ZERO;
  const def = GENERATOR_BY_ID[id];
  return def.baseProd.mul(owned).mul(milestoneMultiplier(owned));
}

/** Gesamte H/Sek. inkl. globalem Multiplikator. */
export function totalProductionPerSec(state: GameState): Decimal {
  let sum = ZERO;
  for (const id in state.generators) {
    sum = sum.add(generatorProduction(id, state.generators[id].owned));
  }
  return sum.mul(globalMultiplier(state));
}

/** Wert eines Klicks (H-Atome), inkl. globalem Multiplikator. */
export function clickValue(state: GameState, base: Decimal): Decimal {
  return base.mul(globalMultiplier(state));
}

/** Effektive H-Basisschwelle für die 1. AE, gesenkt durch Gravitonen. */
export function aeThresholdBase(gravitons: Decimal): number {
  return AE_BASE_H * Math.pow(GRAVITON_THRESHOLD_FACTOR, gravitons.toNumber());
}

/**
 * Wie viel AE ein Kollaps beim aktuellen Run-H einbringt.
 * n = floor( log_ratio(H / base) ) + 1, sofern H >= base, sonst 0.
 */
export function potentialAE(runH: Decimal, gravitons: Decimal): Decimal {
  const base = aeThresholdBase(gravitons);
  if (runH.lt(base)) return ZERO;
  // Epsilon fängt Floating-Point-Ungenauigkeit an exakten Schwellen ab
  // (z.B. H = 2,1e6 soll sicher als 2. AE-Einheit zählen).
  const n = Math.floor(runH.div(base).ln() / Math.log(AE_RATIO) + 1e-6) + 1;
  return new Decimal(Math.max(0, n));
}

/** H-Menge, ab der die n-te AE-Einheit erreicht wird (für UI/Anzeige). */
export function aeThreshold(n: number, gravitons: Decimal): Decimal {
  const base = aeThresholdBase(gravitons);
  return new Decimal(base).mul(Math.pow(AE_RATIO, n - 1));
}

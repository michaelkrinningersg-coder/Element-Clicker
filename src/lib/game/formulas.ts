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
} from "./constants";
import { GENERATORS, GENERATOR_BY_ID, type Perk } from "./generators";
import { CLICK_UPGRADE_BY_ID } from "./clickUpgrades";
import { GENERATOR_MILESTONES } from "./milestones";
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

/** Wie viele der globalen Perk-Meilenstein-Schwellen bei `owned` erreicht sind. */
export function reachedMilestones(owned: number): number {
  let count = 0;
  for (const m of PERK_MILESTONES) if (owned >= m) count++;
  return count;
}

// ---- Perks ----

/** Die bei aktuellem Besitz aktiven Perks eines Generators. */
export function activePerks(state: GameState, genId: string): Perk[] {
  const def = GENERATOR_BY_ID[genId];
  if (!def) return [];
  const owned = state.generators[genId].owned;
  return def.perks.filter((p) => owned >= p.threshold);
}

/** Der nächste noch nicht erreichte Perk eines Generators (oder null). */
export function nextPerk(state: GameState, genId: string): Perk | null {
  const def = GENERATOR_BY_ID[genId];
  if (!def) return null;
  const owned = state.generators[genId].owned;
  for (const p of def.perks) if (owned < p.threshold) return p;
  return null;
}

/** Klick-Power-Multiplikator aus allen aktiven clickMult-Perks (alle Generatoren). */
export function clickPowerMultiplier(state: GameState): Decimal {
  let m = 1;
  for (const g of GENERATORS) {
    const owned = state.generators[g.id].owned;
    for (const p of g.perks) {
      if (owned < p.threshold) continue;
      for (const e of p.effects) if (e.kind === "clickMult") m *= e.factor;
    }
  }
  return new Decimal(m);
}

/** Multiplikator aus gekauften Klick-Upgrades (permanent). */
export function clickUpgradeMultiplier(state: GameState): Decimal {
  let m = 1;
  for (const id of state.clickUpgrades) {
    const def = CLICK_UPGRADE_BY_ID[id];
    if (def) m *= def.clickMult;
  }
  return new Decimal(m);
}

/** Summe aller besessenen Generatoren (über alle Typen). */
export function totalGeneratorsOwned(state: GameState): number {
  let n = 0;
  for (const id in state.generators) n += state.generators[id].owned;
  return n;
}

/** Faktor auf das Auto-Einkommen aus erreichten Generator-Meilensteinen. */
export function milestoneProductionMultiplier(state: GameState): Decimal {
  const total = totalGeneratorsOwned(state);
  let m = 1;
  for (const ms of GENERATOR_MILESTONES) if (total >= ms.threshold) m *= ms.productionMult;
  return new Decimal(m);
}

/** Faktor auf das Klick-Einkommen aus erreichten Generator-Meilensteinen. */
export function milestoneClickMultiplier(state: GameState): Decimal {
  const total = totalGeneratorsOwned(state);
  let m = 1;
  for (const ms of GENERATOR_MILESTONES) if (total >= ms.threshold) m *= ms.clickMult;
  return new Decimal(m);
}

/** Globaler Produktions-Multiplikator aus allen aktiven globalMult-Perks. */
export function perkGlobalMultiplier(state: GameState): Decimal {
  let m = 1;
  for (const g of GENERATORS) {
    const owned = state.generators[g.id].owned;
    for (const p of g.perks) {
      if (owned < p.threshold) continue;
      for (const e of p.effects) if (e.kind === "globalMult") m *= e.factor;
    }
  }
  return new Decimal(m);
}

/** Output-Multiplikator eines Generators aus eigenen + fremden Perks. */
export function generatorOutputMultiplier(state: GameState, genId: string): Decimal {
  let m = 1;
  for (const g of GENERATORS) {
    const owned = state.generators[g.id].owned;
    for (const p of g.perks) {
      if (owned < p.threshold) continue;
      for (const e of p.effects) {
        if (e.kind === "selfOutputMult" && g.id === genId) m *= e.factor;
        else if (e.kind === "generatorOutputMult" && e.targetId === genId) m *= e.factor;
      }
    }
  }
  return new Decimal(m);
}

/** Globaler Multiplikator aus gehaltener Aktivierungsenergie (+2% je AE). */
export function aeMultiplier(state: GameState): Decimal {
  return ONE.add(state.ae.mul(AE_PRODUCTION_BONUS));
}

/** Roh-Produktion eines Generators (baseProd * Anzahl * Output-Perks), ohne globale Faktoren. */
export function rawGeneratorProduction(state: GameState, id: string): Decimal {
  const owned = state.generators[id].owned;
  if (owned <= 0) return ZERO;
  const def = GENERATOR_BY_ID[id];
  return def.baseProd.mul(owned).mul(generatorOutputMultiplier(state, id));
}

/** Effektive H/Sek. eines Generators inkl. aller globalen Faktoren (für UI). */
export function effectiveGeneratorProduction(state: GameState, id: string): Decimal {
  return rawGeneratorProduction(state, id)
    .mul(aeMultiplier(state))
    .mul(perkGlobalMultiplier(state))
    .mul(milestoneProductionMultiplier(state));
}

/** Gesamte H/Sek. inkl. globaler Faktoren. */
export function totalProductionPerSec(state: GameState): Decimal {
  let sum = ZERO;
  for (const id in state.generators) sum = sum.add(rawGeneratorProduction(state, id));
  return sum
    .mul(aeMultiplier(state))
    .mul(perkGlobalMultiplier(state))
    .mul(milestoneProductionMultiplier(state));
}

/** Wert eines Klicks (H-Atome): Basis * Klick-Perks * Klick-Upgrades * Meilensteine * AE. */
export function clickValue(state: GameState, base: Decimal): Decimal {
  return base
    .mul(clickPowerMultiplier(state))
    .mul(clickUpgradeMultiplier(state))
    .mul(milestoneClickMultiplier(state))
    .mul(aeMultiplier(state));
}

// ---- Aktivierungsenergie ----

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
  // Epsilon fängt Floating-Point-Ungenauigkeit an exakten Schwellen ab.
  const n = Math.floor(runH.div(base).ln() / Math.log(AE_RATIO) + 1e-6) + 1;
  return new Decimal(Math.max(0, n));
}

/** H-Menge, ab der die n-te AE-Einheit erreicht wird (für UI/Anzeige). */
export function aeThreshold(n: number, gravitons: Decimal): Decimal {
  const base = aeThresholdBase(gravitons);
  return new Decimal(base).mul(Math.pow(AE_RATIO, n - 1));
}

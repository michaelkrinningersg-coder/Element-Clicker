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
  RUN_TIME_BONUS_PER_SEC,
  CLICK_TO_MOLEKULWOLKE_OUTPUT,
  MOLEKULWOLKE_AE_COUPLING,
  POSITRON_PRODUCTION_BONUS,
} from "./constants";
import { GENERATORS, GENERATOR_BY_ID, type Perk } from "./generators";
import { CLICK_UPGRADE_BY_ID } from "./clickUpgrades";
import { GENERATOR_UPGRADES, type GeneratorUpgradeDef } from "./generatorUpgrades";
import { GENERATOR_MILESTONES } from "./milestones";
import { ELEMENTS } from "./elements";
import { FUSION_UPGRADES } from "./fusionUpgrades";
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

/** Wie viele Einheiten mit `h` leistbar sind (gedeckelt durch `limit`). */
export function maxAffordable(
  nextCost: Decimal,
  owned: number,
  h: Decimal,
  limit = 1_000_000,
): number {
  let count = 0;
  let cost = nextCost;
  let spent = ZERO;
  while (count < limit) {
    const next = spent.add(cost);
    if (next.gt(h)) break;
    spent = next;
    cost = cost.mul(growthRate(owned + count));
    count++;
  }
  return count;
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

/**
 * Additiver Klick-Bonus aus Generatoren mit clickBonusPerUnit
 * (z.B. Molekülwolke: +25 % Klick je Einheit). Ergibt den Faktor
 * 1 + Summe(owned * clickBonusPerUnit).
 */
export function clickGeneratorBonusMultiplier(state: GameState): Decimal {
  let bonus = 0;
  for (const g of GENERATORS) {
    if (g.clickBonusPerUnit) bonus += g.clickBonusPerUnit * state.generators[g.id].owned;
  }
  return new Decimal(1 + bonus);
}

/** Effektive "Output je Generator"-Rate inkl. dynamischer Verstärkung. */
export function effectiveOutputBonusPerGenerator(
  state: GameState,
  def: { outputBonusPerGenerator?: number; outputBonusPerGeneratorBoost?: { perGeneratorId: string; factorPerUnit: number } },
): number {
  let rate = def.outputBonusPerGenerator ?? 0;
  const b = def.outputBonusPerGeneratorBoost;
  if (b) rate += b.factorPerUnit * (state.generators[b.perGeneratorId]?.owned ?? 0);
  return rate;
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
/**
 * Effektiver factorPerUnit eines "outputPerGenerator"-Upgrades, inkl. gekaufter
 * "boostUpgradeFactor"-Upgrades, die es verstärken.
 */
export function effectiveUpgradeFactor(state: GameState, up: GeneratorUpgradeDef): number {
  if (up.effect.kind !== "outputPerGenerator") return 0;
  let f = up.effect.factorPerUnit;
  for (const b of GENERATOR_UPGRADES) {
    if (b.effect.kind !== "boostUpgradeFactor") continue;
    if (b.effect.targetUpgradeId !== up.id) continue;
    if (!state.generatorUpgrades.includes(b.id)) continue;
    f += b.effect.factorPerUnit * (state.generators[b.effect.perGeneratorId]?.owned ?? 0);
  }
  return f;
}

export function generatorOutputMultiplier(state: GameState, genId: string): Decimal {
  let m = 1;
  for (const g of GENERATORS) {
    const owned = state.generators[g.id].owned;
    for (const p of g.perks) {
      if (owned < p.threshold) continue;
      for (const e of p.effects) {
        if (e.kind === "selfOutputMult" && g.id === genId) m *= e.factor;
        else if (e.kind === "generatorOutputMult" && e.targetId === genId) m *= e.factor;
        else if (e.kind === "generatorOutputPerOwner" && e.targetId === genId) {
          m *= 1 + e.factor * owned; // owned = Anzahl des besitzenden Generators
        }
      }
    }
  }
  // Klick-Synergie: jeder Gesamt-Klick +0,01 % Molekülwolken-Output
  if (genId === "g1") m *= 1 + CLICK_TO_MOLEKULWOLKE_OUTPUT * state.totalClicks;
  // Output-Bonus je Generator (z.B. Riesenmolekülwolke +1 % je Generator,
  // dynamisch erhöht durch Kosmische Filamente)
  const genDef = GENERATOR_BY_ID[genId];
  if (genDef?.outputBonusPerGenerator || genDef?.outputBonusPerGeneratorBoost) {
    m *= 1 + effectiveOutputBonusPerGenerator(state, genDef) * totalGeneratorsOwned(state);
  }
  // Gekaufte Generator-Upgrades (dynamischer Output-Bonus je Partner-Generator)
  for (const up of GENERATOR_UPGRADES) {
    if (up.effect.kind !== "outputPerGenerator") continue;
    if (up.effect.targetId !== genId) continue;
    if (!state.generatorUpgrades.includes(up.id)) continue;
    const perCount = state.generators[up.effect.perGeneratorId]?.owned ?? 0;
    m *= 1 + effectiveUpgradeFactor(state, up) * perCount;
  }
  let result = new Decimal(m);
  if (genId === "g1") {
    // Prestige-Kopplung: × (1 + 0,25 · AE)
    result = result.mul(ONE.add(state.ae.mul(MOLEKULWOLKE_AE_COUPLING)));
    // Element-Massenzahl-Bonus (He → +400 %/Atom, Li → +700 %, Be → +900 % …)
    result = result.mul(molekulwolkeElementBonus(state));
  }
  return result;
}

/** Multiplikator auf den AE-Ertrag beim Kollaps (aeGainMult-Perks). */
export function aeGainMultiplier(state: GameState): Decimal {
  let m = 1;
  for (const g of GENERATORS) {
    const owned = state.generators[g.id].owned;
    for (const p of g.perks) {
      if (owned < p.threshold) continue;
      for (const e of p.effects) if (e.kind === "aeGainMult") m *= e.factor;
    }
  }
  return new Decimal(m);
}

/** Globaler Multiplikator aus gehaltener Aktivierungsenergie (+2% je AE). */
export function aeMultiplier(state: GameState): Decimal {
  return ONE.add(state.ae.mul(AE_PRODUCTION_BONUS));
}

/** Multiplikator aus Achievements: 1,0 + 0,1 je freigeschaltetem Achievement. */
export function achievementMultiplier(state: GameState): Decimal {
  return new Decimal(1 + 0.1 * state.achievements.length);
}

/** Faktor auf die Run-Zeit-Bonus-Rate aus Fusions-Upgrades (z.B. Lawson ×2). */
export function runTimeBonusFactor(state: GameState): number {
  let f = 1;
  for (const u of FUSION_UPGRADES) {
    if (u.effect.kind !== "runTimeBonusMult") continue;
    if (state.fusionUpgrades.includes(u.id)) f *= u.effect.factor;
  }
  return f;
}

/** Run-Zeit-Bonus: 1 + 0,01 % (× Fusions-Faktor) je Sekunde im aktuellen Run. */
export function runTimeMultiplier(state: GameState): Decimal {
  return new Decimal(1 + RUN_TIME_BONUS_PER_SEC * runTimeBonusFactor(state) * state.runSeconds);
}

/** Multiplikator auf ALLE Generator-Kosten aus Fusions-Upgrades (z.B. Katalysator 0,75). */
export function generatorCostMultiplier(state: GameState): Decimal {
  let m = 1;
  for (const u of FUSION_UPGRADES) {
    if (u.effect.kind !== "generatorCostMult") continue;
    if (state.fusionUpgrades.includes(u.id)) m *= u.effect.factor;
  }
  return new Decimal(m);
}

/** Molekülwolke-Bonus aus gesammelten Elementen: 1 + Σ (Massenzahl · Anzahl). */
export function molekulwolkeElementBonus(state: GameState): Decimal {
  let bonus = ZERO;
  for (const sym of ["He", "Li", "Be"] as const) {
    const massNumber = ELEMENTS[sym].protons + ELEMENTS[sym].neutrons;
    bonus = bonus.add(state.elements[sym].mul(massNumber));
  }
  return ONE.add(bonus);
}

/** Globaler Produktions-Bonus aus Positronen: 1 + 0,5 % je Positron. */
export function positronProductionMultiplier(state: GameState): Decimal {
  return ONE.add(state.particles.positrons.mul(POSITRON_PRODUCTION_BONUS));
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
    .mul(milestoneProductionMultiplier(state))
    .mul(achievementMultiplier(state))
    .mul(runTimeMultiplier(state))
    .mul(positronProductionMultiplier(state));
}

/** Gesamte H/Sek. inkl. globaler Faktoren. */
export function totalProductionPerSec(state: GameState): Decimal {
  let sum = ZERO;
  for (const id in state.generators) sum = sum.add(rawGeneratorProduction(state, id));
  return sum
    .mul(aeMultiplier(state))
    .mul(perkGlobalMultiplier(state))
    .mul(milestoneProductionMultiplier(state))
    .mul(achievementMultiplier(state))
    .mul(runTimeMultiplier(state))
    .mul(positronProductionMultiplier(state));
}

/** Wert eines Klicks: Basis * Generator-Klickbonus * Perks * Upgrades * Meilenstein * Achievements * Run-Zeit * AE. */
export function clickValue(state: GameState, base: Decimal): Decimal {
  return base
    .mul(clickGeneratorBonusMultiplier(state))
    .mul(clickPowerMultiplier(state))
    .mul(clickUpgradeMultiplier(state))
    .mul(milestoneClickMultiplier(state))
    .mul(achievementMultiplier(state))
    .mul(runTimeMultiplier(state))
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

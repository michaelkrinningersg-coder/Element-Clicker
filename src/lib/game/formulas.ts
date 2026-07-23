import { Decimal, ZERO, ONE } from "./decimal";
import {
  ACH_COST_PER,
  ACH_PROD_PER,
  ARBEITER_BOOST_PER,
  COST_GROWTH_FLOOR,
  COST_GROWTH_KAPPA,
  COST_GROWTH_SPAN,
  DIG_CENTER_FACTOR,
  DIG_CENTER_M,
  DIG_MILESTONE_BONUS_PER,
  DIG_MILESTONES,
  DIG_START_TPM,
  EARTH_DIAMETER_M,
  GENERATOR_BOOST_PER,
  GLAS_BONUS_PER,
  GLAS_UNLOCK,
  TIME_BOOST_PER,
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

/** Gesamtzahl aller gebauten Generatoren (Einheiten). */
export function generatorCount(state: GameState): number {
  let n = 0;
  for (const b of BUILDINGS) {
    if (b.kind === "generator") n += state.buildings[b.id].owned;
  }
  return n;
}

/** Produktions-Boost aus der Generator-Gesamtzahl: 1 + 0,1 % je Generator. */
export function generatorBoostMultiplier(state: GameState): Decimal {
  return new Decimal(1 + GENERATOR_BOOST_PER * generatorCount(state));
}

/** Boost auf alle Generatoren aus den Arbeitern: 1 + 1 % je Arbeiter. */
export function arbeiterBoostMultiplier(state: GameState): Decimal {
  const owned = state.buildings.arbeiter?.owned ?? 0;
  return new Decimal(1 + ARBEITER_BOOST_PER * owned);
}

/** Zeit-Bonus dieses Runs auf die Produktion: 1 + 0,01 % je Sekunde seit dem letzten Prestige. */
export function runTimeBoostMultiplier(state: GameState): Decimal {
  return new Decimal(1 + TIME_BOOST_PER * state.runPlaytimeSeconds);
}

/** Wert eines Klicks: (1 + Σ Klick-Gebäude) × Glas. */
export function clickValue(state: GameState): Decimal {
  let base = 1;
  for (const b of BUILDINGS) {
    if (b.kind === "click" && b.clickPerUnit) {
      base += b.clickPerUnit * state.buildings[b.id].owned;
    }
  }
  return new Decimal(base).mul(glasMultiplier(state)).mul(digIncomeMultiplier(state));
}

/** Sand/Sek. eines einzelnen Generator-Gebäudes inkl. Glas & Bauwerken (für die Anzeige). */
export function buildingProduction(state: GameState, id: string): Decimal {
  const b = BUILDING_BY_ID[id];
  if (b?.kind === "generator" && b.prodPerUnit) {
    return b.prodPerUnit
      .mul(state.buildings[id].owned)
      .mul(glasMultiplier(state))
      .mul(achievementProductionMult(state))
      .mul(digIncomeMultiplier(state))
      .mul(generatorBoostMultiplier(state))
      .mul(arbeiterBoostMultiplier(state))
      .mul(runTimeBoostMultiplier(state));
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
  return sum
    .mul(glasMultiplier(state))
    .mul(achievementProductionMult(state))
    .mul(digIncomeMultiplier(state))
    .mul(generatorBoostMultiplier(state))
    .mul(arbeiterBoostMultiplier(state))
    .mul(runTimeBoostMultiplier(state));
}

// ---- Graben: Tiefe aus gesammeltem Sandgewicht (exponentiell schwerer) ----
//
// Tonnage je Meter wächst exponentiell mit der Tiefe:
//   tPerM(d) = DIG_START_TPM · B^(d / DIG_CENTER_M),  B = DIG_CENTER_FACTOR
// (Oberfläche: DIG_START_TPM t/m; Erdmittelpunkt: das B-fache davon.)
// Gewicht bis Tiefe D = ∫₀ᴰ tPerM(d) dd = DIG_START_TPM·DIG_CENTER_M/ln(B)·(B^(D/DIG_CENTER_M) − 1).

const DIG_K = Math.log(DIG_CENTER_FACTOR); // ln(B)

/** Benötigte Tonnage, um bis Tiefe D (Meter) zu graben. */
function digWeightForDepth(depthM: number): number {
  return (
    (DIG_START_TPM * DIG_CENTER_M) / DIG_K * (Math.exp((DIG_K * depthM) / DIG_CENTER_M) - 1)
  );
}

/** Tonnage bis zum Erddurchmesser (Deckel). */
const DIG_MAX_WEIGHT = digWeightForDepth(EARTH_DIAMETER_M);

/** Gegrabene Tiefe (Meter) aus gesammelten Sandkörnern, gedeckelt beim Erddurchmesser. */
export function digDepthMeters(grains: Decimal): number {
  const tonnes = grains.div(TONNE_IN_GRAINS);
  if (tonnes.gte(DIG_MAX_WEIGHT)) return EARTH_DIAMETER_M;
  const w = tonnes.toNumber();
  if (w <= 0) return 0;
  // D = DIG_CENTER_M · ln(1 + w·ln(B)/(DIG_START_TPM·DIG_CENTER_M)) / ln(B)
  const depth =
    (DIG_CENTER_M * Math.log(1 + (w * DIG_K) / (DIG_START_TPM * DIG_CENTER_M))) / DIG_K;
  return Math.min(depth, EARTH_DIAMETER_M);
}

/** Tonnage, die ein Meter in der aktuellen Tiefe kostet (exponentiell). */
export function tonnesPerMeterAt(depthM: number): number {
  return DIG_START_TPM * Math.exp((DIG_K * depthM) / DIG_CENTER_M);
}

/** Benötigte Sandkörner, um bis Tiefe D (Meter) zu graben. */
export function grainsForDepth(depthM: number): Decimal {
  return new Decimal(digWeightForDepth(depthM)).mul(TONNE_IN_GRAINS);
}

/** Gesammeltes Gewicht in Tonnen (für die Graben-Anzeige). */
export function weightInTonnes(grains: Decimal): Decimal {
  return grains.div(TONNE_IN_GRAINS);
}

/** Ist die maximale Grabtiefe (Erddurchmesser) erreicht? */
export function isMaxDepth(depthM: number): boolean {
  return depthM >= EARTH_DIAMETER_M;
}

/** Anzahl erreichter Graben-Meilensteine bei der aktuellen Tiefe. */
export function digMilestonesReached(depthM: number): number {
  let n = 0;
  for (const m of DIG_MILESTONES) if (depthM >= m.m) n++;
  return n;
}

/** Einkommens-Multiplikator aus Graben-Meilensteinen: 1 + 0,01 je Meilenstein (Klick & Produktion). */
export function digIncomeMultiplier(state: GameState): Decimal {
  const reached = digMilestonesReached(digDepthMeters(state.runSandEver));
  return new Decimal(1 + DIG_MILESTONE_BONUS_PER * reached);
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

/** Umkehrung: Sand, das nötig ist, um insgesamt k Glas zu gewinnen (k² · 1e9). */
export function sandForGlas(k: number): Decimal {
  return GLAS_UNLOCK.mul(k * k);
}

/** Sand für das nächste Glas (aktueller Ertrag + 1). */
export function sandForNextGlas(state: GameState): Decimal {
  const g = glasGain(state).toNumber();
  return sandForGlas(g + 1);
}

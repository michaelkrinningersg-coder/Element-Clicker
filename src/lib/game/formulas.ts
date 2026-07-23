import { Decimal, ZERO, ONE } from "./decimal";
import {
  ACH_COST_PER,
  ACH_PROD_PER,
  ARBEITER_BOOST_PER,
  AMBER_BONUS_PER,
  AMBER_CHANCE,
  BONE_BONUS_PER,
  COMPLETION_EFFECTS,
  DIG_COMPLETION_PROD_PER,
  DINO_CHANCE,
  DINOS,
  EVENT_PROD_MULT,
  EXCAVATION_MAX_M,
  METEOR_BONUS_PER,
  METEOR_CHANCE,
  MENSCH_ARBEITER_PER,
  SANDUHR_RATE_PER,
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
import { unlockedCount, effectiveCompletions } from "./achievements";
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

/**
 * Boost auf alle Generatoren aus den Arbeitern: 1 + (1 % + Mensch-Bonus) je Arbeiter.
 * Jeder Abschluss der Mensch-Tiefe erhöht den Bonus je Arbeiter um 0,1 %.
 */
export function arbeiterBoostMultiplier(state: GameState): Decimal {
  const owned = state.buildings.arbeiter?.owned ?? 0;
  const menschCompletions = effectiveDigCompletions(state, "mensch");
  const perArbeiter = ARBEITER_BOOST_PER + MENSCH_ARBEITER_PER * menschCompletions;
  return new Decimal(1 + perArbeiter * owned);
}

/**
 * Zeit-Bonus dieses Runs: 1 + Rate je Sekunde seit dem letzten Prestige.
 * Die Rate steigt mit jedem Sanduhr-Abschluss (+0,002 %-Punkte).
 */
export function runTimeBoostRate(state: GameState): number {
  return TIME_BOOST_PER + SANDUHR_RATE_PER * effectiveCompletions(state, "sanduhr");
}
export function runTimeBoostMultiplier(state: GameState): Decimal {
  return new Decimal(1 + runTimeBoostRate(state) * state.runPlaytimeSeconds);
}

/** Produktions-Multiplikator eines Gebäudes aus seinen Bauwerk-Abschlüssen. */
export function completionBuildingMult(state: GameState, buildingId: string): Decimal {
  let pct = 0;
  for (const achId in COMPLETION_EFFECTS) {
    const count = effectiveCompletions(state, achId);
    if (!count) continue;
    for (const e of COMPLETION_EFFECTS[achId]) {
      if (e.building === buildingId) pct += e.pct * count;
    }
  }
  return new Decimal(1 + pct / 100);
}

/** Effektive Abschlüsse einer Graben-Tiefe: gebankt + 1, falls diesen Run erreicht. */
export function effectiveDigCompletions(state: GameState, id: string): number {
  const mile = DIG_MILESTONES.find((x) => x.id === id);
  const banked = state.digCompletions?.[id] ?? 0;
  const reached = mile ? digDepthMeters(state.runSandEver) >= mile.m : false;
  return banked + (reached ? 1 : 0);
}

/** Gesamtzahl der (effektiven) Graben-Abschlüsse über alle Meilensteine. */
export function totalDigCompletions(state: GameState): number {
  const depth = digDepthMeters(state.runSandEver);
  let n = 0;
  for (const mile of DIG_MILESTONES) {
    n += (state.digCompletions?.[mile.id] ?? 0) + (depth >= mile.m ? 1 : 0);
  }
  return n;
}

/** Generischer Produktions-Bonus aus Graben-Abschlüssen: +0,1 % je Abschluss. */
export function digCompletionMultiplier(state: GameState): Decimal {
  return new Decimal(1 + DIG_COMPLETION_PROD_PER * totalDigCompletions(state));
}

/** Event-Multiplikator: ×5 auf die Produktion, solange "Es ist Gottes Wille" läuft. */
export function eventMultiplier(state: GameState): Decimal {
  return new Decimal(state.eventRemaining > 0 ? EVENT_PROD_MULT : 1);
}

/**
 * Wertet neu vollständig gegrabene Meter (1–EXCAVATION_MAX_M) aus.
 * Je Meter EIN Wurf → höchstens ein Fund: Meteoritensplitter (0,05 %),
 * sonst Dino-Knochen (5 %), sonst Bernstein (2,5 %), sonst nichts.
 */
export function stepExcavation(
  depthM: number,
  excavatedMeter: number,
  rng: () => number,
): { meter: number; bones: number; amber: number; shards: number } {
  const target = Math.min(EXCAVATION_MAX_M, Math.floor(depthM));
  let meter = excavatedMeter;
  let bones = 0;
  let amber = 0;
  let shards = 0;
  while (meter < target) {
    meter++;
    const r = rng();
    if (r < METEOR_CHANCE) shards++;
    else if (r < METEOR_CHANCE + DINO_CHANCE) bones++;
    else if (r < METEOR_CHANCE + DINO_CHANCE + AMBER_CHANCE) amber++;
  }
  return { meter, bones, amber, shards };
}

/** Summe der Bonus-Prozente aus zusammengesetzten Dinos. */
export function dinoBonusPct(state: GameState): number {
  let pct = 0;
  for (const d of DINOS) if (state.dinosBuilt?.[d.id]) pct += d.bonusPct;
  return pct;
}

/**
 * Sand-Produktions-Multiplikator aus Ausgrabungs-Funden:
 * +1 % je Knochen, +0,1 % je Bernstein, +25 % je Splitter, + zusammengesetzte Dinos.
 */
export function excavationBonusMultiplier(state: GameState): Decimal {
  const bonus =
    BONE_BONUS_PER * state.dinoBones +
    AMBER_BONUS_PER * state.amber +
    METEOR_BONUS_PER * state.meteorShards +
    dinoBonusPct(state) / 100;
  return new Decimal(1 + bonus);
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
      .mul(completionBuildingMult(state, id))
      .mul(glasMultiplier(state))
      .mul(achievementProductionMult(state))
      .mul(digIncomeMultiplier(state))
      .mul(generatorBoostMultiplier(state))
      .mul(arbeiterBoostMultiplier(state))
      .mul(runTimeBoostMultiplier(state))
      .mul(digCompletionMultiplier(state))
      .mul(excavationBonusMultiplier(state))
      .mul(eventMultiplier(state));
  }
  return ZERO;
}

/** Gesamte Sand/Sek. inkl. Glas & Bauwerk-Bonus. */
export function totalProductionPerSec(state: GameState): Decimal {
  let sum = ZERO;
  for (const b of BUILDINGS) {
    if (b.kind === "generator" && b.prodPerUnit) {
      // Pro-Gebäude-Abschlussbonus wirkt nur auf das jeweilige Gebäude.
      sum = sum.add(
        b.prodPerUnit.mul(state.buildings[b.id].owned).mul(completionBuildingMult(state, b.id)),
      );
    }
  }
  return sum
    .mul(glasMultiplier(state))
    .mul(achievementProductionMult(state))
    .mul(digIncomeMultiplier(state))
    .mul(generatorBoostMultiplier(state))
    .mul(arbeiterBoostMultiplier(state))
    .mul(runTimeBoostMultiplier(state))
    .mul(digCompletionMultiplier(state))
    .mul(excavationBonusMultiplier(state))
    .mul(eventMultiplier(state));
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

/** Prestige erlaubt, sobald in diesem Run ≥ 1e9 Sand gesammelt wurde. */
export function canPrestige(state: GameState): boolean {
  return state.runSandEver.gte(GLAS_UNLOCK);
}

/**
 * Wie viel Glas ein Prestige einbringt: floor(sqrt(Run-Sand / 1e9)), min. 1.
 * Basis ist der in diesem Prestige insgesamt gesammelte Sand (nicht der aktuelle).
 */
export function glasGain(state: GameState): Decimal {
  if (state.runSandEver.lt(GLAS_UNLOCK)) return ZERO;
  const g = state.runSandEver.div(GLAS_UNLOCK).sqrt().floor();
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

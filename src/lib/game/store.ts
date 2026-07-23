import { writable } from "svelte/store";
import {
  AUTOSAVE_INTERVAL_S,
  DIG_MILESTONES,
  EVENT_DURATION_S,
  EVENT_INTERVAL_MAX_S,
  EVENT_INTERVAL_MIN_S,
  EXCAVATION_UNLOCK_PRESTIGE,
  DINOS,
  SPLITTER_PER_METAL,
} from "./constants";
import { BUILDINGS, BUILDING_BY_ID, isBuildingUnlocked } from "./buildings";
import {
  canPrestige,
  clickValue,
  digDepthMeters,
  glasGain,
  growthRate,
  stepExcavation,
  totalProductionPerSec,
} from "./formulas";
import {
  createInitialState,
  prestigeReset,
  recomputeNextCosts,
  type GameState,
} from "./state";
import { ACHIEVEMENTS, unlockedCount } from "./achievements";
import { applyOfflineProgress, loadGame, saveGame } from "./save";

const initial = loadGame();
export const offlineReport = applyOfflineProgress(initial);

let state: GameState = initial;
// Offline-Sand kann Bauwerke freischalten → Rabatt auf Startkosten anwenden.
recomputeNextCosts(state);
let lastUnlocked = unlockedCount(state);

export const game = writable<GameState>(state);

let sinceAutosave = 0;
function commit(): void {
  game.set(state);
}

/** Prüft, ob ein neues Bauwerk freigeschaltet wurde, und wendet den Rabatt an. */
function syncAchievements(): void {
  const count = unlockedCount(state);
  if (count !== lastUnlocked) {
    lastUnlocked = count;
    recomputeNextCosts(state);
  }
}

// ---- Aktionen ----

export function click(): void {
  const gained = clickValue(state);
  state.sand = state.sand.add(gained);
  state.totalSandEver = state.totalSandEver.add(gained);
  state.runSandEver = state.runSandEver.add(gained);
  state.totalClicks += 1;
  syncAchievements();
  commit();
}

/** Kauft bis zu `count` Einheiten eines Gebäudes (bricht bei fehlendem Sand ab). */
export function buyBuildings(id: string, count: number): void {
  const def = BUILDING_BY_ID[id];
  if (!def) return;
  if (!isBuildingUnlocked(def, state.prestigeCount)) return;
  const bs = state.buildings[id];
  let bought = 0;
  const cap = Math.min(count, 1_000_000);
  for (let i = 0; i < cap; i++) {
    if (state.sand.lt(bs.nextCost)) break;
    state.sand = state.sand.sub(bs.nextCost);
    const oldOwned = bs.owned;
    bs.owned += 1;
    bs.nextCost = bs.nextCost.mul(growthRate(oldOwned, def.costGrowth));
    bought++;
  }
  if (bought > 0) commit();
}

/** Kauft Gebäude einzeln in Preisreihenfolge (günstigstes zuerst), bis keiner mehr geht. */
export function buyMaxAll(): void {
  let anyBought = false;
  const SAFETY_CAP = 5_000_000;
  for (let step = 0; step < SAFETY_CAP; step++) {
    let cheapestId: string | null = null;
    for (const def of BUILDINGS) {
      if (!isBuildingUnlocked(def, state.prestigeCount)) continue;
      const bs = state.buildings[def.id];
      if (state.sand.lt(bs.nextCost)) continue;
      if (cheapestId === null || bs.nextCost.lt(state.buildings[cheapestId].nextCost)) {
        cheapestId = def.id;
      }
    }
    if (cheapestId === null) break;
    const bs = state.buildings[cheapestId];
    state.sand = state.sand.sub(bs.nextCost);
    const oldOwned = bs.owned;
    bs.owned += 1;
    bs.nextCost = bs.nextCost.mul(growthRate(oldOwned, BUILDING_BY_ID[cheapestId].costGrowth));
    anyBought = true;
  }
  if (anyBought) commit();
}

/** Bankt die in diesem Run erreichten Bauwerke & Graben-Tiefen als Abschlüsse. */
function bankCompletions(): void {
  for (const a of ACHIEVEMENTS) {
    if (state.runSandEver.gte(a.threshold)) {
      state.completions[a.id] = (state.completions[a.id] ?? 0) + 1;
    }
  }
  const depth = digDepthMeters(state.runSandEver);
  for (const m of DIG_MILESTONES) {
    if (depth >= m.m) {
      state.digCompletions[m.id] = (state.digCompletions[m.id] ?? 0) + 1;
    }
  }
}

/** Prestige: Glas gewinnen, Abschlüsse banken, Sand + Gebäude + Run zurücksetzen. */
export function prestige(): void {
  if (!canPrestige(state)) return;
  const gain = glasGain(state);
  if (gain.lte(0)) return;
  state.glas = state.glas.add(gain);
  state.prestigeCount += 1;
  bankCompletions(); // erreichte Bauwerke/Tiefen dauerhaft gutschreiben
  prestigeReset(state);
  lastUnlocked = unlockedCount(state); // Bauwerke zurückgesetzt
  commit();
}

/** Ausgrabungen: wertet neu gegrabene Meter aus (ab EXCAVATION_UNLOCK_PRESTIGE). */
function updateExcavation(): void {
  if (state.prestigeCount < EXCAVATION_UNLOCK_PRESTIGE) return;
  const depth = digDepthMeters(state.runSandEver);
  const { meter, bones, amber, shards } = stepExcavation(depth, state.excavatedMeter, Math.random);
  if (meter !== state.excavatedMeter) {
    state.excavatedMeter = meter;
    state.dinoBones += bones;
    state.amber += amber;
    state.meteorShards += shards;
  }
}

/** Setzt einen Dino zusammen (verbraucht Knochen, nur einmal möglich). */
export function buildDino(id: string): void {
  const def = DINOS.find((d) => d.id === id);
  if (!def) return;
  if (state.dinosBuilt[id]) return;
  if (state.dinoBones < def.cost) return;
  state.dinoBones -= def.cost;
  state.dinosBuilt[id] = true;
  commit();
}

/** Schmilzt Meteoritensplitter zu Metall ein (100 Splitter → 1 Metall). */
export function meltShards(): void {
  const metal = Math.floor(state.meteorShards / SPLITTER_PER_METAL);
  if (metal <= 0) return;
  state.meteorShards -= metal * SPLITTER_PER_METAL;
  state.metal += metal;
  commit();
}

/** Event-Timer: löst "Es ist Gottes Wille" aus und lässt es ablaufen. */
function updateEvent(dt: number): void {
  if (state.eventRemaining > 0) {
    state.eventRemaining = Math.max(0, state.eventRemaining - dt);
  } else {
    state.eventCooldown -= dt;
    if (state.eventCooldown <= 0) {
      state.eventRemaining = EVENT_DURATION_S;
      state.eventCooldown =
        EVENT_INTERVAL_MIN_S + Math.random() * (EVENT_INTERVAL_MAX_S - EVENT_INTERVAL_MIN_S);
    }
  }
}

// ---- Tick-Engine ----

export function tick(dtSeconds: number): void {
  const gained = totalProductionPerSec(state).mul(dtSeconds);
  state.sand = state.sand.add(gained);
  state.totalSandEver = state.totalSandEver.add(gained);
  state.runSandEver = state.runSandEver.add(gained);
  state.playtimeSeconds += dtSeconds;
  state.runPlaytimeSeconds += dtSeconds;
  updateEvent(dtSeconds);
  updateExcavation();
  syncAchievements();
  sinceAutosave += dtSeconds;
  if (sinceAutosave >= AUTOSAVE_INTERVAL_S) {
    sinceAutosave = 0;
    saveGame(state);
  }
  commit();
}

export function forceSave(): void {
  saveGame(state);
}

export function hardReset(): void {
  state = createInitialState();
  lastUnlocked = unlockedCount(state);
  saveGame(state);
  commit();
}

export function getState(): GameState {
  return state;
}

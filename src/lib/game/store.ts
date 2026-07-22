import { writable } from "svelte/store";
import { AUTOSAVE_INTERVAL_S } from "./constants";
import { BUILDINGS, BUILDING_BY_ID } from "./buildings";
import {
  canPrestige,
  clickValue,
  glasGain,
  growthRate,
  totalProductionPerSec,
} from "./formulas";
import {
  createInitialState,
  prestigeReset,
  recomputeNextCosts,
  type GameState,
} from "./state";
import { unlockedCount } from "./achievements";
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
  state.totalClicks += 1;
  syncAchievements();
  commit();
}

/** Kauft bis zu `count` Einheiten eines Gebäudes (bricht bei fehlendem Sand ab). */
export function buyBuildings(id: string, count: number): void {
  const def = BUILDING_BY_ID[id];
  if (!def) return;
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

/** Prestige: Glas gewinnen, Sand + Gebäude zurücksetzen. */
export function prestige(): void {
  if (!canPrestige(state)) return;
  const gain = glasGain(state);
  if (gain.lte(0)) return;
  state.glas = state.glas.add(gain);
  state.prestigeCount += 1;
  prestigeReset(state);
  commit();
}

// ---- Tick-Engine ----

export function tick(dtSeconds: number): void {
  const gained = totalProductionPerSec(state).mul(dtSeconds);
  state.sand = state.sand.add(gained);
  state.totalSandEver = state.totalSandEver.add(gained);
  state.playtimeSeconds += dtSeconds;
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

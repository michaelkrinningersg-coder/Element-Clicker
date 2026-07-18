import { writable } from "svelte/store";
import { Decimal, ONE } from "./decimal";
import {
  AUTOSAVE_INTERVAL_S,
  CLICK_BASE,
  GRAVITON_AE_COST,
  GRAVITON_H_COST,
  IGNITION_KELVIN,
  KELVIN_PER_AE,
  TWO_MOL,
  TWO_MOL_H,
} from "./constants";
import { GENERATOR_BY_ID } from "./generators";
import { CLICK_UPGRADE_BY_ID } from "./clickUpgrades";
import {
  clickValue,
  growthRate,
  potentialAE,
  totalProductionPerSec,
} from "./formulas";
import {
  createInitialState,
  softResetRun,
  type GameState,
} from "./state";
import { FUSION_RECIPES, type FusableSymbol } from "./elements";
import { evaluateAchievements } from "./achievements";
import { applyOfflineProgress, loadGame, saveGame } from "./save";

/** Beim Laden: Save einlesen + Offline-Fortschritt anrechnen. */
const initial = loadGame();
export const offlineReport = applyOfflineProgress(initial);
// Achievements aus geladenem Stand nachziehen (z.B. alte Saves).
evaluateAchievements(initial);

let state: GameState = initial;
export const game = writable<GameState>(state);

let sinceAutosave = 0;

function commit(): void {
  game.set(state);
}

// ---- Aktionen ----

export function click(): void {
  const gained = clickValue(state, CLICK_BASE);
  state.h = state.h.add(gained);
  state.lifetimeH = state.lifetimeH.add(gained);
  state.totalClicks += 1;
  evaluateAchievements(state);
  commit();
}

export function buyGenerator(id: string): void {
  const def = GENERATOR_BY_ID[id];
  if (!def) return;
  const gs = state.generators[id];
  if (state.h.lt(gs.nextCost)) return;
  state.h = state.h.sub(gs.nextCost);
  const oldOwned = gs.owned;
  gs.owned += 1;
  gs.nextCost = gs.nextCost.mul(growthRate(oldOwned));
  state.totalGeneratorsBought += 1;
  evaluateAchievements(state);
  commit();
}

/** Kauft ein Klick-Upgrade (einmalig, permanent). */
export function buyClickUpgrade(id: string): void {
  const def = CLICK_UPGRADE_BY_ID[id];
  if (!def) return;
  if (state.clickUpgrades.includes(id)) return;
  if (state.h.lt(def.cost)) return;
  state.h = state.h.sub(def.cost);
  state.clickUpgrades = [...state.clickUpgrades, id];
  commit();
}

/** Ebene 0: Wolke kollabieren -> Aktivierungsenergie sammeln. */
export function collapseCloud(): void {
  const gain = potentialAE(state.h, state.gravitons);
  if (gain.lte(0)) return;
  state.ae = state.ae.add(gain);
  state.collapseCount += 1;
  softResetRun(state);
  commit();
}

/** AE in Kelvin umwandeln (einweg). Verbrauchte AE geben keinen Boost mehr. */
export function convertAEtoKelvin(amount: Decimal): void {
  const amt = Decimal.min(amount, state.ae);
  if (amt.lte(0)) return;
  state.ae = state.ae.sub(amt);
  state.kelvin = state.kelvin.add(amt.mul(KELVIN_PER_AE));
  commit();
}

/** Alle verfügbare AE auf einmal in Kelvin umwandeln. */
export function convertAllAEtoKelvin(): void {
  convertAEtoKelvin(state.ae);
}

/** Zündung: einmalig, ab 10 Mio K. Schaltet die Fusion H->He frei. */
export function ignite(): void {
  if (state.ignited) return;
  if (state.kelvin.lt(IGNITION_KELVIN)) return;
  state.ignited = true;
  state.igniteCount += 1;
  // Fusion läuft ab jetzt vollautomatisch (siehe autoFuseStep im Tick).
  state.autoFusion = true;
  commit();
}

/**
 * Führt `count` Fusionen 2 mol X -> 1 mol (X+1) aus und schreibt Teilchen gut.
 * Ohne Guards – Aufrufer stellt sicher, dass genug Ausgangsstoff da ist.
 */
function applyFusion(target: FusableSymbol, count: Decimal): void {
  if (count.lte(0)) return;
  const recipe = FUSION_RECIPES[target];
  if (target === "He") {
    // 2 mol H -> 1 He-Atom
    state.h = state.h.sub(TWO_MOL_H.mul(count));
    state.elements.He = state.elements.He.add(count);
  } else {
    // 2 mol des Ausgangs-Elements -> 1 Atom des nächsten
    const fromSym = recipe.from as "He" | "Li";
    state.elements[fromSym] = state.elements[fromSym].sub(TWO_MOL.mul(count));
    state.elements[target] = state.elements[target].add(count);
  }
  const bp = recipe.byproduct;
  state.particles.protons = state.particles.protons.add(count.mul(bp.protons));
  state.particles.neutrons = state.particles.neutrons.add(count.mul(bp.neutrons));
  state.particles.electrons = state.particles.electrons.add(count.mul(bp.electrons));
  state.particles.positrons = state.particles.positrons.add(count.mul(bp.positrons));
  state.unlocked[target] = true;
}

/**
 * Manuelle Einzel-Fusion. Die erste H->He-Fusion aktiviert die Auto-Fusion:
 * ab dann läuft die gesamte Kette (H->He->Li->Be) automatisch im Tick.
 */
export function fuse(target: FusableSymbol): void {
  if (target === "He") {
    if (!state.ignited || state.h.lt(TWO_MOL_H)) return;
    applyFusion("He", ONE);
    state.autoFusion = true;
  } else {
    const fromSym = FUSION_RECIPES[target].from as "He" | "Li";
    if (state.elements[fromSym].lt(TWO_MOL)) return;
    applyFusion(target, ONE);
  }
  commit();
}

/**
 * Auto-Fusion pro Tick: fusioniert je Stufe so oft wie möglich (Bulk) und
 * kaskadiert H->He->Li->Be, damit frisch erzeugtes He/Li sofort weiterläuft.
 */
function autoFuseStep(): void {
  if (state.h.gte(TWO_MOL_H)) {
    applyFusion("He", state.h.div(TWO_MOL_H).floor());
  }
  if (state.elements.He.gte(TWO_MOL)) {
    applyFusion("Li", state.elements.He.div(TWO_MOL).floor());
  }
  if (state.elements.Li.gte(TWO_MOL)) {
    applyFusion("Be", state.elements.Li.div(TWO_MOL).floor());
  }
}

/** Ebene 2: Nebel kollabieren -> Graviton (verbraucht AE + H). */
export function collapseNebula(): void {
  if (!state.ignited) return;
  if (state.ae.lt(GRAVITON_AE_COST)) return;
  if (state.h.lt(GRAVITON_H_COST)) return;
  state.ae = state.ae.sub(GRAVITON_AE_COST);
  state.gravitons = state.gravitons.add(ONE);
  state.nebulaCount += 1;
  softResetRun(state);
  commit();
}

// ---- Tick-Engine ----

export function tick(dtSeconds: number): void {
  const produced = totalProductionPerSec(state).mul(dtSeconds);
  state.h = state.h.add(produced);
  state.lifetimeH = state.lifetimeH.add(produced);
  if (state.autoFusion) autoFuseStep();
  state.playtimeSeconds += dtSeconds;
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
  saveGame(state);
  commit();
}

/** Nur für Tests / Debug: aktuellen Zustand lesen. */
export function getState(): GameState {
  return state;
}

import { writable } from "svelte/store";
import { Decimal, ONE } from "./decimal";
import {
  AUTOSAVE_INTERVAL_S,
  CLICK_BASE,
  GRAVITON_AE_COST,
  GRAVITON_H_COST,
  IGNITION_KELVIN,
  KELVIN_PER_AE,
  TWO_MOL_H,
} from "./constants";
import { GENERATOR_BY_ID } from "./generators";
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
import { applyOfflineProgress, loadGame, saveGame } from "./save";

/** Beim Laden: Save einlesen + Offline-Fortschritt anrechnen. */
const initial = loadGame();
export const offlineReport = applyOfflineProgress(initial);

let state: GameState = initial;
export const game = writable<GameState>(state);

let sinceAutosave = 0;

function commit(): void {
  game.set(state);
}

// ---- Aktionen ----

export function click(): void {
  state.h = state.h.add(clickValue(state, CLICK_BASE));
  state.totalClicks += 1;
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
  commit();
}

/** Ebene 0: Wolke kollabieren -> Aktivierungsenergie sammeln. */
export function collapseCloud(): void {
  const gain = potentialAE(state.h, state.gravitons);
  if (gain.lte(0)) return;
  state.ae = state.ae.add(gain);
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
  commit();
}

/** Fusion: 2 mol X -> 1 mol (X+1) + Teilchen. */
export function fuse(target: FusableSymbol): void {
  const recipe = FUSION_RECIPES[target];
  if (target === "He") {
    if (!state.ignited) return;
    if (state.h.lt(TWO_MOL_H)) return;
    state.h = state.h.sub(TWO_MOL_H);
    state.elements.He = state.elements.He.add(ONE);
  } else {
    const fromSym = recipe.from as "He" | "Li";
    const have = state.elements[fromSym];
    if (have.lt(2)) return;
    state.elements[fromSym] = have.sub(2);
    state.elements[target] = state.elements[target].add(ONE);
  }
  // Teilchen gutschreiben (erstmal nur sammeln)
  const bp = recipe.byproduct;
  state.particles.protons = state.particles.protons.add(bp.protons);
  state.particles.neutrons = state.particles.neutrons.add(bp.neutrons);
  state.particles.electrons = state.particles.electrons.add(bp.electrons);
  state.particles.positrons = state.particles.positrons.add(bp.positrons);
  state.unlocked[target] = true;
  commit();
}

/** Ebene 2: Nebel kollabieren -> Graviton (verbraucht AE + H). */
export function collapseNebula(): void {
  if (!state.ignited) return;
  if (state.ae.lt(GRAVITON_AE_COST)) return;
  if (state.h.lt(GRAVITON_H_COST)) return;
  state.ae = state.ae.sub(GRAVITON_AE_COST);
  state.gravitons = state.gravitons.add(ONE);
  softResetRun(state);
  commit();
}

// ---- Tick-Engine ----

export function tick(dtSeconds: number): void {
  state.h = state.h.add(totalProductionPerSec(state).mul(dtSeconds));
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

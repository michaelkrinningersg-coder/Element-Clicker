import { Decimal, ZERO } from "./decimal";
import { GENERATORS } from "./generators";
import { costForNext } from "./formulas";

/** Persistenter Spielzustand. Decimals werden beim Speichern zu Strings. */
export interface GeneratorState {
  owned: number;
  nextCost: Decimal;
}

export interface GameState {
  // Ressourcen
  h: Decimal; // Wasserstoff (Atome), Run-lokal (Reset bei Kollaps)
  elements: { He: Decimal; Li: Decimal; Be: Decimal }; // in mol
  particles: {
    protons: Decimal;
    neutrons: Decimal;
    electrons: Decimal;
    positrons: Decimal;
  }; // in mol, werden erstmal nur gesammelt

  // Prestige
  ae: Decimal; // Aktivierungsenergie
  kelvin: Decimal; // aufgebaute Temperatur Richtung Zündung
  gravitons: Decimal;
  ignited: boolean; // Zündung erfolgt (Fusion H->He freigeschaltet)
  autoFusion: boolean; // ab der 1. manuellen Fusion: gesamte Kette läuft automatisch

  // Freischaltungen im Periodensystem
  unlocked: { He: boolean; Li: boolean; Be: boolean };

  // Generatoren
  generators: Record<string, GeneratorState>;

  // Gekaufte Klick-Upgrades (permanent, Reihenfolge egal)
  clickUpgrades: string[];

  // Meta
  totalClicks: number;
  playtimeSeconds: number;
  lastSaved: number; // ms seit Epoch
}

export function createInitialState(): GameState {
  const generators: Record<string, GeneratorState> = {};
  for (const g of GENERATORS) {
    generators[g.id] = { owned: 0, nextCost: g.baseCost };
  }
  return {
    h: ZERO,
    elements: { He: ZERO, Li: ZERO, Be: ZERO },
    particles: { protons: ZERO, neutrons: ZERO, electrons: ZERO, positrons: ZERO },
    ae: ZERO,
    kelvin: ZERO,
    gravitons: ZERO,
    ignited: false,
    autoFusion: false,
    unlocked: { He: false, Li: false, Be: false },
    generators,
    clickUpgrades: [],
    totalClicks: 0,
    playtimeSeconds: 0,
    lastSaved: Date.now(),
  };
}

/** Setzt Run-lokale Werte zurück (H, fusionierte Elemente, Generatoren). */
export function softResetRun(state: GameState): void {
  state.h = ZERO;
  state.elements = { He: ZERO, Li: ZERO, Be: ZERO };
  for (const g of GENERATORS) {
    state.generators[g.id] = { owned: 0, nextCost: g.baseCost };
  }
}

/** Stellt nextCost aller Generatoren aus den `owned`-Zahlen wieder her. */
export function recomputeNextCosts(state: GameState): void {
  for (const g of GENERATORS) {
    const gs = state.generators[g.id];
    gs.nextCost = costForNext(g.baseCost, gs.owned);
  }
}

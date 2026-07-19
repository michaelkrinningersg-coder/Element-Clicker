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
  runEarnedH: Decimal; // insgesamt in diesem Run verdientes H (sinkt nicht beim Ausgeben); Basis für den AE-Ertrag
  runSeconds: number; // Sekunden seit dem letzten Kollaps (Run-Zeit-Bonus)
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

  // Gekaufte Generator-Upgrades (permanent)
  generatorUpgrades: string[];

  // Gekaufte Fusions-/Chemie-Upgrades (permanent)
  fusionUpgrades: string[];

  // Freigeschaltete Achievements (permanent)
  achievements: string[];

  // Meta / Statistik (alles permanent, überlebt Kollaps)
  totalClicks: number;
  totalGeneratorsBought: number; // gekaufte Gebäude gesamt (lifetime)
  collapseCount: number; // Wolke-Kollapse
  nebulaCount: number; // Nebel-Kollapse
  igniteCount: number; // Zündungen
  lifetimeH: Decimal; // insgesamt jemals erzeugtes H
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
    runEarnedH: ZERO,
    runSeconds: 0,
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
    generatorUpgrades: [],
    fusionUpgrades: [],
    achievements: [],
    totalClicks: 0,
    totalGeneratorsBought: 0,
    collapseCount: 0,
    nebulaCount: 0,
    igniteCount: 0,
    lifetimeH: ZERO,
    playtimeSeconds: 0,
    lastSaved: Date.now(),
  };
}

/** Setzt Run-lokale Werte zurück (H, fusionierte Elemente, Generatoren). */
export function softResetRun(state: GameState): void {
  state.h = ZERO;
  state.runEarnedH = ZERO;
  state.runSeconds = 0;
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

import { Decimal, ZERO } from "./decimal";
import { BUILDINGS } from "./buildings";
import { costForNext, costMultiplier } from "./formulas";

export interface BuildingState {
  owned: number;
  nextCost: Decimal;
}

export interface GameState {
  sand: Decimal;
  buildings: Record<string, BuildingState>;

  // Prestige
  glas: Decimal;
  prestigeCount: number;

  // Abschlüsse (dauerhaft, über Prestige hinaus)
  completions: Record<string, number>; // Bauwerk-Id → wie oft abgeschlossen
  digCompletions: Record<string, number>; // Graben-Meilenstein-Id → wie oft erreicht

  // Event "Es ist Gottes Wille"
  eventRemaining: number; // Sekunden verbleibend (0 = kein aktives Event)
  eventCooldown: number; // Sekunden bis zum nächsten Event

  // Ausgrabungen (ab 10 Prestiges) – Funde sind dauerhafte Prestige-Währungen
  dinoBones: number; // Dino-Knochen (Währung, für Dinos ausgebbar), +1 % Sand je Stück
  amber: number; // Bernstein, +0,1 % Sand je Stück
  meteorShards: number; // Meteoritensplitter, +25 % Sand je Stück
  metal: number; // aus Splittern eingeschmolzenes Metall
  excavationHelpers: number; // Ausgrabungshilfen (je +0,1 % Fundchance)
  dinosBuilt: Record<string, boolean>; // zusammengesetzte Dinos (je einmal)
  excavatedMeter: number; // höchster diesen Run ausgewerteter Meter (Reset bei Prestige)

  // Statistik / Lifetime
  totalSandEver: Decimal; // je gesammelte Sandkörner (bleibt bei Prestige)
  runSandEver: Decimal; // in diesem Run gesammelt (Basis für Bauwerke & Graben, Reset bei Prestige)
  totalClicks: number;
  playtimeSeconds: number; // gesamte aktive Spielzeit (Lifetime)
  runPlaytimeSeconds: number; // Spielzeit in diesem Prestige (Reset bei Prestige)
  lastSaved: number;
}

export function createInitialState(): GameState {
  const buildings: Record<string, BuildingState> = {};
  for (const b of BUILDINGS) buildings[b.id] = { owned: 0, nextCost: b.baseCost };
  return {
    sand: ZERO,
    buildings,
    glas: ZERO,
    prestigeCount: 0,
    completions: {},
    digCompletions: {},
    eventRemaining: 0,
    eventCooldown: 1500,
    dinoBones: 0,
    amber: 0,
    meteorShards: 0,
    metal: 0,
    excavationHelpers: 0,
    dinosBuilt: {},
    excavatedMeter: 0,
    totalSandEver: ZERO,
    runSandEver: ZERO,
    totalClicks: 0,
    playtimeSeconds: 0,
    runPlaytimeSeconds: 0,
    lastSaved: Date.now(),
  };
}

/** Stellt nextCost aller Gebäude aus den `owned`-Zahlen wieder her (inkl. Bauwerk-Rabatt). */
export function recomputeNextCosts(state: GameState): void {
  const costMult = costMultiplier(state);
  for (const b of BUILDINGS) {
    const bs = state.buildings[b.id];
    bs.nextCost = costForNext(b.baseCost, bs.owned, b.costGrowth, costMult);
  }
}

/**
 * Prestige-Reset: Sand + Gebäude + Run-Fortschritt (Bauwerke & Graben) zurück.
 * Glas, Lifetime-Statistik (totalSandEver) & Meta bleiben.
 */
export function prestigeReset(state: GameState): void {
  state.sand = ZERO;
  state.runSandEver = ZERO; // Bauwerke & Graben setzen sich zurück
  state.runPlaytimeSeconds = 0; // Run-Zeit-Bonus zurück
  state.excavatedMeter = 0; // Ausgrabungen des Runs zurück (Dino-Knochen bleiben)
  for (const b of BUILDINGS) {
    state.buildings[b.id] = { owned: 0, nextCost: b.baseCost };
  }
  // Kosten neu (Bauwerk-Rabatt jetzt weg, da runSandEver = 0).
  recomputeNextCosts(state);
}

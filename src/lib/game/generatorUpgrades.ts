import { Decimal } from "./decimal";

/**
 * Generator-Upgrades: einmalige Käufe (mit H) mit Freischalt-Bedingung und
 * dynamischem Effekt. Permanent (überleben Kollaps, wie Klick-Upgrades).
 *
 * Effekt "outputPerGenerator": multipliziert den Output des Ziel-Generators
 * mit (1 + factorPerUnit * Anzahl(perGeneratorId)).
 */
export interface GeneratorUpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: Decimal;
  /** Kaufbar, sobald generatorId >= amount besessen. */
  unlock: { generatorId: string; amount: number };
  effect: { targetId: string; perGeneratorId: string; factorPerUnit: number };
}

export const GENERATOR_UPGRADES: GeneratorUpgradeDef[] = [
  {
    id: "gu1",
    name: "Filament-Resonanz",
    description: "+2 % Molekülwolken-Output je Wasserstoff-Filament.",
    cost: new Decimal(200_000),
    unlock: { generatorId: "g1", amount: 15 },
    effect: { targetId: "g1", perGeneratorId: "g2", factorPerUnit: 0.02 },
  },
];

export const GENERATOR_UPGRADE_BY_ID: Record<string, GeneratorUpgradeDef> =
  Object.fromEntries(GENERATOR_UPGRADES.map((u) => [u.id, u]));

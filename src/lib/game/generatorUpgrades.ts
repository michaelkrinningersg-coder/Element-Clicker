import { Decimal } from "./decimal";

/**
 * Generator-Upgrades: einmalige Käufe (mit H) mit Freischalt-Bedingung.
 * Permanent (überleben Kollaps, wie Klick-Upgrades).
 *
 * Effekt-Typen:
 *  - "outputPerGenerator": Ziel-Generator-Output × (1 + faktor * Anzahl(perGeneratorId)),
 *    wobei der Faktor durch "boostUpgradeFactor"-Upgrades erhöht werden kann.
 *  - "boostUpgradeFactor": erhöht den factorPerUnit eines anderen Upgrades um
 *    factorPerUnit * Anzahl(perGeneratorId).
 */
export type GeneratorUpgradeEffect =
  | { kind: "outputPerGenerator"; targetId: string; perGeneratorId: string; factorPerUnit: number }
  | { kind: "boostUpgradeFactor"; targetUpgradeId: string; perGeneratorId: string; factorPerUnit: number };

export interface GeneratorUpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: Decimal;
  /** Kaufbar, sobald generatorId >= amount besessen. */
  unlock: { generatorId: string; amount: number };
  effect: GeneratorUpgradeEffect;
}

export const GENERATOR_UPGRADES: GeneratorUpgradeDef[] = [
  {
    id: "gu1",
    name: "Filament-Resonanz",
    description: "+2 % Molekülwolken-Output je Wasserstoff-Filament.",
    cost: new Decimal(200_000),
    unlock: { generatorId: "g1", amount: 15 },
    effect: { kind: "outputPerGenerator", targetId: "g1", perGeneratorId: "g2", factorPerUnit: 0.02 },
  },
  {
    id: "gu2",
    name: "Filament-Verstärker",
    description: "+1 Prozentpunkt auf den Filament-Resonanz-Bonus je Riesenmolekülwolke.",
    cost: new Decimal("1e14"),
    unlock: { generatorId: "g5", amount: 100 },
    effect: { kind: "boostUpgradeFactor", targetUpgradeId: "gu1", perGeneratorId: "g5", factorPerUnit: 0.01 },
  },
];

export const GENERATOR_UPGRADE_BY_ID: Record<string, GeneratorUpgradeDef> =
  Object.fromEntries(GENERATOR_UPGRADES.map((u) => [u.id, u]));

import { Decimal } from "./decimal";

/**
 * Fusions-/Chemie-Upgrades: einmalige Käufe (mit H), freigeschaltet ab einer
 * H-Schwelle (gesamt jemals erzeugtes H). Wirken global, permanent.
 *
 * Effekt-Typen:
 *  - "generatorCostMult": multipliziert ALLE Generator-Kosten (z.B. 0,75 = −25 %)
 *  - "runTimeBonusMult":  multipliziert die Run-Zeit-Bonus-Rate (z.B. 2 = doppelt)
 */
export type FusionUpgradeEffect =
  | { kind: "generatorCostMult"; factor: number }
  | { kind: "runTimeBonusMult"; factor: number };

export interface FusionUpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: Decimal;
  /** Freigeschaltet, sobald das GESAMT erzeugte H (lifetimeH) diese Schwelle erreicht. */
  unlockH: Decimal;
  effect: FusionUpgradeEffect;
}

export const FUSION_UPGRADES: FusionUpgradeDef[] = [
  {
    id: "fu_katalysator",
    name: "Katalysator",
    description: "Senkt die Aktivierungsenergie: −25 % auf ALLE Generator-Kosten.",
    cost: new Decimal("1e16"),
    unlockH: new Decimal("1e16"),
    effect: { kind: "generatorCostMult", factor: 0.75 },
  },
  {
    id: "fu_lawson",
    name: "Lawson-Kriterium",
    description: "Zünddichte × Zeit × Temperatur: verdoppelt den Run-Zeit-Bonus (0,01 %/s → 0,02 %/s).",
    cost: new Decimal("1e19"),
    unlockH: new Decimal("1e19"),
    effect: { kind: "runTimeBonusMult", factor: 2 },
  },
];

export const FUSION_UPGRADE_BY_ID: Record<string, FusionUpgradeDef> = Object.fromEntries(
  FUSION_UPGRADES.map((u) => [u.id, u]),
);

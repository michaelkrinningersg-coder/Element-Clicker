import { Decimal } from "./decimal";

/**
 * Klick-Upgrades: einmalige Käufe (mit H), die die Klick-Power multiplizieren.
 * Sie sind PERMANENT – bleiben über einen Wolke-Kollaps hinweg erhalten.
 * Balancing-Werte sind Startwerte.
 */
export interface ClickUpgradeDef {
  id: string;
  name: string;
  icon: string;
  cost: Decimal; // H-Kosten (einmalig)
  clickMult: number; // multiplikativer Faktor auf die Klick-Power
}

export const CLICK_UPGRADES: ClickUpgradeDef[] = [
  { id: "cu1", name: "Feinere Kollektor-Düse", icon: "🔧", cost: new Decimal(100), clickMult: 2 },
  { id: "cu2", name: "Ionenfalle", icon: "🧲", cost: new Decimal(2_500), clickMult: 2 },
  { id: "cu3", name: "Magnetische Verdichtung", icon: "🌀", cost: new Decimal(60_000), clickMult: 2 },
  { id: "cu4", name: "Kryo-Kondensator", icon: "❄️", cost: new Decimal("1.5e6"), clickMult: 2.5 },
  { id: "cu5", name: "Quanten-Kollektor", icon: "⚛️", cost: new Decimal("4e7"), clickMult: 3 },
  { id: "cu6", name: "Laser-Ionisation", icon: "🔦", cost: new Decimal("1e9"), clickMult: 3 },
  { id: "cu7", name: "Feld-Kompressor", icon: "🧊", cost: new Decimal("3e10"), clickMult: 5 },
];

export const CLICK_UPGRADE_BY_ID: Record<string, ClickUpgradeDef> = Object.fromEntries(
  CLICK_UPGRADES.map((u) => [u.id, u]),
);

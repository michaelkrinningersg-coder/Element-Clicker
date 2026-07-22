import { Decimal } from "./decimal";

/**
 * Gebäude. Zwei Typen:
 *  - "click": erhöht das Klick-Einkommen um clickPerUnit je Einheit (z.B. Hand)
 *  - "generator": erzeugt prodPerUnit Sand/Sek. je Einheit (z.B. Eimer)
 */
export interface BuildingDef {
  id: string;
  name: string;
  icon: string;
  baseCost: Decimal;
  kind: "click" | "generator";
  clickPerUnit?: number;
  prodPerUnit?: Decimal;
  desc: string;
}

export const BUILDINGS: BuildingDef[] = [
  {
    id: "hand",
    name: "Hand",
    icon: "✋",
    baseCost: new Decimal(10),
    kind: "click",
    clickPerUnit: 1,
    desc: "+1 Sand pro Klick je Hand",
  },
  {
    id: "eimer",
    name: "Eimer",
    icon: "🪣",
    baseCost: new Decimal(10),
    kind: "generator",
    prodPerUnit: new Decimal(0.2),
    desc: "+0,2 Sand/Sek. je Eimer",
  },
];

export const BUILDING_BY_ID: Record<string, BuildingDef> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
);

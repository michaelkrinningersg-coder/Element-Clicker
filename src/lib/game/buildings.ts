import { Decimal } from "./decimal";

/**
 * Gebäude. Zwei Typen:
 *  - "click": erhöht das Klick-Einkommen um clickPerUnit je Einheit (Hand)
 *  - "generator": erzeugt prodPerUnit Sand/Sek. je Einheit
 *
 * Preissprünge zwischen den Generatoren sind bewusst UNTERSCHIEDLICH stark;
 * das Ramping INNERHALB (costGrowth = feste Rate pro Kauf) steigt leicht an.
 */
export interface BuildingDef {
  id: string;
  name: string;
  icon: string; // Emoji-Fallback
  baseCost: Decimal;
  costGrowth: number; // feste Kosten-Wachstumsrate pro Kauf
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
    costGrowth: 1.15,
    kind: "click",
    clickPerUnit: 1,
    desc: "+1 Sand pro Klick je Hand",
  },
  {
    id: "eimer",
    name: "Eimer",
    icon: "🪣",
    baseCost: new Decimal(10),
    costGrowth: 1.12,
    kind: "generator",
    prodPerUnit: new Decimal(0.2),
    desc: "+0,2 Sand/Sek. je Eimer",
  },
  {
    id: "schaufel",
    name: "Schaufel",
    icon: "🥄",
    baseCost: new Decimal(150),
    costGrowth: 1.12,
    kind: "generator",
    prodPerUnit: new Decimal(2.2),
    desc: "+2,2 Sand/Sek. je Schaufel",
  },
  {
    id: "sieb",
    name: "Sieb",
    icon: "🧺",
    baseCost: new Decimal(3_000),
    costGrowth: 1.13,
    kind: "generator",
    prodPerUnit: new Decimal(30),
    desc: "+30 Sand/Sek. je Sieb",
  },
  {
    id: "arbeiter",
    name: "Arbeiter",
    icon: "👷",
    baseCost: new Decimal(36_000),
    costGrowth: 1.14,
    kind: "generator",
    prodPerUnit: new Decimal(210),
    desc: "+210 Sand/Sek. je Arbeiter",
  },
  {
    id: "lasttiere",
    name: "Lasttiere",
    icon: "🫏",
    baseCost: new Decimal(900_000),
    costGrowth: 1.15,
    kind: "generator",
    prodPerUnit: new Decimal(4_400),
    desc: "+4.400 Sand/Sek. je Lasttier",
  },
  {
    id: "handkarren",
    name: "Handkarren",
    icon: "🛒",
    baseCost: new Decimal(16_000_000),
    costGrowth: 1.17,
    kind: "generator",
    prodPerUnit: new Decimal(47_000),
    desc: "+47.000 Sand/Sek. je Handkarren",
  },
];

export const BUILDING_BY_ID: Record<string, BuildingDef> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
);

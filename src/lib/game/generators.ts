import { Decimal } from "./decimal";

/**
 * Wasserstoff-Generatoren der Frühphase mit Perk-System.
 * Bewusst UNTERSCHIEDLICHE Preis-/Output-Verhältnisse. Perks werden bei
 * bestimmten Stückzahlen freigeschaltet und wirken dauerhaft.
 */

export type PerkEffectKind =
  | "clickMult" // multipliziert die Klick-Power (global)
  | "selfOutputMult" // multipliziert den Output des eigenen Generators
  | "generatorOutputMult" // multipliziert den Output eines anderen Generators (targetId)
  | "globalMult"; // multipliziert die gesamte H/Sek.-Produktion

export interface PerkEffect {
  kind: PerkEffectKind;
  factor: number;
  targetId?: string; // nur für generatorOutputMult
}

export interface Perk {
  threshold: number; // benötigte Stückzahl
  label: string; // kurze Beschreibung für die UI
  effects: PerkEffect[];
}

export interface GeneratorDef {
  id: string;
  name: string;
  icon: string;
  baseCost: Decimal; // Kosten der 1. Einheit (in H-Atomen)
  baseProd: Decimal; // H/Sek. pro Einheit
  perks: Perk[];
}

export const GENERATORS: GeneratorDef[] = [
  {
    id: "g1",
    name: "Molekülwolke",
    icon: "🌫️",
    baseCost: new Decimal(50),
    baseProd: new Decimal(1),
    perks: [
      { threshold: 10, label: "+50 % Klick-Power", effects: [{ kind: "clickMult", factor: 1.5 }] },
      { threshold: 25, label: "×2 Molekülwolken-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 50, label: "×1,25 Klick-Power", effects: [{ kind: "clickMult", factor: 1.25 }] },
      { threshold: 75, label: "×2,5 Molekülwolken-Output", effects: [{ kind: "selfOutputMult", factor: 2.5 }] },
      {
        threshold: 100,
        label: "×2 Molekülwolken-Output & ×2 Klick-Power",
        effects: [
          { kind: "selfOutputMult", factor: 2 },
          { kind: "clickMult", factor: 2 },
        ],
      },
    ],
  },
  {
    id: "g2",
    name: "Wasserstoff-Filament",
    icon: "🧵",
    baseCost: new Decimal(600),
    baseProd: new Decimal(8),
    perks: [],
  },
  {
    id: "g3",
    name: "Bok-Globule",
    icon: "⚫",
    baseCost: new Decimal(8_500),
    baseProd: new Decimal(120),
    perks: [],
  },
  {
    id: "g4",
    name: "Kaltgas-Halo",
    icon: "🌑",
    baseCost: new Decimal(130_000),
    baseProd: new Decimal(1_400),
    perks: [],
  },
  {
    id: "g5",
    name: "Riesenmolekülwolke",
    icon: "🌌",
    baseCost: new Decimal("2.2e6"),
    baseProd: new Decimal(22_000),
    perks: [],
  },
  {
    id: "g6",
    name: "Wasserstoff-Superblase",
    icon: "🫧",
    baseCost: new Decimal("3.3e7"),
    baseProd: new Decimal(310_000),
    perks: [],
  },
  {
    id: "g7",
    name: "Galaktischer Gashalo",
    icon: "🌐",
    baseCost: new Decimal("5.5e8"),
    baseProd: new Decimal("5.5e6"),
    perks: [],
  },
  {
    id: "g8",
    name: "Kosmisches Filament",
    icon: "🕸️",
    baseCost: new Decimal("1.0e10"),
    baseProd: new Decimal("1.0e8"),
    perks: [],
  },
];

export const GENERATOR_IDS: string[] = GENERATORS.map((g) => g.id);

export const GENERATOR_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
);

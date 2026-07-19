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
  | "globalMult" // multipliziert die gesamte H/Sek.-Produktion
  | "aeGainMult"; // multipliziert den AE-Ertrag beim Wolke-Kollaps

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
  /** Additiver Bonus auf das Klick-Einkommen JE besessener Einheit
   *  (z.B. 0,25 = +25 % pro Einheit, additiv). */
  clickBonusPerUnit?: number;
  /** Additiver Output-Bonus JE besessenem Generator (alle Typen zusammen).
   *  z.B. 0,01 = +1 % Output pro Generator. */
  outputBonusPerGenerator?: number;
  /** Erhöht outputBonusPerGenerator dynamisch um factorPerUnit je Einheit von
   *  perGeneratorId (z.B. je Kosmisches Filament +0,0005). */
  outputBonusPerGeneratorBoost?: { perGeneratorId: string; factorPerUnit: number };
}

export const GENERATORS: GeneratorDef[] = [
  {
    id: "g1",
    name: "Molekülwolke",
    icon: "🌫️",
    baseCost: new Decimal(50),
    baseProd: new Decimal(1),
    clickBonusPerUnit: 0.25, // +25 % Klick-Einkommen je Molekülwolke (additiv)
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
      {
        threshold: 150,
        label: "+50 % auf alles (Produktion & Klick)",
        effects: [
          { kind: "globalMult", factor: 1.5 },
          { kind: "clickMult", factor: 1.5 },
        ],
      },
      { threshold: 200, label: "×4 Molekülwolken-Output", effects: [{ kind: "selfOutputMult", factor: 4 }] },
      { threshold: 250, label: "+25 % AE-Ertrag beim Prestige", effects: [{ kind: "aeGainMult", factor: 1.25 }] },
      {
        threshold: 300,
        label: "+15 % auf alles (Produktion & Klick)",
        effects: [
          { kind: "globalMult", factor: 1.15 },
          { kind: "clickMult", factor: 1.15 },
        ],
      },
      { threshold: 400, label: "+25 % AE-Ertrag beim Prestige", effects: [{ kind: "aeGainMult", factor: 1.25 }] },
      { threshold: 500, label: "×5 Molekülwolken-Output", effects: [{ kind: "selfOutputMult", factor: 5 }] },
    ],
  },
  {
    id: "g2",
    name: "Wasserstoff-Filament",
    icon: "🧵",
    baseCost: new Decimal(600),
    baseProd: new Decimal(8),
    clickBonusPerUnit: 0.25,
    perks: [
      { threshold: 10, label: "×2 Filament-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "+25 % Klick-Power", effects: [{ kind: "clickMult", factor: 1.25 }] },
      { threshold: 50, label: "×2 Filament-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 75, label: "+10 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.1 }] },
      { threshold: 100, label: "×3 Filament-Output", effects: [{ kind: "selfOutputMult", factor: 3 }] },
    ],
  },
  {
    id: "g3",
    name: "Bok-Globule",
    icon: "⚫",
    baseCost: new Decimal(8_500),
    baseProd: new Decimal(120),
    clickBonusPerUnit: 0.25,
    perks: [
      { threshold: 10, label: "×2 Bok-Globule-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "×2 Bok-Globule-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 50, label: "×2,5 Bok-Globule-Output", effects: [{ kind: "selfOutputMult", factor: 2.5 }] },
      { threshold: 75, label: "+15 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.15 }] },
      { threshold: 100, label: "×3 Bok-Globule-Output", effects: [{ kind: "selfOutputMult", factor: 3 }] },
    ],
  },
  {
    id: "g4",
    name: "Kaltgas-Halo",
    icon: "🌑",
    baseCost: new Decimal(130_000),
    baseProd: new Decimal(1_400),
    clickBonusPerUnit: 0.25,
    perks: [
      { threshold: 10, label: "×2 Kaltgas-Halo-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "×1,5 Molekülwolken-Output", effects: [{ kind: "generatorOutputMult", factor: 1.5, targetId: "g1" }] },
      { threshold: 50, label: "×2 Kaltgas-Halo-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 75, label: "×1,5 Bok-Globule-Output", effects: [{ kind: "generatorOutputMult", factor: 1.5, targetId: "g3" }] },
      { threshold: 100, label: "+20 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.2 }] },
    ],
  },
  {
    id: "g5",
    name: "Riesenmolekülwolke",
    icon: "🌌",
    baseCost: new Decimal("2.2e6"),
    baseProd: new Decimal(22_000),
    clickBonusPerUnit: 0.25,
    outputBonusPerGenerator: 0.01, // +1 % Output je Generator (egal welcher Typ)
    // Jedes Kosmische Filament erhöht diese Rate um +0,05 Prozentpunkte
    outputBonusPerGeneratorBoost: { perGeneratorId: "g8", factorPerUnit: 0.0005 },
    perks: [
      { threshold: 10, label: "×2 Riesenmolekülwolke-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "+10 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.1 }] },
      { threshold: 50, label: "×2 Riesenmolekülwolke-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 75, label: "+15 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.15 }] },
      { threshold: 100, label: "+25 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.25 }] },
    ],
  },
  {
    id: "g6",
    name: "Wasserstoff-Superblase",
    icon: "🫧",
    baseCost: new Decimal("3.3e7"),
    baseProd: new Decimal(310_000),
    clickBonusPerUnit: 0.25,
    perks: [
      { threshold: 10, label: "×2 Superblasen-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "+50 % Klick-Power", effects: [{ kind: "clickMult", factor: 1.5 }] },
      { threshold: 50, label: "×2,5 Superblasen-Output", effects: [{ kind: "selfOutputMult", factor: 2.5 }] },
      { threshold: 75, label: "+50 % Klick-Power", effects: [{ kind: "clickMult", factor: 1.5 }] },
      { threshold: 100, label: "×3 Superblasen-Output", effects: [{ kind: "selfOutputMult", factor: 3 }] },
    ],
  },
  {
    id: "g7",
    name: "Galaktischer Gashalo",
    icon: "🌐",
    baseCost: new Decimal("5.5e8"),
    baseProd: new Decimal("5.5e6"),
    clickBonusPerUnit: 0.25,
    perks: [
      { threshold: 10, label: "×2 Gashalo-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "+15 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.15 }] },
      { threshold: 50, label: "×1,5 Riesenmolekülwolke-Output", effects: [{ kind: "generatorOutputMult", factor: 1.5, targetId: "g5" }] },
      { threshold: 75, label: "×2 Gashalo-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 100, label: "+30 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.3 }] },
    ],
  },
  {
    id: "g8",
    name: "Kosmisches Filament",
    icon: "🕸️",
    baseCost: new Decimal("1.0e10"),
    baseProd: new Decimal("1.0e8"),
    clickBonusPerUnit: 0.25,
    perks: [
      { threshold: 10, label: "×2 Kosmisches-Filament-Output", effects: [{ kind: "selfOutputMult", factor: 2 }] },
      { threshold: 25, label: "+20 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.2 }] },
      { threshold: 50, label: "×3 Kosmisches-Filament-Output", effects: [{ kind: "selfOutputMult", factor: 3 }] },
      { threshold: 75, label: "+30 % globale Produktion", effects: [{ kind: "globalMult", factor: 1.3 }] },
      { threshold: 100, label: "×2 globale Produktion", effects: [{ kind: "globalMult", factor: 2 }] },
    ],
  },
];

export const GENERATOR_IDS: string[] = GENERATORS.map((g) => g.id);

export const GENERATOR_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
);

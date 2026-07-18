import { Decimal } from "./decimal";

/**
 * Die 5 Wasserstoff-Generatoren der Frühphase.
 * Bewusst UNTERSCHIEDLICHE Preis-/Output-Verhältnisse, damit die Progression
 * nicht monoton wirkt. Perks (Meilenstein-Effekte) werden später festgelegt.
 */

export interface GeneratorDef {
  id: string;
  name: string;
  icon: string;
  baseCost: Decimal; // Kosten der 1. Einheit (in H-Atomen)
  baseProd: Decimal; // H/Sek. pro Einheit
}

export const GENERATORS: GeneratorDef[] = [
  { id: "g1", name: "Molekülwolke", icon: "🌫️", baseCost: new Decimal(50), baseProd: new Decimal(1) },
  { id: "g2", name: "Wasserstoff-Filament", icon: "🧵", baseCost: new Decimal(600), baseProd: new Decimal(8) },
  { id: "g3", name: "Bok-Globule", icon: "⚫", baseCost: new Decimal(8_500), baseProd: new Decimal(120) },
  { id: "g4", name: "Kaltgas-Halo", icon: "🌑", baseCost: new Decimal(130_000), baseProd: new Decimal(1_400) },
  { id: "g5", name: "Riesenmolekülwolke", icon: "🌌", baseCost: new Decimal("2.2e6"), baseProd: new Decimal(22_000) },
];

export const GENERATOR_IDS: string[] = GENERATORS.map((g) => g.id);

export const GENERATOR_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
);

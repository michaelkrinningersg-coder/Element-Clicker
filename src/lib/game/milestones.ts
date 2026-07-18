/**
 * Generator-Meilensteine: automatische Boni, sobald die GESAMTZAHL aller
 * besessenen Generatoren (über alle Typen) eine Schwelle erreicht.
 * Wirkt, solange die Schwelle gehalten wird (setzt sich also bei einem
 * Wolke-Kollaps zurück, wie die Generatoren selbst).
 */
export interface GeneratorMilestone {
  id: string;
  threshold: number; // Summe aller besessenen Generatoren
  label: string;
  productionMult: number; // Faktor auf das Auto-Einkommen (H/Sek.)
  clickMult: number; // Faktor auf das Klick-Einkommen
}

export const GENERATOR_MILESTONES: GeneratorMilestone[] = [
  {
    id: "gm10",
    threshold: 10,
    label: "10 Generatoren",
    productionMult: 1.5,
    clickMult: 2,
  },
];

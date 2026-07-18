/**
 * Periodensystem-Daten (Frühphase: bis Beryllium) und Fusions-Rezepte.
 *
 * Wir rechnen immer mit dem STABILSTEN Isotop. Fusion: 2 mol X -> 1 mol (X+1).
 * Die frei werdenden Teilchen ergeben sich aus der Erhaltung:
 *   Rest = (2 * Zusammensetzung X) - Zusammensetzung (X+1)
 *
 * Sonderfall H->He: 2 x ¹H = (2p,0n,2e), ⁴He = (2p,2n,2e) -> es müssten
 * 2 Neutronen entstehen. Physikalisch werden dafür Protonen umgewandelt
 * (Beta-Plus). Spiel-Lösung: H->He setzt 2 Positronen (e⁺) frei, echte
 * Materie-Teilchen (p/e/n) beginnen erst ab He->Li.
 */

export type ElementSymbol = "H" | "He" | "Li" | "Be";
export type FusableSymbol = "He" | "Li" | "Be";

export interface ElementDef {
  symbol: ElementSymbol;
  name: string;
  z: number; // Ordnungszahl (Protonen)
  protons: number;
  neutrons: number;
  electrons: number;
}

export const ELEMENTS: Record<ElementSymbol, ElementDef> = {
  H: { symbol: "H", name: "Wasserstoff", z: 1, protons: 1, neutrons: 0, electrons: 1 },
  He: { symbol: "He", name: "Helium", z: 2, protons: 2, neutrons: 2, electrons: 2 },
  Li: { symbol: "Li", name: "Lithium", z: 3, protons: 3, neutrons: 4, electrons: 3 },
  Be: { symbol: "Be", name: "Beryllium", z: 4, protons: 4, neutrons: 5, electrons: 4 },
};

export interface FusionByproduct {
  protons: number;
  neutrons: number;
  electrons: number;
  positrons: number;
}

export interface FusionRecipe {
  /** Ausgangselement (wird verbraucht). */
  from: "H" | ElementSymbol;
  /** Erzeugtes Element (wird freigeschaltet). */
  to: FusableSymbol;
  /** Frei werdende Teilchen pro Fusion (in mol). */
  byproduct: FusionByproduct;
}

export const FUSION_RECIPES: Record<FusableSymbol, FusionRecipe> = {
  // 2 mol H -> 1 mol He (+ 2 Positronen, Sonderfall)
  He: {
    from: "H",
    to: "He",
    byproduct: { protons: 0, neutrons: 0, electrons: 0, positrons: 2 },
  },
  // 2 mol He -> 1 mol Li (+ 1 Proton, 1 Elektron)
  Li: {
    from: "He",
    to: "Li",
    byproduct: { protons: 1, neutrons: 0, electrons: 1, positrons: 0 },
  },
  // 2 mol Li -> 1 mol Be (+ 2 Protonen, 3 Neutronen, 2 Elektronen)
  Be: {
    from: "Li",
    to: "Be",
    byproduct: { protons: 2, neutrons: 3, electrons: 2, positrons: 0 },
  },
};

/** Reihenfolge der freischaltbaren Fusionen. */
export const FUSION_ORDER: FusableSymbol[] = ["He", "Li", "Be"];

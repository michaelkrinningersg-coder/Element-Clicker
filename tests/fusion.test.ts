import { describe, it, expect } from "vitest";
import { ELEMENTS, FUSION_RECIPES, type FusableSymbol } from "../src/lib/game/elements";

/**
 * Prüft die Teilchen-Bilanz: Rest = 2*X - (X+1), mit dem stabilsten Isotop.
 * (H->He ist der bekannte Sonderfall und wird separat geprüft.)
 */
function expectedByproduct(fromSym: keyof typeof ELEMENTS, toSym: FusableSymbol) {
  const from = ELEMENTS[fromSym];
  const to = ELEMENTS[toSym];
  return {
    protons: 2 * from.protons - to.protons,
    neutrons: 2 * from.neutrons - to.neutrons,
    electrons: 2 * from.electrons - to.electrons,
  };
}

describe("Fusions-Bilanz", () => {
  it("He->Li setzt 1 Proton + 1 Elektron frei", () => {
    const bp = FUSION_RECIPES.Li.byproduct;
    const exp = expectedByproduct("He", "Li");
    expect(bp.protons).toBe(exp.protons);
    expect(bp.neutrons).toBe(exp.neutrons);
    expect(bp.electrons).toBe(exp.electrons);
    expect(bp).toMatchObject({ protons: 1, neutrons: 0, electrons: 1 });
  });

  it("Li->Be setzt 2 Protonen + 3 Neutronen + 2 Elektronen frei", () => {
    const bp = FUSION_RECIPES.Be.byproduct;
    const exp = expectedByproduct("Li", "Be");
    expect(bp.protons).toBe(exp.protons);
    expect(bp.neutrons).toBe(exp.neutrons);
    expect(bp.electrons).toBe(exp.electrons);
    expect(bp).toMatchObject({ protons: 2, neutrons: 3, electrons: 2 });
  });

  it("H->He ist der Sonderfall: 2 Positronen statt Materie-Teilchen", () => {
    const bp = FUSION_RECIPES.He.byproduct;
    expect(bp).toMatchObject({ protons: 0, neutrons: 0, electrons: 0, positrons: 2 });
  });
});

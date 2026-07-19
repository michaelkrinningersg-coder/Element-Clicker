import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import { GENERATOR_BY_ID, GENERATORS } from "../src/lib/game/generators";
import { generatorOutputMultiplier, costForNext } from "../src/lib/game/formulas";
import { Decimal } from "../src/lib/game/decimal";

describe("Neue Generatoren g9–g11", () => {
  it("existieren mit den vereinbarten Kosten (1e13 / 1e17 / 1e22)", () => {
    expect(GENERATORS.length).toBe(11);
    expect(GENERATOR_BY_ID.g9.baseCost.eq(new Decimal("1e13"))).toBe(true);
    expect(GENERATOR_BY_ID.g10.baseCost.eq(new Decimal("1e17"))).toBe(true);
    expect(GENERATOR_BY_ID.g11.baseCost.eq(new Decimal("1e22"))).toBe(true);
  });

  it("Effizienz Prod/Kosten = 0,01", () => {
    for (const id of ["g9", "g10", "g11"]) {
      const def = GENERATOR_BY_ID[id];
      expect(def.baseProd.div(def.baseCost).toNumber()).toBeCloseTo(0.01, 6);
    }
  });

  it("steilere, gestaffelte Kosten-Wachstumsraten (g9<g10<g11)", () => {
    expect(GENERATOR_BY_ID.g9.costGrowth).toBe(1.2);
    expect(GENERATOR_BY_ID.g10.costGrowth).toBe(1.3);
    expect(GENERATOR_BY_ID.g11.costGrowth).toBe(1.5);
    // alle steiler als die Standard-Startrate (~1,15) und g8 (ohne Override)
    expect(GENERATOR_BY_ID.g8.costGrowth).toBeUndefined();
  });
});

describe("Konstante Kosten-Wachstumsrate (Endgame-Generatoren)", () => {
  it("costForNext nutzt die konstante Rate", () => {
    const def = GENERATOR_BY_ID.g11; // costGrowth 1,5
    // 3. Einheit: baseCost · 1,5^2
    const c = costForNext(def.baseCost, 2, def.costGrowth);
    expect(c.div(def.baseCost).toNumber()).toBeCloseTo(1.5 * 1.5, 6);
  });
});

describe("g10 Kosmisches Netz – Perk bei 10: +15 % Molekülwolke je Kosmisches Netz", () => {
  it("nicht aktiv unter 10 Stück", () => {
    const s = createInitialState();
    s.generators.g10.owned = 9;
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(1, 9);
  });

  it("ab 10 Stück: g1-Output × (1 + 0,15 · g10)", () => {
    const s = createInitialState();
    s.generators.g10.owned = 10; // 1 + 0,15·10 = 2,5
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(2.5, 6);
    s.generators.g10.owned = 50; // 1 + 0,15·50 = 8,5
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(8.5, 6);
  });

  it("wirkt nur auf die Molekülwolke", () => {
    const s = createInitialState();
    s.generators.g10.owned = 50;
    expect(generatorOutputMultiplier(s, "g3").toNumber()).toBeCloseTo(1, 9);
  });
});

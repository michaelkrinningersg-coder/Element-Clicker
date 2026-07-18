import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import { clickGeneratorBonusMultiplier, clickValue } from "../src/lib/game/formulas";
import { CLICK_BASE } from "../src/lib/game/constants";

describe("Molekülwolke: +25 % Klick-Einkommen je Einheit (additiv)", () => {
  it("ohne Molekülwolken: Faktor 1", () => {
    const s = createInitialState();
    expect(clickGeneratorBonusMultiplier(s).toNumber()).toBe(1);
  });

  it("1 Molekülwolke: +25 % -> Faktor 1,25", () => {
    const s = createInitialState();
    s.generators.g1.owned = 1;
    expect(clickGeneratorBonusMultiplier(s).toNumber()).toBeCloseTo(1.25, 9);
  });

  it("4 Molekülwolken: +100 % -> Faktor 2 (additiv, nicht multiplikativ)", () => {
    const s = createInitialState();
    s.generators.g1.owned = 4;
    expect(clickGeneratorBonusMultiplier(s).toNumber()).toBeCloseTo(2, 9);
  });

  it("nur der erste Generator wirkt (andere Generatoren zählen nicht)", () => {
    const s = createInitialState();
    s.generators.g2.owned = 100;
    s.generators.g5.owned = 100;
    expect(clickGeneratorBonusMultiplier(s).toNumber()).toBe(1);
  });

  it("fließt in den Klickwert ein (2 Molekülwolken -> ×1,5 auf die Basis)", () => {
    const s = createInitialState();
    // 2 Stück: +50 % Klick-Generatorbonus; noch keine Perks (erst ab 10 Stück)
    s.generators.g1.owned = 2;
    expect(clickValue(s, CLICK_BASE).toNumber()).toBeCloseTo(1.5, 9);
  });
});

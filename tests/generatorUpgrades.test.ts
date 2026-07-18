import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import { generatorOutputMultiplier } from "../src/lib/game/formulas";

describe("Generator-Upgrade: Filament-Resonanz (gu1)", () => {
  it("ohne Kauf: kein Effekt auf Molekülwolke", () => {
    const s = createInitialState();
    s.generators.g2.owned = 10;
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(1, 9);
  });

  it("gekauft: +2 % Molekülwolken-Output je Filament", () => {
    const s = createInitialState();
    s.generatorUpgrades = ["gu1"];
    s.generators.g2.owned = 10; // 10 × 2 % = +20 %
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(1.2, 9);
  });

  it("wirkt nur auf den Ziel-Generator (g1), nicht auf andere", () => {
    const s = createInitialState();
    s.generatorUpgrades = ["gu1"];
    s.generators.g2.owned = 10;
    expect(generatorOutputMultiplier(s, "g3").toNumber()).toBeCloseTo(1, 9);
  });

  it("stapelt mit g1-Output-Perks (25 Stück ×2)", () => {
    const s = createInitialState();
    s.generatorUpgrades = ["gu1"];
    s.generators.g1.owned = 25; // Perk ×2 Output
    s.generators.g2.owned = 5; // +10 %
    // 2 (Perk) × 1,1 (Upgrade) = 2,2
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(2.2, 9);
  });
});

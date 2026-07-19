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

describe("Generator-Upgrade: Filament-Verstärker (gu2)", () => {
  it("erhöht den Filament-Resonanz-Faktor um +1 Pp. je Riesenmolekülwolke", () => {
    const s = createInitialState();
    s.generatorUpgrades = ["gu1", "gu2"];
    s.generators.g2.owned = 10;
    s.generators.g5.owned = 100; // Faktor: 0,02 + 0,01·100 = 1,02
    // g1-Output: 1 + 1,02·10 = 11,2
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(11.2, 6);
  });

  it("ohne gu1 wirkungslos (verstärkt nur den vorhandenen Bonus)", () => {
    const s = createInitialState();
    s.generatorUpgrades = ["gu2"]; // nur Verstärker, kein Basis-Upgrade
    s.generators.g2.owned = 10;
    s.generators.g5.owned = 100;
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(1, 9);
  });
});

describe("Klick-Synergie: Molekülwolken-Output", () => {
  it("jeder Klick +0,01 % (10.000 Klicks -> ×2)", () => {
    const s = createInitialState();
    s.totalClicks = 10000;
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(2, 9);
  });

  it("wirkt nur auf Molekülwolke (g1), nicht auf andere", () => {
    const s = createInitialState();
    s.totalClicks = 10000;
    expect(generatorOutputMultiplier(s, "g3").toNumber()).toBeCloseTo(1, 9);
  });
});

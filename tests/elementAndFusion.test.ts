import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState } from "../src/lib/game/state";
import {
  molekulwolkeElementBonus,
  positronProductionMultiplier,
  generatorOutputMultiplier,
  generatorCostMultiplier,
  runTimeMultiplier,
  totalProductionPerSec,
} from "../src/lib/game/formulas";

describe("Element-Massenzahl-Bonus auf Molekülwolke", () => {
  it("He (Massenzahl 4) gibt +400 % je Atom", () => {
    const s = createInitialState();
    s.elements.He = new Decimal(1); // ×(1 + 4·1) = 5
    expect(molekulwolkeElementBonus(s).toNumber()).toBeCloseTo(5, 9);
  });

  it("He+Li+Be summieren sich (4·He + 7·Li + 9·Be)", () => {
    const s = createInitialState();
    s.elements.He = new Decimal(2);
    s.elements.Li = new Decimal(1);
    s.elements.Be = new Decimal(1);
    // 1 + (4·2 + 7·1 + 9·1) = 1 + 24 = 25
    expect(molekulwolkeElementBonus(s).toNumber()).toBeCloseTo(25, 9);
  });

  it("fließt in den Molekülwolken-Output ein (nur g1)", () => {
    const s = createInitialState();
    s.elements.He = new Decimal(1); // ×5
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(5, 6);
    expect(generatorOutputMultiplier(s, "g3").toNumber()).toBeCloseTo(1, 9);
  });
});

describe("Positron-Produktionsbonus", () => {
  it("+0,5 % je Positron", () => {
    const s = createInitialState();
    s.particles.positrons = new Decimal(100); // +50 % -> ×1,5
    expect(positronProductionMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
  });

  it("wirkt auf die Gesamtproduktion", () => {
    const s = createInitialState();
    s.generators.g1.owned = 1;
    const before = totalProductionPerSec(s).toNumber();
    s.particles.positrons = new Decimal(200); // +100 % -> ×2
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(before * 2, 6);
  });
});

describe("Fusions-Upgrades", () => {
  it("Katalysator: −25 % auf Generator-Kosten (×0,75)", () => {
    const s = createInitialState();
    expect(generatorCostMultiplier(s).toNumber()).toBe(1);
    s.fusionUpgrades = ["fu_katalysator"];
    expect(generatorCostMultiplier(s).toNumber()).toBeCloseTo(0.75, 9);
  });

  it("Lawson: verdoppelt den Run-Zeit-Bonus", () => {
    const s = createInitialState();
    s.runSeconds = 1000; // ohne: +10 %
    const without = runTimeMultiplier(s).toNumber();
    s.fusionUpgrades = ["fu_lawson"]; // mit: +20 %
    const withLawson = runTimeMultiplier(s).toNumber();
    expect(without).toBeCloseTo(1.1, 9);
    expect(withLawson).toBeCloseTo(1.2, 9);
  });
});

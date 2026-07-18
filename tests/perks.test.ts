import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import {
  clickPowerMultiplier,
  generatorOutputMultiplier,
} from "../src/lib/game/formulas";

function stateWithG1(owned: number) {
  const s = createInitialState();
  s.generators.g1.owned = owned;
  return s;
}

describe("Molekülwolke-Perks", () => {
  it("ohne Perks: alle Multiplikatoren = 1", () => {
    const s = stateWithG1(0);
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(1, 9);
  });

  it("10 Stück: +50 % Klick-Power", () => {
    const s = stateWithG1(10);
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(1, 9);
  });

  it("25 Stück: zusätzlich ×2 Eigen-Output", () => {
    const s = stateWithG1(25);
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(2, 9);
  });

  it("50 Stück: Klick-Power ×1,5×1,25 = 1,875", () => {
    const s = stateWithG1(50);
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(1.875, 9);
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(2, 9);
  });

  it("75 Stück: Eigen-Output ×2×2,5 = 5", () => {
    const s = stateWithG1(75);
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(1.875, 9);
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(5, 9);
  });

  it("100 Stück: Output ×10, Klick-Power ×3,75", () => {
    const s = stateWithG1(100);
    // Output: 2 * 2,5 * 2 = 10
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(10, 9);
    // Klick: 1,5 * 1,25 * 2 = 3,75
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(3.75, 9);
  });
});

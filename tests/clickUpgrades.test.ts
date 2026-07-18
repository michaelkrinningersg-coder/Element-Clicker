import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import { clickUpgradeMultiplier, clickValue } from "../src/lib/game/formulas";
import { CLICK_BASE } from "../src/lib/game/constants";
import { CLICK_UPGRADES } from "../src/lib/game/clickUpgrades";

describe("Klick-Upgrades", () => {
  it("ohne Käufe: Multiplikator = 1", () => {
    const s = createInitialState();
    expect(clickUpgradeMultiplier(s).toNumber()).toBe(1);
  });

  it("gekaufte Upgrades multiplizieren sich", () => {
    const s = createInitialState();
    s.clickUpgrades = ["cu1", "cu2"]; // ×2 * ×2
    expect(clickUpgradeMultiplier(s).toNumber()).toBeCloseTo(4, 9);
  });

  it("fließt in den Klickwert ein", () => {
    const s = createInitialState();
    const before = clickValue(s, CLICK_BASE).toNumber();
    s.clickUpgrades = ["cu1"]; // ×2
    const after = clickValue(s, CLICK_BASE).toNumber();
    expect(after).toBeCloseTo(before * 2, 9);
  });

  it("alle Upgrades zusammen ergeben das Produkt aller Faktoren", () => {
    const s = createInitialState();
    s.clickUpgrades = CLICK_UPGRADES.map((u) => u.id);
    const expected = CLICK_UPGRADES.reduce((acc, u) => acc * u.clickMult, 1);
    expect(clickUpgradeMultiplier(s).toNumber()).toBeCloseTo(expected, 6);
  });
});

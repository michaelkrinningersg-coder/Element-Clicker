import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState } from "../src/lib/game/state";
import {
  bulkCost,
  maxAffordable,
  runTimeMultiplier,
  clickValue,
  totalProductionPerSec,
} from "../src/lib/game/formulas";
import { CLICK_BASE } from "../src/lib/game/constants";

describe("Bulk-Kauf-Berechnungen", () => {
  it("bulkCost summiert steigende Einzelkosten (Molekülwolke, 3 Stück ab 0)", () => {
    const base = new Decimal(50);
    // Einzelkosten: 50, 50*1,15, 50*1,15^2
    const c0 = 50;
    const c1 = 50 * 1.15;
    const c2 = 50 * 1.15 * 1.14993; // ~ r(1)
    const total = bulkCost(base, 0, 3).toNumber();
    expect(total).toBeGreaterThan(c0 + c1);
    expect(total).toBeCloseTo(c0 + c1 + c2, 0);
  });

  it("maxAffordable liefert die Anzahl leistbarer Einheiten", () => {
    const base = new Decimal(50);
    // Mit 50 H: genau 1 leistbar
    expect(maxAffordable(base, 0, new Decimal(50))).toBe(1);
    // Mit 49 H: keine
    expect(maxAffordable(base, 0, new Decimal(49))).toBe(0);
    // Mit viel H, aber Limit greift
    expect(maxAffordable(base, 0, new Decimal("1e12"), 5)).toBe(5);
  });
});

describe("Run-Zeit-Bonus", () => {
  it("0 s -> Faktor 1", () => {
    const s = createInitialState();
    expect(runTimeMultiplier(s).toNumber()).toBe(1);
  });

  it("+0,01 % je Sekunde (100 s -> +1 %)", () => {
    const s = createInitialState();
    s.runSeconds = 100;
    expect(runTimeMultiplier(s).toNumber()).toBeCloseTo(1.01, 9);
  });

  it("wirkt auf Klick und Auto-Einkommen", () => {
    const s = createInitialState();
    s.generators.g1.owned = 1;
    const clickBefore = clickValue(s, CLICK_BASE).toNumber();
    const prodBefore = totalProductionPerSec(s).toNumber();
    s.runSeconds = 10000; // +100 % -> x2
    expect(clickValue(s, CLICK_BASE).toNumber()).toBeCloseTo(clickBefore * 2, 6);
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(prodBefore * 2, 6);
  });
});

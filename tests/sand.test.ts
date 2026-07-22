import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState } from "../src/lib/game/state";
import {
  clickValue,
  totalProductionPerSec,
  glasMultiplier,
  glasGain,
  canPrestige,
  growthRate,
  bulkCost,
  maxAffordable,
} from "../src/lib/game/formulas";

describe("Klick (Hand)", () => {
  it("Basis 1 Sand pro Klick", () => {
    const s = createInitialState();
    expect(clickValue(s).toNumber()).toBe(1);
  });

  it("jede Hand gibt +1 Sand pro Klick", () => {
    const s = createInitialState();
    s.buildings.hand.owned = 5; // 1 + 5 = 6
    expect(clickValue(s).toNumber()).toBe(6);
  });
});

describe("Produktion (Eimer)", () => {
  it("Basis 0", () => {
    const s = createInitialState();
    expect(totalProductionPerSec(s).toNumber()).toBe(0);
  });

  it("jeder Eimer gibt +0,2 Sand/s", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // 10 · 0,2 = 2
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(2, 9);
  });
});

describe("Glas-Prestige", () => {
  it("Glas gibt +10 % je Einheit auf Produktion & Klick", () => {
    const s = createInitialState();
    s.glas = new Decimal(5); // ×1,5
    expect(glasMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
    s.buildings.hand.owned = 1; // Klick (1+1)·1,5 = 3
    expect(clickValue(s).toNumber()).toBeCloseTo(3, 9);
  });

  it("erst ab 1e9 Sand möglich", () => {
    const s = createInitialState();
    s.sand = new Decimal("9.9e8");
    expect(canPrestige(s)).toBe(false);
    s.sand = new Decimal("1e9");
    expect(canPrestige(s)).toBe(true);
  });

  it("Ertrag = floor(sqrt(Sand / 1e9)), min. 1", () => {
    const s = createInitialState();
    s.sand = new Decimal("1e9");
    expect(glasGain(s).toNumber()).toBe(1);
    s.sand = new Decimal("1e11"); // sqrt(100) = 10
    expect(glasGain(s).toNumber()).toBe(10);
  });
});

describe("Kaufkurve", () => {
  it("Startrate ~1,15, leistbare Anzahl korrekt", () => {
    expect(growthRate(0)).toBeCloseTo(1.15, 5);
    const base = new Decimal(10);
    expect(maxAffordable(base, 0, new Decimal(10))).toBe(1);
    expect(maxAffordable(base, 0, new Decimal(9))).toBe(0);
  });

  it("bulkCost summiert steigende Kosten", () => {
    const base = new Decimal(10);
    const total = bulkCost(base, 0, 2).toNumber(); // 10 + 10·1,15
    expect(total).toBeCloseTo(10 + 11.5, 4);
  });
});

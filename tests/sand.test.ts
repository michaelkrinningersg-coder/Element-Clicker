import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState } from "../src/lib/game/state";
import { BUILDINGS, BUILDING_BY_ID } from "../src/lib/game/buildings";
import { formatWeight } from "../src/lib/game/format";
import { ACHIEVEMENTS, isUnlocked, unlockedCount } from "../src/lib/game/achievements";
import {
  clickValue,
  totalProductionPerSec,
  glasMultiplier,
  glasGain,
  canPrestige,
  growthRate,
  costForNext,
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

describe("Gewicht (100 Körner = 1 mg)", () => {
  it("100 Körner = 1 mg", () => {
    expect(formatWeight(new Decimal(100))).toBe("1,00 mg");
  });

  it("skaliert zu g / kg / t", () => {
    // 100.000 Körner = 1000 mg = 1 g
    expect(formatWeight(new Decimal(1e5))).toBe("1,00 g");
    // 1e8 Körner = 1e6 mg = 1 kg
    expect(formatWeight(new Decimal(1e8))).toBe("1,00 kg");
    // 1e11 Körner = 1e9 mg = 1 t
    expect(formatWeight(new Decimal(1e11))).toBe("1,00 t");
  });

  it("0 Körner wiegen 0 mg", () => {
    expect(formatWeight(new Decimal(0))).toBe("0 mg");
  });
});

describe("Bauwerke aus Sand (Erfolge)", () => {
  it("drei Bauwerke mit den vereinbarten Schwellen", () => {
    expect(ACHIEVEMENTS.length).toBe(3);
    expect(ACHIEVEMENTS[0].threshold.toNumber()).toBe(5e6);
    expect(ACHIEVEMENTS[1].threshold.toNumber()).toBe(30e6);
    expect(ACHIEVEMENTS[2].threshold.toNumber()).toBe(6e9);
  });

  it("schalten sich an totalSandEver frei", () => {
    const s = createInitialState();
    expect(unlockedCount(s)).toBe(0);
    s.totalSandEver = new Decimal("5e6");
    expect(isUnlocked(s, ACHIEVEMENTS[0])).toBe(true);
    expect(unlockedCount(s)).toBe(1);
    s.totalSandEver = new Decimal("6e9");
    expect(unlockedCount(s)).toBe(3);
  });
});

describe("Gebäude & Ramping je Gebäude", () => {
  it("7 Gebäude mit den vereinbarten Startkosten", () => {
    expect(BUILDINGS.length).toBe(7);
    expect(BUILDING_BY_ID.schaufel.baseCost.toNumber()).toBe(150);
    expect(BUILDING_BY_ID.sieb.baseCost.toNumber()).toBe(3000);
    expect(BUILDING_BY_ID.arbeiter.baseCost.toNumber()).toBe(36000);
    expect(BUILDING_BY_ID.lasttiere.baseCost.toNumber()).toBe(900000);
    expect(BUILDING_BY_ID.handkarren.baseCost.toNumber()).toBe(16000000);
  });

  it("Produktionssprünge liegen bei ~75 % (nur ~×7 bis ×21 statt ×9–×28)", () => {
    const p = (id: string) => BUILDING_BY_ID[id].prodPerUnit!.toNumber();
    expect(p("schaufel") / p("eimer")).toBeCloseTo(11, 0);
    expect(p("lasttiere") / p("arbeiter")).toBeCloseTo(21, 0);
  });

  it("eigenes Ramping je Gebäude (konstante Rate)", () => {
    expect(BUILDING_BY_ID.eimer.costGrowth).toBe(1.12);
    expect(BUILDING_BY_ID.handkarren.costGrowth).toBe(1.17);
    // costForNext nutzt die konstante Rate
    const def = BUILDING_BY_ID.handkarren;
    const c = costForNext(def.baseCost, 2, def.costGrowth);
    expect(c.div(def.baseCost).toNumber()).toBeCloseTo(1.17 * 1.17, 6);
  });
});

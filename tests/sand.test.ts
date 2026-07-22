import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState } from "../src/lib/game/state";
import { BUILDINGS, BUILDING_BY_ID } from "../src/lib/game/buildings";
import {
  formatWeight,
  earthMassPercent,
  formatFixedPercent,
  formatDepth,
} from "../src/lib/game/format";
import { EARTH_DIAMETER_M } from "../src/lib/game/constants";
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
  achievementProductionMult,
  costMultiplier,
  digDepthMeters,
  tonnesPerMeterAt,
  isMaxDepth,
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

describe("Fortschritt zur Erdmasse", () => {
  it("volle Erdmasse (5,972e32 Körner) = 100 %", () => {
    expect(earthMassPercent(new Decimal("5.972e32")).toNumber()).toBeCloseTo(100, 6);
  });

  it("die Hälfte der Erdmasse = 50 %", () => {
    expect(earthMassPercent(new Decimal("2.986e32")).toNumber()).toBeCloseTo(50, 6);
  });

  it("0 Körner = 0 %", () => {
    expect(earthMassPercent(new Decimal(0)).toNumber()).toBe(0);
  });

  it("15 Nachkommastellen mit Komma", () => {
    const s = formatFixedPercent(earthMassPercent(new Decimal("5.972e32")), 15);
    expect(s).toBe("100,000000000000000");
    // Kommastellen zählen
    expect(s.split(",")[1].length).toBe(15);
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

describe("Graben (Tiefe aus Sandgewicht)", () => {
  it("10 t je Meter bis 100 m (1 t = 1e11 Körner)", () => {
    // 50 m → 500 t → 5e13 Körner
    expect(digDepthMeters(new Decimal("5e13"))).toBeCloseTo(50, 6);
    expect(tonnesPerMeterAt(0)).toBe(10);
    expect(tonnesPerMeterAt(50)).toBe(10);
  });

  it("gestaffelte Tonnage: 15 ab 100 m, 20 ab 1000 m, 30 ab 5000 m", () => {
    expect(tonnesPerMeterAt(100)).toBe(15);
    expect(tonnesPerMeterAt(1000)).toBe(20);
    expect(tonnesPerMeterAt(5000)).toBe(30);
    // 500 m: 100 m·10 t + 400 m·15 t = 7000 t → 7e14 Körner
    expect(digDepthMeters(new Decimal("7e14"))).toBeCloseTo(500, 6);
  });

  it("nicht tiefer als der Erddurchmesser", () => {
    const huge = new Decimal("1e40");
    expect(digDepthMeters(huge)).toBe(EARTH_DIAMETER_M);
    expect(isMaxDepth(digDepthMeters(huge))).toBe(true);
    expect(isMaxDepth(1000)).toBe(false);
  });

  it("Anzeige: cm bis 100 m, dm bis 600 m, sonst ganze Meter", () => {
    expect(formatDepth(42.37)).toBe("42 m 37 cm");
    expect(formatDepth(250.4)).toBe("250 m 4 dm");
    expect(formatDepth(1234.5)).toBe("1.234 m");
  });
});

describe("Bauwerk-Boni (+2 % Produktion, −1 % Kosten je Bauwerk)", () => {
  it("Produktion: (1,02)^Anzahl, multiplikativ auf Sand/s", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // Basis 10 · 0,2 = 2 /s
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(2, 9);
    expect(achievementProductionMult(s).toNumber()).toBeCloseTo(1, 9);
    s.totalSandEver = new Decimal("30e6"); // 2 Bauwerke frei
    expect(achievementProductionMult(s).toNumber()).toBeCloseTo(1.02 ** 2, 9);
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(2 * 1.02 ** 2, 9);
  });

  it("Kosten: (0,99)^Anzahl → bei 3 Bauwerken weniger als −3 %", () => {
    const s = createInitialState();
    expect(costMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    s.totalSandEver = new Decimal("6e9"); // alle 3 Bauwerke
    const mult = costMultiplier(s).toNumber();
    expect(mult).toBeCloseTo(0.99 ** 3, 9); // 0,970299
    // Rabatt (2,97 %) ist geringer als lineare 3 %
    expect(1 - mult).toBeLessThan(0.03);
    expect(1 - mult).toBeCloseTo(0.029701, 6);
  });

  it("costForNext wendet den Kosten-Multiplikator an", () => {
    const s = createInitialState();
    s.totalSandEver = new Decimal("6e9");
    const mult = costMultiplier(s);
    const c = costForNext(new Decimal(1000), 0, undefined, mult);
    expect(c.toNumber()).toBeCloseTo(1000 * 0.99 ** 3, 6);
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

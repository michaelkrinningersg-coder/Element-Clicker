import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState, prestigeReset } from "../src/lib/game/state";
import { BUILDINGS, BUILDING_BY_ID } from "../src/lib/game/buildings";
import {
  formatWeight,
  earthMassPercent,
  formatFixedPercent,
  formatDepth,
  formatEta,
} from "../src/lib/game/format";
import { EARTH_DIAMETER_M, DIG_CENTER_M, DIG_MILESTONES } from "../src/lib/game/constants";
import { ACHIEVEMENTS, isUnlocked, unlockedCount } from "../src/lib/game/achievements";
import {
  clickValue,
  totalProductionPerSec,
  glasMultiplier,
  glasGain,
  sandForGlas,
  sandForNextGlas,
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
  digMilestonesReached,
  digIncomeMultiplier,
  grainsForDepth,
  generatorCount,
  generatorBoostMultiplier,
  arbeiterBoostMultiplier,
  runTimeBoostMultiplier,
  buildingProduction,
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

  it("jeder Eimer gibt +0,2 Sand/s (× Generator-Boost)", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // 10 · 0,2 = 2, × (1 + 0,001·10) = 1,01
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(2 * 1.01, 9);
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
  it("zwölf Bauwerke mit den vereinbarten Schwellen", () => {
    expect(ACHIEVEMENTS.length).toBe(12);
    const byId = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a.threshold]));
    const eq = (id: string, v: string) => expect(byId[id].eq(new Decimal(v))).toBe(true);
    eq("sanduhr", "1e6");
    eq("schaufel-voll", "5e6");
    eq("eimer-voll", "30e6");
    eq("sandkuchen", "48e6");
    eq("sandburg", "6e9");
    eq("koelner-dom", "65e9");
    eq("sandkasten", "110e9");
    eq("sphinx", "400e9");
    eq("lkw", "2.4e12");
    eq("cheops", "600e12");
    eq("duene", "15e15");
    eq("strand", "200e15");
  });

  it("Schwellen sind aufsteigend sortiert", () => {
    for (let i = 1; i < ACHIEVEMENTS.length; i++) {
      expect(ACHIEVEMENTS[i].threshold.gt(ACHIEVEMENTS[i - 1].threshold)).toBe(true);
    }
  });

  it("schalten sich am Run-Sand frei", () => {
    const s = createInitialState();
    expect(unlockedCount(s)).toBe(0);
    s.runSandEver = new Decimal("5e6"); // Sanduhr + Schaufel
    expect(isUnlocked(s, ACHIEVEMENTS[0])).toBe(true);
    expect(unlockedCount(s)).toBe(2);
    s.runSandEver = new Decimal("6e9"); // + Eimer, Sandkuchen, Sandburg
    expect(unlockedCount(s)).toBe(5);
    s.runSandEver = new Decimal("200e15"); // alle
    expect(unlockedCount(s)).toBe(12);
  });

  it("Prestige setzt Bauwerke & Graben zurück (runSandEver = 0), Lifetime bleibt", () => {
    const s = createInitialState();
    s.runSandEver = new Decimal("200e15");
    s.totalSandEver = new Decimal("500e15");
    expect(unlockedCount(s)).toBe(12);
    prestigeReset(s);
    expect(s.runSandEver.eq(0)).toBe(true);
    expect(unlockedCount(s)).toBe(0); // alle wieder gesperrt
    expect(s.totalSandEver.eq(new Decimal("500e15"))).toBe(true); // Lifetime bleibt
    expect(digDepthMeters(s.runSandEver)).toBe(0); // Graben zurück
  });
});

describe("Glas-Kurve & nächstes Glas", () => {
  it("sandForGlas(k) = k² · 1e9", () => {
    expect(sandForGlas(1).eq(new Decimal("1e9"))).toBe(true);
    expect(sandForGlas(2).eq(new Decimal("4e9"))).toBe(true);
    expect(sandForGlas(10).eq(new Decimal("100e9"))).toBe(true);
  });

  it("Rundlauf: bei sandForGlas(k) Sand ist der Ertrag genau k", () => {
    const s = createInitialState();
    s.sand = sandForGlas(7);
    expect(glasGain(s).toNumber()).toBe(7);
  });

  it("nächstes Glas = (aktueller Ertrag + 1)² · 1e9", () => {
    const s = createInitialState();
    s.sand = new Decimal("5e9"); // sqrt(5) ≈ 2,23 → Ertrag 2
    expect(glasGain(s).toNumber()).toBe(2);
    expect(sandForNextGlas(s).eq(sandForGlas(3))).toBe(true); // 9e9
  });
});

describe("Graben (exponentiell schwerer mit der Tiefe)", () => {
  it("Start unverändert: 10 t je Meter an der Oberfläche", () => {
    expect(tonnesPerMeterAt(0)).toBeCloseTo(10, 6);
  });

  it("im Erdmittelpunkt 1e15× so schwer wie am Start", () => {
    const ratio = tonnesPerMeterAt(DIG_CENTER_M) / tonnesPerMeterAt(0);
    expect(ratio).toBeGreaterThan(1e15 * 0.999);
    expect(ratio).toBeLessThan(1e15 * 1.001);
  });

  it("nahe der Oberfläche noch ~linear mit 10 t/m", () => {
    // 500 t → ~50 m (1 t = 1e11 Körner)
    expect(digDepthMeters(new Decimal("5e13"))).toBeCloseTo(50, 1);
  });

  it("Tiefe wächst monoton mit Gewicht", () => {
    const a = digDepthMeters(new Decimal("1e18"));
    const b = digDepthMeters(new Decimal("1e22"));
    expect(b).toBeGreaterThan(a);
  });

  it("nicht tiefer als der Erddurchmesser", () => {
    const huge = new Decimal("1e60");
    expect(digDepthMeters(huge)).toBe(EARTH_DIAMETER_M);
    expect(isMaxDepth(digDepthMeters(huge))).toBe(true);
    expect(isMaxDepth(1000)).toBe(false);
  });

  it("Anzeige: mm bis 10 m, cm bis 100 m, dm bis 600 m, sonst Meter", () => {
    expect(formatDepth(3.456)).toBe("3 m 456 mm");
    expect(formatDepth(42.37)).toBe("42 m 37 cm");
    expect(formatDepth(250.4)).toBe("250 m 4 dm");
    expect(formatDepth(1234.5)).toBe("1.234 m");
  });
});

describe("Graben-Meilensteine (+1 % je erreichter Tiefe)", () => {
  it("zählt erreichte Meilensteine nach Tiefe", () => {
    expect(digMilestonesReached(0)).toBe(0);
    expect(digMilestonesReached(1.8)).toBe(1); // Mensch
    expect(digMilestonesReached(25)).toBe(3); // Mensch, Sphinx, Sandburg
    expect(digMilestonesReached(EARTH_DIAMETER_M)).toBe(DIG_MILESTONES.length);
  });

  it("+1 % auf Klick und Produktion je Meilenstein", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // 2 /s Basis
    // 2,5e13 Körner → ~25 m → 3 Meilensteine → +3 %
    s.runSandEver = new Decimal("2.5e13");
    const depth = digDepthMeters(s.runSandEver);
    const n = digMilestonesReached(depth);
    expect(n).toBe(3);
    expect(digIncomeMultiplier(s).toNumber()).toBeCloseTo(1 + 0.01 * n, 9);
    // Klick: Basis 1 · Glas 1 · Graben (1+0,03) = 1,03
    expect(clickValue(s).toNumber()).toBeCloseTo(1.03, 9);
    // Produktion enthält den Graben-Faktor ebenfalls
    const withoutDig = new Decimal(2)
      .mul(glasMultiplier(s))
      .mul(achievementProductionMult(s));
    expect(totalProductionPerSec(s).gt(withoutDig)).toBe(true);
  });
});

describe("Generator-Synergie (+0,1 % Produktion je Generator)", () => {
  it("zählt nur Generatoren (nicht die Hand)", () => {
    const s = createInitialState();
    s.buildings.hand.owned = 50; // Klick-Gebäude, kein Generator
    s.buildings.eimer.owned = 30;
    s.buildings.schaufel.owned = 20;
    expect(generatorCount(s)).toBe(50); // 30 + 20
  });

  it("Multiplikator = 1 + 0,001 · Generatoranzahl", () => {
    const s = createInitialState();
    expect(generatorBoostMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    s.buildings.eimer.owned = 100; // +10 %
    expect(generatorBoostMultiplier(s).toNumber()).toBeCloseTo(1.1, 9);
  });

  it("wirkt multiplikativ auf die Produktion", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 100; // 100 · 0,2 = 20 /s, × 1,1 = 22
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(20 * 1.1, 6);
  });
});

describe("Arbeiter-Boost (+1 % auf alle Generatoren je Arbeiter)", () => {
  it("Multiplikator = 1 + 0,01 · Arbeiter", () => {
    const s = createInitialState();
    expect(arbeiterBoostMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    s.buildings.arbeiter.owned = 5; // +5 %
    expect(arbeiterBoostMultiplier(s).toNumber()).toBeCloseTo(1.05, 9);
  });

  it("boostet die Produktion aller Generatoren", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // 2 /s Basis
    s.buildings.arbeiter.owned = 5; // +5 % auf alle Generatoren
    // Eimer-Anteil = 2 · Generator-Boost · Arbeiter-Boost
    const expected = new Decimal(2)
      .mul(generatorBoostMultiplier(s))
      .mul(arbeiterBoostMultiplier(s));
    expect(buildingProduction(s, "eimer").toNumber()).toBeCloseTo(expected.toNumber(), 6);
  });
});

describe("Zeit-Bonus (+0,01 % Produktion je Sekunde im aktuellen Prestige)", () => {
  it("Multiplikator = 1 + 0,0001 · Run-Sekunden", () => {
    const s = createInitialState();
    expect(runTimeBoostMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    s.runPlaytimeSeconds = 3600; // 1 h → +36 %
    expect(runTimeBoostMultiplier(s).toNumber()).toBeCloseTo(1.36, 9);
  });

  it("wirkt multiplikativ auf die Produktion", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // 2 /s Basis
    const before = totalProductionPerSec(s).toNumber();
    s.runPlaytimeSeconds = 10000; // ×(1 + 0,0001·10000) = ×2
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(before * 2, 6);
  });

  it("nur Run-Zeit zählt (Lifetime-Spielzeit ohne Wirkung), Reset bei Prestige", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10;
    s.playtimeSeconds = 99999; // Lifetime hat KEINE Wirkung mehr
    const base = new Decimal(2).mul(generatorBoostMultiplier(s));
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(base.toNumber(), 6);
    s.runPlaytimeSeconds = 10000; // nur Run zählt → ×2
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(base.toNumber() * 2, 6);
    prestigeReset(s);
    expect(s.runPlaytimeSeconds).toBe(0);
    expect(runTimeBoostMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    expect(s.playtimeSeconds).toBe(99999); // Lifetime-Statistik bleibt
  });
});

describe("Zeit-Schätzung (ETA) bei aktueller Produktion", () => {
  it("Sekunden / Minuten / Stunden / Tage", () => {
    // 100 Körner Rest, 10/s → 10 s
    expect(formatEta(new Decimal(100), new Decimal(0), new Decimal(10))).toBe("10 s");
    // 600 Rest, 1/s → 10 min
    expect(formatEta(new Decimal(600), new Decimal(0), new Decimal(1))).toBe("10 min");
    // 7200 Rest, 1/s → 2 h
    expect(formatEta(new Decimal(7200), new Decimal(0), new Decimal(1))).toBe("2 h");
  });

  it("erreicht, wenn Ziel schon überschritten", () => {
    expect(formatEta(new Decimal(100), new Decimal(200), new Decimal(5))).toBe("erreicht");
  });

  it("— ohne Produktion", () => {
    expect(formatEta(new Decimal(100), new Decimal(0), new Decimal(0))).toBe("—");
  });

  it("grainsForDepth passt zur Tiefe (Rundlauf)", () => {
    const grains = grainsForDepth(500);
    expect(digDepthMeters(grains)).toBeCloseTo(500, 3);
  });
});

describe("Bauwerk-Boni (+2 % Produktion, −1 % Kosten je Bauwerk)", () => {
  it("Produktion: (1,02)^Anzahl, multiplikativ auf Sand/s", () => {
    const s = createInitialState();
    s.buildings.eimer.owned = 10; // Basis 10 · 0,2 = 2 /s
    const base = new Decimal(2).mul(generatorBoostMultiplier(s)); // inkl. Generator-Boost
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(base.toNumber(), 9);
    expect(achievementProductionMult(s).toNumber()).toBeCloseTo(1, 9);
    s.runSandEver = new Decimal("30e6"); // einige Bauwerke frei
    const n = unlockedCount(s);
    expect(n).toBeGreaterThan(0);
    expect(achievementProductionMult(s).toNumber()).toBeCloseTo(1.02 ** n, 9);
    expect(totalProductionPerSec(s).toNumber()).toBeCloseTo(base.toNumber() * 1.02 ** n, 9);
  });

  it("Kosten: (0,99)^Anzahl, multiplikativ (weniger Rabatt als linear)", () => {
    const s = createInitialState();
    expect(costMultiplier(s).toNumber()).toBeCloseTo(1, 9);
    s.runSandEver = new Decimal("6e9");
    const n = unlockedCount(s);
    const mult = costMultiplier(s).toNumber();
    expect(mult).toBeCloseTo(0.99 ** n, 9);
    // multiplikativ → Gesamtrabatt kleiner als lineare n · 1 %
    expect(1 - mult).toBeLessThan(n * 0.01);
  });

  it("costForNext wendet den Kosten-Multiplikator an", () => {
    const s = createInitialState();
    s.runSandEver = new Decimal("6e9");
    const mult = costMultiplier(s);
    const c = costForNext(new Decimal(1000), 0, undefined, mult);
    expect(c.toNumber()).toBeCloseTo(1000 * mult.toNumber(), 6);
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

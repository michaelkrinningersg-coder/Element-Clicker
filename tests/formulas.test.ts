import { describe, it, expect } from "vitest";
import { Decimal, ZERO } from "../src/lib/game/decimal";
import {
  growthRate,
  costForNext,
  potentialAE,
  aeThreshold,
  reachedMilestones,
} from "../src/lib/game/formulas";
import { PERK_MILESTONES } from "../src/lib/game/constants";

describe("Kostenkurve", () => {
  it("startet bei ~1,15 und flacht zum Boden 1,05 ab", () => {
    expect(growthRate(0)).toBeCloseTo(1.15, 5);
    expect(growthRate(100)).toBeCloseTo(1.1, 5);
    expect(growthRate(10_000)).toBeCloseTo(1.05, 3);
  });

  it("Wachstumsrate ist monoton fallend", () => {
    let prev = growthRate(0);
    for (let n = 1; n <= 500; n += 25) {
      const r = growthRate(n);
      expect(r).toBeLessThanOrEqual(prev + 1e-9);
      prev = r;
    }
  });

  it("Kosten steigen streng monoton mit der Anzahl", () => {
    const base = new Decimal(50);
    let prev = costForNext(base, 0);
    for (let n = 1; n <= 50; n++) {
      const c = costForNext(base, n);
      expect(c.gt(prev)).toBe(true);
      prev = c;
    }
  });
});

describe("Aktivierungsenergie", () => {
  it("unter 1e6 H gibt es 0 AE", () => {
    expect(potentialAE(new Decimal(999_999), ZERO).toNumber()).toBe(0);
  });

  it("Schwellen folgen 1e6 * 2,1^(n-1)", () => {
    expect(aeThreshold(1, ZERO).toNumber()).toBeCloseTo(1e6, 0);
    expect(aeThreshold(2, ZERO).toNumber()).toBeCloseTo(2.1e6, 0);
    expect(aeThreshold(3, ZERO).toNumber()).toBeCloseTo(4.41e6, 0);
  });

  it("liefert die erwartete AE-Anzahl", () => {
    expect(potentialAE(new Decimal(1e6), ZERO).toNumber()).toBe(1);
    expect(potentialAE(new Decimal(2.1e6), ZERO).toNumber()).toBe(2);
    expect(potentialAE(new Decimal(4.41e6), ZERO).toNumber()).toBe(3);
  });

  it("Gravitonen senken die Schwellen (mehr AE bei gleichem H)", () => {
    const h = new Decimal(1e7);
    const withoutG = potentialAE(h, ZERO).toNumber();
    const withG = potentialAE(h, new Decimal(50)).toNumber();
    expect(withG).toBeGreaterThan(withoutG);
  });
});

describe("Meilensteine", () => {
  it("zählt erreichte Perk-Schwellen", () => {
    expect(reachedMilestones(0)).toBe(0);
    expect(reachedMilestones(10)).toBe(1);
    expect(reachedMilestones(PERK_MILESTONES[PERK_MILESTONES.length - 1])).toBe(
      PERK_MILESTONES.length,
    );
  });
});

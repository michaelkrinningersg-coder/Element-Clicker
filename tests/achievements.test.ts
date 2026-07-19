import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import {
  evaluateAchievements,
  ACHIEVEMENTS,
  TOTAL_ACHIEVEMENTS,
} from "../src/lib/game/achievements";
import {
  achievementMultiplier,
  clickGeneratorBonusMultiplier,
} from "../src/lib/game/formulas";

describe("Achievements", () => {
  it("frische Basis hat keine Achievements", () => {
    const s = createInitialState();
    evaluateAchievements(s);
    expect(s.achievements.length).toBe(0);
    expect(achievementMultiplier(s).toNumber()).toBe(1);
  });

  it("Generator-Anzahl schaltet Stufen frei (1/5/10 bei 10 Stück)", () => {
    const s = createInitialState();
    s.generators.g1.owned = 10;
    evaluateAchievements(s);
    expect(s.achievements).toContain("gen_g1_1");
    expect(s.achievements).toContain("gen_g1_5");
    expect(s.achievements).toContain("gen_g1_10");
    expect(s.achievements).not.toContain("gen_g1_25");
  });

  it("Klick-Achievements greifen ab der jeweiligen Schwelle", () => {
    const s = createInitialState();
    s.totalClicks = 100;
    evaluateAchievements(s);
    expect(s.achievements).toContain("clicks_1");
    expect(s.achievements).toContain("clicks_100");
    expect(s.achievements).not.toContain("clicks_500");
  });

  it("Multiplikator = 1,0 + 0,1 je Achievement", () => {
    const s = createInitialState();
    s.totalClicks = 100; // clicks_1,10,50,100 = 4 Achievements
    evaluateAchievements(s);
    expect(s.achievements.length).toBe(4);
    expect(achievementMultiplier(s).toNumber()).toBeCloseTo(1.4, 9);
  });

  it("ist idempotent (kein Doppelzählen)", () => {
    const s = createInitialState();
    s.generators.g1.owned = 5;
    evaluateAchievements(s);
    const n = s.achievements.length;
    evaluateAchievements(s);
    expect(s.achievements.length).toBe(n);
  });

  it("Gesamtzahl = 11 Generatoren × 7 + 8 Klick + 7 Zeit", () => {
    expect(TOTAL_ACHIEVEMENTS).toBe(ACHIEVEMENTS.length);
    expect(TOTAL_ACHIEVEMENTS).toBe(11 * 7 + 8 + 7);
  });

  it("Spielzeit-Achievements greifen ab der Schwelle", () => {
    const s = createInitialState();
    s.playtimeSeconds = 3600; // 1 Stunde
    evaluateAchievements(s);
    expect(s.achievements).toContain("time_3600");
    expect(s.achievements).not.toContain("time_36000");
  });
});

describe("Klick-Bonus je Generator (alle Typen +25 %/Einheit)", () => {
  it("jeder Generator zählt jetzt (nicht nur der erste)", () => {
    const s = createInitialState();
    s.generators.g5.owned = 2; // 2 × +25 % = +50 %
    expect(clickGeneratorBonusMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
  });

  it("verschiedene Generatoren summieren sich additiv", () => {
    const s = createInitialState();
    s.generators.g1.owned = 2;
    s.generators.g3.owned = 2; // gesamt 4 × +25 % = +100 %
    expect(clickGeneratorBonusMultiplier(s).toNumber()).toBeCloseTo(2, 9);
  });
});

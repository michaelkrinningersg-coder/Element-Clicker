import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { createInitialState } from "../src/lib/game/state";
import {
  generatorOutputMultiplier,
  aeGainMultiplier,
  perkGlobalMultiplier,
  clickPowerMultiplier,
} from "../src/lib/game/formulas";
import { buyMaxAll, getState } from "../src/lib/game/store";

describe("Molekülwolke – Prestige-Kopplung", () => {
  it("Output × (1 + 0,25 · AE)", () => {
    const s = createInitialState();
    s.ae = new Decimal(100); // 1 + 0,25·100 = 26
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(26, 6);
  });

  it("greift nur bei der Molekülwolke", () => {
    const s = createInitialState();
    s.ae = new Decimal(100);
    expect(generatorOutputMultiplier(s, "g3").toNumber()).toBeCloseTo(1, 9);
  });
});

describe("Molekülwolke – neue Perks 150–500", () => {
  it("150: +50 % auf alles (Produktion & Klick)", () => {
    const s = createInitialState();
    s.generators.g1.owned = 150;
    expect(perkGlobalMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
    // Klick: 10(+50%)*50(+25%)*100(x2)*150(+50%) = 1,5*1,25*2*1,5 = 5,625
    expect(clickPowerMultiplier(s).toNumber()).toBeCloseTo(5.625, 6);
  });

  it("250 & 400: AE-Ertrag ×1,25 bzw. ×1,25·1,25", () => {
    const s = createInitialState();
    s.generators.g1.owned = 250;
    expect(aeGainMultiplier(s).toNumber()).toBeCloseTo(1.25, 9);
    s.generators.g1.owned = 400;
    expect(aeGainMultiplier(s).toNumber()).toBeCloseTo(1.25 * 1.25, 9);
  });

  it("500: Molekülwolken-Output enthält ×4 (200) und ×5 (500)", () => {
    const s = createInitialState();
    s.generators.g1.owned = 500; // ohne AE, ohne Klicks
    // Selbst-Output-Perks: 25(x2)*75(x2,5)*100(x2)*200(x4)*500(x5) = 2*2,5*2*4*5 = 200
    expect(generatorOutputMultiplier(s, "g1").toNumber()).toBeCloseTo(200, 4);
  });
});

describe("Riesenmolekülwolke – +1 % Output je Generator", () => {
  it("skaliert mit der Gesamtzahl aller Generatoren", () => {
    const s = createInitialState();
    s.generators.g1.owned = 30;
    s.generators.g2.owned = 20; // gesamt 50 -> +50 %
    expect(generatorOutputMultiplier(s, "g5").toNumber()).toBeCloseTo(1.5, 9);
  });

  it("wirkt nur auf die Riesenmolekülwolke", () => {
    const s = createInitialState();
    s.generators.g2.owned = 50;
    expect(generatorOutputMultiplier(s, "g3").toNumber()).toBeCloseTo(1, 9);
  });

  it("Kosmische Filamente erhöhen die Rate um +0,05 Pp. je Stück", () => {
    const s = createInitialState();
    s.generators.g8.owned = 100; // Rate: 0,01 + 0,0005·100 = 0,06 ; gesamt = 100
    // g5-Output: 1 + 0,06 · 100 = 7
    expect(generatorOutputMultiplier(s, "g5").toNumber()).toBeCloseTo(7, 6);
  });
});

describe("Max alle", () => {
  it("kauft von jedem Generator mit dem verfügbaren H", () => {
    const s = getState();
    s.h = new Decimal(1000); // reicht für ein paar Molekülwolken (Basis 50)
    // andere Zähler zurücksetzen für saubere Prüfung
    for (const id in s.generators) s.generators[id].owned = 0;
    buyMaxAll();
    expect(getState().generators.g1.owned).toBeGreaterThan(0);
  });
});

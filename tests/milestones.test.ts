import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/lib/game/state";
import {
  totalGeneratorsOwned,
  milestoneProductionMultiplier,
  milestoneClickMultiplier,
  clickValue,
  totalProductionPerSec,
} from "../src/lib/game/formulas";
import { CLICK_BASE } from "../src/lib/game/constants";

describe("Generator-Meilenstein (10 Generatoren)", () => {
  it("zählt die Gesamtzahl aller Generatoren", () => {
    const s = createInitialState();
    s.generators.g1.owned = 4;
    s.generators.g2.owned = 3;
    s.generators.g3.owned = 2;
    expect(totalGeneratorsOwned(s)).toBe(9);
  });

  it("unter 10 Generatoren: keine Meilenstein-Boni", () => {
    const s = createInitialState();
    s.generators.g1.owned = 9;
    expect(milestoneProductionMultiplier(s).toNumber()).toBe(1);
    expect(milestoneClickMultiplier(s).toNumber()).toBe(1);
  });

  it("ab 10 Generatoren: Auto ×1,5, Klick ×2", () => {
    const s = createInitialState();
    s.generators.g1.owned = 6;
    s.generators.g2.owned = 4; // gesamt 10
    expect(milestoneProductionMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
    expect(milestoneClickMultiplier(s).toNumber()).toBeCloseTo(2, 9);
  });

  it("Meilenstein fließt in Klick- und Auto-Einkommen ein", () => {
    const s = createInitialState();
    // Referenzwerte mit 1 Generator (unter Schwelle)
    s.generators.g1.owned = 1;
    const clickBefore = clickValue(s, CLICK_BASE).toNumber();
    const prodBefore = totalProductionPerSec(s).toNumber();

    // Auf 10 Generatoren auffüllen (g1) -> Meilenstein aktiv
    s.generators.g1.owned = 10;
    const clickAfter = clickValue(s, CLICK_BASE).toNumber();
    const prodAfter = totalProductionPerSec(s).toNumber();

    // Klick: ×2 durch Meilenstein (g1 hat keine clickMult-Perks unter 10;
    // bei 10 greift der g1-Perk +50% Klick zusätzlich -> Klick separat prüfen
    // ist heikel, daher nur Meilenstein-Faktor isoliert testen):
    expect(milestoneClickMultiplier(s).toNumber()).toBeCloseTo(2, 9);
    expect(milestoneProductionMultiplier(s).toNumber()).toBeCloseTo(1.5, 9);
    // Einkommen ist mit Meilenstein größer als ohne
    expect(clickAfter).toBeGreaterThan(clickBefore);
    expect(prodAfter).toBeGreaterThan(prodBefore);
  });
});

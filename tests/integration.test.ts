import { describe, it, expect } from "vitest";
import { Decimal } from "../src/lib/game/decimal";
import { TWO_MOL, TWO_MOL_H } from "../src/lib/game/constants";
import {
  getState,
  click,
  buyGenerator,
  tick,
  collapseCloud,
  convertAllAEtoKelvin,
  ignite,
  fuse,
} from "../src/lib/game/store";

/**
 * Fährt den kompletten Frühphasen-Loop durch:
 * Klick -> Generator -> Tick -> Kollaps(AE) -> Kelvin -> Zündung -> Fusion bis Be.
 * (Der Store-Singleton startet im Node-Env ohne localStorage bei 0.)
 */
describe("Kompletter Frühphasen-Loop", () => {
  it("Klick erzeugt Wasserstoff", () => {
    const before = getState().h.toNumber();
    click();
    expect(getState().h.toNumber()).toBe(before + 1);
  });

  it("Generator kaufen erhöht Produktion, Tick schreibt H gut", () => {
    const s = getState();
    s.h = new Decimal(1000);
    buyGenerator("g1");
    expect(s.generators.g1.owned).toBe(1);
    const hBefore = s.h.toNumber();
    tick(1);
    expect(getState().h.toNumber()).toBeGreaterThan(hBefore);
  });

  it("Wolke kollabieren gibt AE und setzt H/Generatoren zurück", () => {
    const s = getState();
    s.h = new Decimal(1.1e6); // -> 2 AE (Skalierung x1,1)
    collapseCloud();
    expect(s.ae.toNumber()).toBe(2);
    expect(s.h.toNumber()).toBe(0);
    expect(s.generators.g1.owned).toBe(0);
  });

  it("AE -> Kelvin -> Zündung ab 10 Mio K", () => {
    const s = getState();
    s.ae = new Decimal(60); // 60 * 200.000 = 1,2e7 K
    convertAllAEtoKelvin();
    expect(s.kelvin.gte(new Decimal(1e7))).toBe(true);
    expect(s.ignited).toBe(false);
    ignite();
    expect(s.ignited).toBe(true);
    // Zündung startet die Auto-Fusion direkt.
    expect(s.autoFusion).toBe(true);
  });

  it("Fusion H->He verbraucht 2 mol H und setzt 2 Positronen frei", () => {
    const s = getState();
    s.h = TWO_MOL_H.mul(2); // genug für eine Fusion + Rest
    fuse("He");
    expect(s.elements.He.toNumber()).toBe(1);
    expect(s.particles.positrons.toNumber()).toBe(2);
    expect(s.unlocked.He).toBe(true);
    expect(s.h.lt(TWO_MOL_H.mul(2))).toBe(true);
  });

  it("Fusion He->Li und Li->Be brauchen je 2 mol Ausgangsstoff pro Atom", () => {
    const s = getState();
    s.elements.He = TWO_MOL; // 2 mol He -> 1 Li-Atom
    const pBefore = s.particles.protons.toNumber();
    const eBefore = s.particles.electrons.toNumber();
    fuse("Li");
    expect(s.elements.Li.toNumber()).toBe(1);
    expect(s.elements.He.toNumber()).toBe(0); // 2 mol verbraucht
    expect(s.particles.protons.toNumber()).toBe(pBefore + 1);
    expect(s.particles.electrons.toNumber()).toBe(eBefore + 1);
    expect(s.unlocked.Li).toBe(true);

    s.elements.Li = TWO_MOL; // 2 mol Li -> 1 Be-Atom
    const nBefore = s.particles.neutrons.toNumber();
    fuse("Be");
    expect(s.elements.Be.toNumber()).toBe(1);
    expect(s.elements.Li.toNumber()).toBe(0);
    expect(s.particles.neutrons.toNumber()).toBe(nBefore + 3);
    expect(s.unlocked.Be).toBe(true);
  });

  it("Auto-Fusion ist nach der Zündung aktiv", () => {
    expect(getState().autoFusion).toBe(true);
  });

  it("Auto-Fusion kaskadiert H -> He -> Li -> Be im Tick", () => {
    const s = getState();
    // Generatoren produzieren 0 (nach Kollaps), daher liefert der Tick keine
    // nennenswerte H-Produktion – wir setzen H direkt für den Kaskaden-Test.
    s.elements.He = new Decimal(0);
    s.elements.Li = new Decimal(0);
    s.elements.Be = new Decimal(0);
    // Jede Stufe braucht 2 mol -> für eine Kaskade bis Be: ~ (2 mol)^3 H.
    s.h = TWO_MOL.pow(3).mul(8); // reichlich für H->He->Li->Be in einem Tick
    const beBefore = s.elements.Be.toNumber();
    tick(0.001);
    expect(s.elements.Be.toNumber()).toBeGreaterThan(beBefore);
  });
});

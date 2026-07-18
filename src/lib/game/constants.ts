import { Decimal } from "./decimal";

/**
 * Zentrale Balancing-Werte der Frühphase (bis Beryllium).
 * ALLE Zahlen hier sind Startwerte fürs Playtesting, keine finale Balance.
 * Siehe Design-Konzept: Klick -> Generatoren -> Wolke kollabieren (AE)
 * -> AE in Kelvin -> Zündung bei 10 Mio K -> Fusion H->He bei 2 mol.
 */

// ---- Loop / Persistenz ----
export const TICK_HZ = 20;
export const TICK_INTERVAL_MS = 1000 / TICK_HZ;
export const AUTOSAVE_INTERVAL_S = 30;
export const OFFLINE_CAP_HOURS = 12;
export const SAVE_KEY = "element-clicker-save-v1";
export const SAVE_VERSION = 1;

// ---- Naturkonstante ----
/** Avogadro-Konstante: Atome pro mol. */
export const AVOGADRO = new Decimal("6.02214076e23");
/** 2 mol H (in Atomen) – Kosten der ersten Fusion H->He. */
export const TWO_MOL_H = AVOGADRO.mul(2);

// ---- Klick ----
export const CLICK_BASE = new Decimal(1); // 1 H-Atom pro Klick (Upgrades später)

// ---- Generatoren: Kostenkurve mit abflachender Wachstumsrate ----
// r(n) = FLOOR + SPAN * 0.5^(n / KAPPA)
//   n=0   -> 1.15   (FLOOR + SPAN)
//   n=100 -> 1.10
//   n=200 -> 1.075
//   n->∞  -> 1.05   (FLOOR)
export const COST_GROWTH_FLOOR = 1.05;
export const COST_GROWTH_SPAN = 0.1;
export const COST_GROWTH_KAPPA = 100;

// ---- Perk-Meilensteine (Effekte werden später festgelegt) ----
// Gilt pro Generator, anhand der besessenen Anzahl. Aktuell nur ein
// milder Platzhalter-Multiplikator (siehe formulas.ts / milestoneMultiplier).
export const PERK_MILESTONES: number[] = [
  10, 25, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700,
  800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500,
  5000,
];
// Platzhalter: jeder erreichte Meilenstein multipliziert die Eigenproduktion.
// Bewusst klein gehalten, bis die echten Perks feststehen.
export const PERK_MILESTONE_PLACEHOLDER_MULT = 1.1;

// ---- Aktivierungsenergie (AE) ----
// n-te AE-Einheit benötigt (H im aktuellen Run):  T(n) = BASE * RATIO^(n-1)
//   T(1)=1e6, T(2)=2.1e6, T(3)=4.41e6, ...
export const AE_BASE_H = 1e6;
export const AE_RATIO = 2.1;
/** Jede gehaltene AE gibt +2% globale H-Produktion. */
export const AE_PRODUCTION_BONUS = 0.02;

// ---- Kelvin / Zündung ----
// Feinjustiert, damit die Zündung nahe an die 2-mol-Hürde rückt:
//   1 AE = 200.000 K  ->  ~50 AE nötig, Zündung landet bei ~6e21 H.
export const KELVIN_PER_AE = new Decimal(200_000);
/** Zündtemperatur: 10 Mio K (= 10^7 K, echte H-Zündtemperatur). */
export const IGNITION_KELVIN = new Decimal(10_000_000);

// ---- Gravitonen (erst nach der ersten Zündung freigeschaltet) ----
// Nebel kollabieren: verbraucht AE + H, gibt Gravitonen.
// Jedes Graviton senkt die AE-Schwellen: BASE * FACTOR^gravitonen.
export const GRAVITON_THRESHOLD_FACTOR = 0.95;
export const GRAVITON_AE_COST = new Decimal(10); // AE-Kosten pro Nebel-Kollaps
export const GRAVITON_H_COST = new Decimal("1e18"); // H-Kosten pro Nebel-Kollaps (Startwert)

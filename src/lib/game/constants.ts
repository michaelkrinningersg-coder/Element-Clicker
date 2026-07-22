import { Decimal } from "./decimal";

/** Zentrale Balancing-Werte (Sandkörner-Clicker). Startwerte, keine finale Balance. */

// ---- Loop / Persistenz ----
export const TICK_HZ = 20;
export const TICK_INTERVAL_MS = 1000 / TICK_HZ;
export const AUTOSAVE_INTERVAL_S = 30;
export const OFFLINE_CAP_HOURS = 12;
export const SAVE_KEY = "sand-clicker-save-v1";
export const SAVE_VERSION = 1;

// ---- Klick ----
export const CLICK_BASE = new Decimal(1); // 1 Sandkorn pro Klick (Basis)

// ---- Physik: Gewicht ----
export const GRAINS_PER_MG = 100; // 100 Sandkörner wiegen 1 mg

// ---- Gebäude-Kostenkurve (abflachend) ----
export const COST_GROWTH_FLOOR = 1.05;
export const COST_GROWTH_SPAN = 0.1;
export const COST_GROWTH_KAPPA = 100;

// ---- Prestige: Glas ----
export const GLAS_UNLOCK = new Decimal("1e9"); // ab 1 Mrd. Sand freigeschaltet
export const GLAS_BONUS_PER = 0.1; // +10 % auf Sand-Produktion & Klick je Glas

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
// Erdmasse 5,972·10^24 kg → in Sandkörnern (1 kg = 1e6 mg = 1e8 Körner).
export const EARTH_MASS_GRAINS = new Decimal("5.972e32");
export const TONNE_IN_GRAINS = new Decimal("1e11"); // 1 t = 1e9 mg = 1e11 Körner

// ---- Graben: Tiefe aus Sandgewicht ----
export const EARTH_DIAMETER_M = 12_742_000; // Erddurchmesser (max. Grabtiefe)
export const DIG_CENTER_M = EARTH_DIAMETER_M / 2; // Erdmittelpunkt (Referenz für Skalierung)
// Graben wird mit der Tiefe exponentiell schwerer: an der Oberfläche DIG_START_TPM
// Tonnen je Meter, im Erdmittelpunkt das DIG_CENTER_FACTOR-fache davon.
export const DIG_START_TPM = 10; // t/m an der Oberfläche (unverändert)
export const DIG_CENTER_FACTOR = 1e15; // im Erdmittelpunkt 1e15× so schwer

// Vergleichstiefen als Meilensteine (nach Tiefe aufsteigend). Jeder erreichte
// Meilenstein gibt +1 % auf alle Einkünfte (Klick & Produktion).
export const DIG_MILESTONE_BONUS_PER = 0.01;
export const DIG_MILESTONES: { id: string; name: string; m: number }[] = [
  { id: "mensch", name: "Größe eines Menschen", m: 1.8 },
  { id: "sphinx", name: "Die Sphinx (Höhe)", m: 20 },
  { id: "sandburg-rekord", name: "Höchste Sandburg der Welt", m: 21.16 },
  { id: "duene-de", name: "Höchste Düne Deutschlands", m: 52 },
  { id: "duene-eu", name: "Höchste Düne Europas (Dune du Pilat)", m: 110 },
  { id: "baum", name: "Höchster Baum der Erde (Hyperion)", m: 115.7 },
  { id: "cheops", name: "Cheops-Pyramide (Höhe)", m: 139 },
  { id: "koelner-dom", name: "Kölner Dom", m: 157 },
  { id: "see-de", name: "Tiefster See Deutschlands (Bodensee)", m: 251 },
  { id: "empire-state", name: "Empire State Building (Dach)", m: 381 },
  { id: "burj-khalifa", name: "Burj Khalifa", m: 828 },
  { id: "brocken", name: "Brocken (Harz)", m: 1141 },
  { id: "duene-welt", name: "Höchste Düne der Welt (Cerro Blanco)", m: 1176 },
  { id: "see-welt", name: "Tiefster See der Erde (Baikalsee)", m: 1642 },
  { id: "zugspitze", name: "Zugspitze", m: 2962 },
  { id: "montblanc", name: "Mont Blanc", m: 4808 },
  { id: "everest", name: "Mount Everest", m: 8849 },
  { id: "marianengraben", name: "Tiefster Punkt im Meer (Marianengraben)", m: 10_994 },
  { id: "kola", name: "Tiefste Bohrung (Kola, Russland)", m: 12_262 },
  { id: "erdkruste", name: "Untergrenze der Erdkruste", m: 35_000 },
  { id: "erdmantel", name: "Oberer Erdmantel", m: 410_000 },
  { id: "erdkern", name: "Äußerer Erdkern", m: 2_890_000 },
  { id: "erdmittelpunkt", name: "Erdmittelpunkt", m: 6_371_000 },
];

// ---- Gebäude-Kostenkurve (abflachend) ----
export const COST_GROWTH_FLOOR = 1.05;
export const COST_GROWTH_SPAN = 0.1;
export const COST_GROWTH_KAPPA = 100;

// ---- Prestige: Glas ----
export const GLAS_UNLOCK = new Decimal("1e9"); // ab 1 Mrd. Sand freigeschaltet
export const GLAS_BONUS_PER = 0.1; // +10 % auf Sand-Produktion & Klick je Glas

// ---- Bauwerke (Erfolge) ----
export const ACH_PROD_PER = 0.02; // +2 % auf alle Produktion je gebautem Bauwerk (multiplikativ)
export const ACH_COST_PER = 0.01; // −1 % Kosten je Bauwerk (multiplikativ, 0,99^n)

// ---- Generator-Synergie ----
export const GENERATOR_BOOST_PER = 0.001; // +0,1 % Produktion je gebautem Generator (gesamt)

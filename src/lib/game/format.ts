import { Decimal } from "./decimal";
import { EARTH_MASS_GRAINS, GRAINS_PER_MG } from "./constants";

/** Große Zahlen als Mantisse×10^Exponent, kleine mit Tausenderpunkten (de-DE). */
export function formatDecimal(d: Decimal, decimals = 2): string {
  if (d.lt(0)) return "-" + formatDecimal(d.neg(), decimals);
  if (d.eq(0)) return "0";
  if (d.lt(1e6)) {
    const n = d.toNumber();
    if (n < 1000 && !Number.isInteger(n)) {
      return n.toLocaleString("de-DE", { maximumFractionDigits: decimals });
    }
    return Math.floor(n).toLocaleString("de-DE");
  }
  const exp = d.exponent;
  const mantissa = d.mantissa;
  return `${mantissa.toFixed(decimals)}·10^${exp}`;
}

/** Ganzzahlige Anzeige. */
export function formatInt(d: Decimal): string {
  return formatDecimal(d, 0);
}

/** Zahl (JS number) mit Tausenderpunkten. */
export function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString("de-DE");
}

/**
 * Gewicht einer Sandmenge (100 Körner = 1 mg), mit passender Einheit.
 * Leiter: mg → g → kg → t → kt → Mt → Gt.
 */
export function formatWeight(grains: Decimal): string {
  if (grains.lte(0)) return "0 mg";
  const mg = grains.div(GRAINS_PER_MG);
  const units: { u: string; f: Decimal }[] = [
    { u: "mg", f: new Decimal(1) },
    { u: "g", f: new Decimal(1e3) },
    { u: "kg", f: new Decimal(1e6) },
    { u: "t", f: new Decimal(1e9) },
    { u: "kt", f: new Decimal(1e12) },
    { u: "Mt", f: new Decimal(1e15) },
    { u: "Gt", f: new Decimal(1e18) },
  ];
  let chosen = units[0];
  for (const unit of units) {
    if (mg.gte(unit.f)) chosen = unit;
    else break;
  }
  const value = mg.div(chosen.f);
  const num = value.lt(1e6)
    ? value.toNumber().toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : formatDecimal(value, 2);
  return `${num} ${chosen.u}`;
}

/** Anteil der gesammelten Sandmenge an der Erdmasse, in Prozent. */
export function earthMassPercent(grains: Decimal): Decimal {
  if (grains.lte(0)) return new Decimal(0);
  return grains.div(EARTH_MASS_GRAINS).mul(100);
}

/** Fester Prozentwert mit `decimals` Nachkommastellen (de-DE, Komma). */
export function formatFixedPercent(value: Decimal, decimals = 15): string {
  const n = value.toNumber();
  return n.toFixed(decimals).replace(".", ",");
}

/** Wissenschaftliche Notation m·10^e (auch für sehr kleine Zahlen). */
export function formatScientific(d: Decimal, decimals = 2): string {
  if (d.lte(0)) return "0";
  return `${d.mantissa.toFixed(decimals).replace(".", ",")}·10^${d.exponent}`;
}

/**
 * Grabtiefe: bis 10 m auf Millimeter, bis 100 m auf Zentimeter,
 * 100–600 m auf Dezimeter, darüber ganze Meter (mit Tausenderpunkten).
 */
export function formatDepth(m: number): string {
  if (m < 10) {
    let whole = Math.floor(m);
    let mm = Math.round((m - whole) * 1000);
    if (mm >= 1000) {
      whole += 1;
      mm = 0;
    }
    return `${whole} m ${mm} mm`;
  }
  if (m < 100) {
    let whole = Math.floor(m);
    let cm = Math.round((m - whole) * 100);
    if (cm >= 100) {
      whole += 1;
      cm = 0;
    }
    return `${whole} m ${cm} cm`;
  }
  if (m < 600) {
    let whole = Math.floor(m);
    let dm = Math.round((m - whole) * 10);
    if (dm >= 10) {
      whole += 1;
      dm = 0;
    }
    return `${whole} m ${dm} dm`;
  }
  return `${Math.floor(m).toLocaleString("de-DE")} m`;
}

/** Tiefe in Kilometern (2 Nachkommastellen) für Sekundär-Anzeige. */
export function formatKm(m: number): string {
  return `${(m / 1000).toLocaleString("de-DE", { maximumFractionDigits: 2 })} km`;
}

/**
 * Kompakte Restdauer aus einer (evtl. sehr großen) Sekundenzahl:
 * s / min / h / d / Jahre (darüber wissenschaftlich).
 */
export function formatEtaSeconds(sec: Decimal): string {
  if (sec.lte(0)) return "0 s";
  if (sec.lt(60)) return `${Math.max(1, Math.ceil(sec.toNumber()))} s`;
  if (sec.lt(3600)) return `${Math.round(sec.toNumber() / 60)} min`;
  if (sec.lt(86400)) return `${Math.round(sec.toNumber() / 3600)} h`;
  if (sec.lt(31557600)) return `${Math.round(sec.toNumber() / 86400)} d`;
  const years = sec.div(31557600);
  return `${years.lt(1e6) ? formatInt(years) : formatDecimal(years)} Jahre`;
}

/**
 * Geschätzte Zeit, bis `current` das `target` erreicht, bei `perSec` pro Sekunde.
 * Gibt "—" zurück, wenn keine Produktion läuft.
 */
export function formatEta(target: Decimal, current: Decimal, perSec: Decimal): string {
  if (current.gte(target)) return "erreicht";
  if (perSec.lte(0)) return "—";
  return formatEtaSeconds(target.sub(current).div(perSec));
}

/** Sekunden als "Xd Yh Zm Ws". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h || d) parts.push(`${h}h`);
  if (m || h || d) parts.push(`${m}m`);
  parts.push(`${sec}s`);
  return parts.join(" ");
}

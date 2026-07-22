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

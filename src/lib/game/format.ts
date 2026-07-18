import { Decimal } from "./decimal";
import { AVOGADRO } from "./constants";

/**
 * Zahlenformatierung. Große Zahlen in Mantisse×10^Exponent, kleine mit
 * Tausenderpunkten (de-DE).
 */
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

/** Formatiert eine Atom-Anzahl als mol-Wert (Atome / Avogadro). */
export function formatMol(atoms: Decimal, decimals = 2): string {
  const mol = atoms.div(AVOGADRO);
  if (mol.eq(0)) return "0 mol";
  if (mol.lt(0.01)) return `${formatDecimal(mol, 3)} mol`;
  return `${formatDecimal(mol, decimals)} mol`;
}

/** Ganzzahlige Anzeige (für AE, Gravitonen etc.). */
export function formatInt(d: Decimal): string {
  return formatDecimal(d, 0);
}

/** Zahl (JS number) mit Tausenderpunkten. */
export function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString("de-DE");
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

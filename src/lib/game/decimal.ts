import Decimal from "break_infinity.js";

export { Decimal };

export type DecimalSource = Decimal | number | string;

export const ZERO = new Decimal(0);
export const ONE = new Decimal(1);

/** Bequemer Konstruktor: gibt vorhandene Decimals unverändert zurück. */
export function D(x: DecimalSource): Decimal {
  return x instanceof Decimal ? x : new Decimal(x);
}

const inr = new Intl.NumberFormat("en-IN");
const inr1 = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function crore(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  const a = Math.abs(v);
  const sign = v < 0 ? "−" : "";
  if (a >= 100000) return sign + "₹" + inr1.format(a / 100000) + " L Cr";
  return sign + "₹" + inr.format(Math.round(a)) + " Cr";
}

export function rupees(v: number | null | undefined, dp?: number): string {
  if (v == null || isNaN(v)) return "—";
  const sign = v < 0 ? "−" : "";
  const a = Math.abs(v);
  if (dp != null) {
    return sign + "₹" + new Intl.NumberFormat("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(a);
  }
  return sign + "₹" + inr.format(Math.round(a));
}

export function money(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  const sign = v < 0 ? "−" : "";
  const a = Math.abs(v);
  if (a >= 1e7) return sign + "₹" + inr1.format(a / 1e7) + " Cr";
  if (a >= 1e5) return sign + "₹" + inr1.format(a / 1e5) + " L";
  return sign + "₹" + inr.format(Math.round(a));
}

export function pct(v: number | null | undefined, dp = 1): string {
  if (v == null || isNaN(v)) return "—";
  return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(dp) + "%";
}

export function pctPlain(v: number | null | undefined, dp = 1): string {
  if (v == null || isNaN(v)) return "—";
  return v.toFixed(dp) + "%";
}

export function mult(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  return v.toFixed(1) + "×";
}

export const F = { crore, rupees, money, pct, pctPlain, mult, inr };

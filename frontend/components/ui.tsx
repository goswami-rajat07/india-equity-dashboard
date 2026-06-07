"use client";

import { F } from "@/lib/format";
import type { Signal } from "@/lib/types";

export const PAL = {
  ink: "#1A1C22", muted: "#737886", grid: "#ECEDF1", border: "#E4E5EA",
  rev: "#4B57C9", margin: "#1F9C8E", profitPos: "#4B57C9", profitNeg: "#CE4B43",
  pe: "#6E54C8", price: "#1A1C22", proj: "#C8902A",
  buy: "#1E9E66", hold: "#C8902A", sell: "#CE4B43",
};

export function SignalBadge({ signal, size = "sm" }: { signal: Signal; size?: "sm" | "lg" }) {
  const map: Record<string, string> = { Buy: "buy", Hold: "hold", Sell: "sell" };
  return <span className={`badge badge-${map[signal.label]} badge-${size}`}>{signal.label}</span>;
}

export function Delta({ value, dp = 1, plain = false }: { value: number | null | undefined; dp?: number; plain?: boolean }) {
  if (value == null || isNaN(value)) return <span className="delta">—</span>;
  const cls = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const txt = plain
    ? value.toFixed(dp) + "%"
    : (value >= 0 ? "+" : "−") + Math.abs(value).toFixed(dp) + "%";
  return <span className={`delta ${cls}`}>{txt}</span>;
}

export function Stat({ label, value, sub, accent }: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-l">{label}</div>
      <div className="stat-v mono" style={accent ? { color: accent } : undefined}>{value}</div>
      {sub != null && <div className="stat-s">{sub}</div>}
    </div>
  );
}

export function Segmented<T extends string>({
  options, value, onChange,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button
          key={o.v}
          role="tab"
          aria-selected={value === o.v}
          className={value === o.v ? "seg-on" : ""}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PortfolioTotals({ stocks }: { stocks: Array<{ invested?: number; value?: number | null; latest_price: number | null; prev_close: number | null; qty: number }> }) {
  const invested = stocks.reduce((a, s) => a + (s.invested ?? 0), 0);
  const value = stocks.reduce((a, s) => a + (s.value ?? 0), 0);
  const pnl = value - invested;
  const pnl_pct = invested > 0 ? ((value / invested) - 1) * 100 : 0;
  const dayPL = stocks.reduce((a, s) => {
    if (s.latest_price == null || s.prev_close == null) return a;
    return a + s.qty * (s.latest_price - s.prev_close);
  }, 0);
  const prevVal = value - dayPL;
  const dayPct = prevVal > 0 ? (dayPL / prevVal) * 100 : 0;
  return { invested, value, pnl, pnl_pct, dayPL, dayPct };
}

export function Sparkline({ values, width = 96, height = 30 }: { values: (number | null)[]; width?: number; height?: number }) {
  const v = values.filter((x): x is number => x != null);
  if (v.length < 2) return <svg width={width} height={height} />;
  const min = Math.min(...v), max = Math.max(...v), span = max - min || 1;
  const step = width / (v.length - 1);
  const pts = v.map((x, i): [number, number] => [i * step, height - 3 - ((x - min) / span) * (height - 6)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const up = v[v.length - 1] >= v[0];
  const c = up ? PAL.buy : PAL.sell;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={c} />
    </svg>
  );
}

export { F };

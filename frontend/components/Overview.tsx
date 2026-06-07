"use client";

import { useState } from "react";
import type { PortfolioStock } from "@/lib/types";
import { SignalBadge, Delta, Stat, Sparkline, PortfolioTotals, PAL, F } from "./ui";

type SortKey = "name" | "signal" | "price" | "growth" | "npm" | "pe" | "value" | "pnlPct";
type FilterLabel = "All" | "Buy" | "Hold" | "Sell";

const COLS: { key: SortKey; label: string; align: "left" | "right"; nosort?: boolean }[] = [
  { key: "name",   label: "Holding",    align: "left" },
  { key: "signal", label: "Signal",     align: "left" },
  { key: "price",  label: "LTP / Day",  align: "right" },
  { key: "growth", label: "Rev Δ YoY",  align: "right" },
  { key: "npm",    label: "Net margin", align: "right" },
  { key: "pe",     label: "Multiple",   align: "right" },
  { key: "value",  label: "3Y price",   align: "left",  nosort: true },
  { key: "value",  label: "Value",      align: "right" },
  { key: "pnlPct", label: "Unrealised", align: "right" },
];

function sortVal(s: PortfolioStock, k: SortKey): number | string {
  const npm = s.npm[s.npm.length - 1] ?? -999;
  const pe = s.pe[s.pe.length - 1] ?? 1e9;
  const growth = s.rev_growth[s.rev_growth.length - 1] ?? -999;
  const map: Record<SortKey, number | string> = {
    name: s.name,
    signal: s.signal.score,
    price: s.latest_price,
    growth,
    npm,
    pe,
    value: s.value ?? 0,
    pnlPct: s.pnl_pct ?? 0,
  };
  return map[k];
}

export function Overview({ stocks, onOpen }: { stocks: PortfolioStock[]; onOpen: (ticker: string) => void }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "value", dir: -1 });
  const [filter, setFilter] = useState<FilterLabel>("All");

  const counts = { Buy: 0, Hold: 0, Sell: 0 };
  stocks.forEach((s) => { if (s.signal.label in counts) counts[s.signal.label as keyof typeof counts]++; });

  const totals = PortfolioTotals({ stocks });

  const clickSort = (k: SortKey) =>
    setSort((p) => p.key === k ? { key: k, dir: (-p.dir) as 1 | -1 } : { key: k, dir: k === "name" ? 1 : -1 });

  let rows = stocks.slice();
  if (filter !== "All") rows = rows.filter((s) => s.signal.label === filter);
  rows.sort((a, b) => {
    const av = sortVal(a, sort.key), bv = sortVal(b, sort.key);
    if (typeof av === "string") return av.localeCompare(bv as string) * sort.dir;
    return ((av as number) - (bv as number)) * sort.dir;
  });

  return (
    <div className="view">
      <div className="ov-head">
        <div>
          <h1 className="page-title">Portfolio</h1>
          <p className="page-sub">{stocks.length} holdings · Q4 FY26 · all figures in ₹</p>
        </div>
        <div className="ov-kpis">
          <Stat label="Current value"  value={F.money(totals.value)} />
          <Stat label="Invested"       value={F.money(totals.invested)} />
          <Stat label="Overall P&L"    value={F.money(totals.pnl)}
            sub={<Delta value={totals.pnl_pct} />} accent={totals.pnl >= 0 ? PAL.buy : PAL.sell} />
          <Stat label="Today"          value={F.money(totals.dayPL)}
            sub={<Delta value={totals.dayPct} dp={2} />} accent={totals.dayPL >= 0 ? PAL.buy : PAL.sell} />
        </div>
      </div>

      <div className="ov-bar">
        <div className="filters">
          {(["All", "Buy", "Hold", "Sell"] as FilterLabel[]).map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? "chip-on" : ""} ${f !== "All" ? `chip-${f.toLowerCase()}` : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}{f !== "All" && <span className="chip-n">{counts[f as keyof typeof counts]}</span>}
            </button>
          ))}
        </div>
        <div className="alloc">
          <span className="alloc-seg" style={{ background: PAL.buy,  flex: counts.Buy  || 0.01 }} title={`${counts.Buy} Buy`} />
          <span className="alloc-seg" style={{ background: PAL.hold, flex: counts.Hold || 0.01 }} title={`${counts.Hold} Hold`} />
          <span className="alloc-seg" style={{ background: PAL.sell, flex: counts.Sell || 0.01 }} title={`${counts.Sell} Sell`} />
        </div>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              {COLS.map((c, ci) => (
                <th
                  key={ci}
                  className={`th-${c.align} ${c.nosort ? "" : "th-sort"} ${!c.nosort && sort.key === c.key ? "th-active" : ""}`}
                  onClick={c.nosort ? undefined : () => clickSort(c.key)}
                >
                  {c.label}
                  {!c.nosort && sort.key === c.key && (
                    <span className="caret">{sort.dir < 0 ? "▾" : "▴"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const latestNpm = s.npm[s.npm.length - 1];
              const latestPe  = s.pe[s.pe.length - 1];
              const latestG   = s.rev_growth[s.rev_growth.length - 1];
              return (
                <tr key={s.ticker} onClick={() => onOpen(s.ticker)} className="row">
                  <td className="th-left">
                    <div className="cell-name">{s.name}</div>
                    <div className="cell-sub">{s.ticker} · {s.sector}</div>
                  </td>
                  <td><SignalBadge signal={s.signal} /></td>
                  <td className="th-right">
                    <div className="mono">{F.rupees(s.latest_price)}</div>
                    <Delta value={s.day_chg} dp={2} />
                  </td>
                  <td className="th-right"><Delta value={latestG} /></td>
                  <td className="th-right mono">{latestNpm != null ? F.pctPlain(latestNpm) : "—"}</td>
                  <td className="th-right mono">{latestPe != null ? F.mult(latestPe) : "—"}</td>
                  <td><Sparkline values={s.price_history} /></td>
                  <td className="th-right mono">{F.money(s.value)}</td>
                  <td className="th-right"><Delta value={s.pnl_pct} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

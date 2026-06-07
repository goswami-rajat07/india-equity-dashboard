"use client";

import type { DetailSeries, PortfolioStock } from "@/lib/types";
import { Chart } from "./Chart";
import { Projection } from "./Projection";
import { SignalBadge, Delta, Stat, PAL, F } from "./ui";

interface Props {
  series: DetailSeries;
  holding: PortfolioStock;
  onBack: () => void;
}

export function Detail({ series, holding, onBack }: Props) {
  const sig = holding.signal;
  const latestNpm  = series.npm[series.npm.length - 1];
  const latestPe   = series.pe[series.pe.length - 1];
  const latestG    = series.rev_growth[series.rev_growth.length - 1];
  const latestNp   = series.np[series.np.length - 1];
  const latestRev  = series.rev[series.rev.length - 1];
  const npmThreeAgo = series.npm.length >= 3 ? series.npm[series.npm.length - 4] : null;

  const rows = [
    { l: "Revenue",       v: series.rev,        f: (x: number) => F.crore(x) },
    { l: "Net profit",    v: series.np,         f: (x: number) => F.crore(x), neg: true },
    { l: "Net margin",    v: series.npm,        f: (x: number | null) => x == null ? "—" : F.pctPlain(x), neg: true },
    { l: "Rev growth YoY",v: series.rev_growth, f: (x: number | null) => x == null ? "—" : F.pct(x), neg: true },
    { l: "EPS",           v: series.eps,        f: (x: number | null) => x == null ? "—" : F.rupees(x, 1), neg: true },
    { l: "P/E or P/S",    v: series.pe,         f: (x: number | null) => x == null ? "—" : F.mult(x) },
    { l: "Price",         v: series.price_history, f: (x: number | null) => x == null ? "—" : F.rupees(x) },
  ];

  return (
    <div className="view">
      <button className="back" onClick={onBack}>← Portfolio</button>

      <div className="dt-head">
        <div className="dt-id">
          <div className="dt-name-row">
            <h1 className="page-title">{series.name}</h1>
            <SignalBadge signal={sig} size="lg" />
          </div>
          <p className="page-sub">{series.ticker} · {series.sector} · {series.shares} Cr shares</p>
          <div className="reasons">
            {sig.reasons.map((r, i) => <span key={i} className="reason">{r}</span>)}
          </div>
        </div>

        <div className="dt-price-box">
          <div className="dt-ltp mono">{F.rupees(holding.latest_price)}</div>
          <Delta value={holding.day_chg} dp={2} />
          <div className="dt-hold">
            <div className="hold-row"><span>Holding</span><b className="mono">{holding.qty} sh</b></div>
            <div className="hold-row"><span>Avg cost</span><b className="mono">{F.rupees(holding.avg_cost)}</b></div>
            <div className="hold-row"><span>Value</span><b className="mono">{F.money(holding.value)}</b></div>
            <div className="hold-row">
              <span>Unrealised</span>
              <b className="mono" style={{ color: (holding.pnl ?? 0) >= 0 ? PAL.buy : PAL.sell }}>
                {F.money(holding.pnl)} <Delta value={holding.pnl_pct} />
              </b>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-strip">
        <Stat label="Revenue (latest)" value={F.crore(latestRev)} sub={<Delta value={latestG} />} />
        <Stat label="Net profit (latest)" value={F.crore(latestNp)} accent={latestNp != null && latestNp < 0 ? PAL.sell : undefined} />
        <Stat label="Net margin" value={latestNpm != null ? F.pctPlain(latestNpm) : "—"}
          sub={npmThreeAgo != null ? `from ${F.pctPlain(npmThreeAgo)} (3yr ago)` : undefined} />
        <Stat label={series.multiple_type + " (latest)"} value={latestPe != null ? F.mult(latestPe) : "—"}
          accent={(latestPe ?? 0) > 80 ? PAL.hold : undefined} />
        <Stat label="EPS (latest)" value={F.rupees(series.eps[series.eps.length - 1], 1)} />
      </div>

      <div className="sec-bar">
        <h3 className="sec-title">Financial history · {series.fys[0]} → {series.fys[series.fys.length - 1]}</h3>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-h">
            <span>Revenue & net margin</span>
            <span className="leg">
              <i style={{ background: PAL.rev }} />Revenue
              <i style={{ background: PAL.margin }} />Margin
            </span>
          </div>
          <Chart
            categories={series.fys} height={230}
            bars={{ values: series.rev, color: PAL.rev, label: "Revenue", fmt: (v) => F.crore(v) }}
            lines={[{ values: series.npm, color: PAL.margin, axis: "right", label: "Net margin", fmt: (v) => F.pctPlain(v) }]}
            leftFmt={(v) => v >= 1000 ? (v / 1000).toFixed(0) + "k" : String(v)}
            rightFmt={(v) => v + "%"}
          />
        </div>

        <div className="card">
          <div className="card-h"><span>Net profit</span></div>
          <Chart
            categories={series.fys} height={230} yZero
            bars={{ values: series.np, color: PAL.rev, label: "Net profit", fmt: (v) => F.crore(v) }}
            leftFmt={(v) => v >= 1000 || v <= -1000 ? (v / 1000).toFixed(0) + "k" : String(v)}
          />
        </div>

        <div className="card">
          <div className="card-h"><span>{series.multiple_type} ratio</span></div>
          <Chart
            categories={series.fys} height={230}
            lines={[{ values: series.pe, color: PAL.pe, axis: "left", label: series.multiple_type, fmt: (v) => F.mult(v) }]}
            leftFmt={(v) => v + "×"}
          />
        </div>

        <div className="card">
          <div className="card-h"><span>Share price</span></div>
          <Chart
            categories={series.fys} height={230}
            lines={[{ values: series.price_history, color: PAL.price, axis: "left", label: "Price", fmt: (v) => F.rupees(v) }]}
            leftFmt={(v) => "₹" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v)}
          />
        </div>
      </div>

      <div className="card tbl-card">
        <table className="fin-tbl mono">
          <thead>
            <tr>
              <th className="th-left fin-metric">₹ Cr / ratio</th>
              {series.fys.map((fy) => <th key={fy}>{fy}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.l}>
                <td className="th-left fin-metric">{r.l}</td>
                {(r.v as (number | null)[]).map((x, i) => (
                  <td key={i} style={r.neg && (x ?? 0) < 0 ? { color: PAL.sell } : undefined}>
                    {r.f(x as never)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Projection
        series={series}
        holdings={{ qty: holding.qty, avg_cost: holding.avg_cost, latest_price: holding.latest_price }}
      />
    </div>
  );
}

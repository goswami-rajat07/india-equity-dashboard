"use client";

import { useState } from "react";
import type { DetailSeries } from "@/lib/types";
import { Chart } from "./Chart";
import { Stat, PAL, F } from "./ui";

function Slider({ label, value, min, max, step, onChange, fmt, hint }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; fmt?: (v: number) => string; hint?: string;
}) {
  const pctPos = ((value - min) / (max - min)) * 100;
  return (
    <div className="sld">
      <div className="sld-top">
        <span className="sld-l">{label}{hint && <i className="sld-hint" title={hint}>ⓘ</i>}</span>
        <span className="sld-v mono">{fmt ? fmt(value) : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ background: `linear-gradient(to right, ${PAL.rev} ${pctPos}%, #E4E5EA ${pctPos}%)` }}
      />
    </div>
  );
}

export function Projection({ series, holdings }: {
  series: DetailSeries;
  holdings: { qty: number; avg_cost: number; latest_price: number };
}) {
  const baseRev = series.rev[series.rev.length - 1] ?? 0;
  const baseNpm = series.npm[series.npm.length - 1] ?? 5;
  const curPE = series.pe[series.pe.length - 1] ?? null;
  const histCagr = series.rev.length >= 4
    ? Math.round((Math.pow(baseRev / series.rev[series.rev.length - 4], 1 / 3) - 1) * 100)
    : 15;

  const defaults = {
    horizon: 3,
    growth: Math.max(5, Math.min(40, histCagr)),
    margin: +Math.max(baseNpm > 0 ? baseNpm : 6, 1).toFixed(1),
    pe: Math.round(Math.max(15, Math.min(90, curPE ?? 35))),
    useGuidance: false,
    guidanceRev: Math.round(baseRev * 1.8),
    note: "",
  };
  const [a, setA] = useState(defaults);
  const set = <K extends keyof typeof defaults>(k: K, v: (typeof defaults)[K]) =>
    setA((p) => ({ ...p, [k]: v }));
  const reset = () => setA(defaults);

  const targetFY = "FY" + (26 + a.horizon);
  const projRev = a.useGuidance ? a.guidanceRev : baseRev * Math.pow(1 + a.growth / 100, a.horizon);
  const impliedG = a.useGuidance ? (Math.pow(a.guidanceRev / baseRev, 1 / a.horizon) - 1) * 100 : a.growth;
  const projNP = projRev * (a.margin / 100);
  const projEPS = projNP / series.shares;
  const projPrice = projEPS * a.pe;
  const upside = (projPrice / holdings.latest_price - 1) * 100;
  const cagr = (Math.pow(Math.abs(projPrice / holdings.latest_price), 1 / a.horizon) - 1) * 100 * (projPrice >= holdings.latest_price ? 1 : -1);

  const presets = [
    { k: "Bear", g: Math.round(defaults.growth * 0.5), m: +(defaults.margin * 0.8).toFixed(1), pe: Math.round(defaults.pe * 0.7) },
    { k: "Base", g: defaults.growth, m: defaults.margin, pe: defaults.pe },
    { k: "Bull", g: Math.round(defaults.growth * 1.4), m: +(defaults.margin * 1.2).toFixed(1), pe: Math.round(defaults.pe * 1.15) },
  ];
  const applyPreset = (p: typeof presets[0]) =>
    setA((s) => ({ ...s, growth: p.g, margin: p.m, pe: p.pe, useGuidance: false }));

  const cats = series.fys.slice();
  const prices: (number | null)[] = series.price_history.slice();
  for (let i = 1; i <= a.horizon; i++) {
    cats.push("FY" + (26 + i));
    prices.push(Math.round(holdings.latest_price * Math.pow(Math.abs(projPrice / holdings.latest_price), i / a.horizon)));
  }
  const verdict =
    upside >= 35 ? { t: "Material upside", c: PAL.buy } :
    upside >= 0  ? { t: "Modest upside",   c: PAL.hold } :
                   { t: "Downside to fair value", c: PAL.sell };

  return (
    <div className="proj">
      <div className="proj-head">
        <div>
          <h3 className="sec-title">Price projection</h3>
          <p className="sec-sub">Model {targetFY} fair value from your assumptions, then sanity-check against the current price.</p>
        </div>
        <div className="presets">
          {presets.map((p) => (
            <button key={p.k} className="preset" onClick={() => applyPreset(p)}>{p.k}</button>
          ))}
          <button className="preset preset-reset" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="proj-grid">
        <div className="proj-controls">
          <Slider label="Horizon" value={a.horizon} min={1} max={5} step={1}
            onChange={(v) => set("horizon", v)} fmt={(v) => `${v} yr → FY${26 + v}`} />
          <Slider label="Revenue growth (CAGR)" value={a.growth} min={-10} max={60} step={1}
            onChange={(v) => { set("growth", v); set("useGuidance", false); }}
            fmt={(v) => `${v}%`}
            hint="Annual revenue growth applied from the latest base year." />
          <Slider label="Net profit margin" value={a.margin} min={-10} max={35} step={0.5}
            onChange={(v) => set("margin", v)} fmt={(v) => `${v}%`}
            hint="Steady-state net margin at the end of the horizon." />
          <Slider label="Target P/E multiple" value={a.pe} min={5} max={120} step={1}
            onChange={(v) => set("pe", v)} fmt={(v) => `${v}×`}
            hint="Exit valuation the market awards on projected EPS." />

          <div className="guidance">
            <label className="gd-toggle">
              <input type="checkbox" checked={a.useGuidance} onChange={(e) => set("useGuidance", e.target.checked)} />
              <span>Use management guidance instead of growth slider</span>
            </label>
            <div className={`gd-fields ${a.useGuidance ? "" : "gd-off"}`}>
              <div className="gd-field">
                <span className="gd-lab">{targetFY} revenue guidance (₹ Cr)</span>
                <input
                  type="number" className="gd-input mono" value={a.guidanceRev}
                  onChange={(e) => set("guidanceRev", Math.max(0, parseFloat(e.target.value) || 0))}
                  disabled={!a.useGuidance}
                />
                <span className="gd-implied">implies {F.pctPlain(impliedG)} CAGR</span>
              </div>
              <input
                type="text" className="gd-note"
                placeholder="Note the source — e.g. 'Q4 FY26 concall: mgmt guided ₹X Cr by FY29'"
                value={a.note} onChange={(e) => set("note", e.target.value)}
                disabled={!a.useGuidance}
              />
            </div>
          </div>
        </div>

        <div className="proj-out">
          <div className="proj-target" style={{ borderColor: verdict.c }}>
            <div className="pt-row">
              <div>
                <div className="pt-lab">{targetFY} target price</div>
                <div className="pt-price mono">{F.rupees(projPrice)}</div>
              </div>
              <div className="pt-up" style={{ color: upside >= 0 ? PAL.buy : PAL.sell }}>
                <div className="pt-up-v">{F.pct(upside, 0)}</div>
                <div className="pt-up-l">vs {F.rupees(holdings.latest_price)} now</div>
              </div>
            </div>
            <div className="pt-verdict" style={{ color: verdict.c }}>
              {verdict.t} · {F.pctPlain(cagr)} implied annual return
            </div>
          </div>

          <div className="proj-metrics">
            <Stat label={`${targetFY} revenue`}    value={F.crore(projRev)}  sub={F.pctPlain(impliedG) + " CAGR"} />
            <Stat label={`${targetFY} net profit`} value={F.crore(projNP)}   sub={a.margin + "% margin"} />
            <Stat label={`${targetFY} EPS`}        value={F.rupees(projEPS, 1)} sub={`on ${series.shares} Cr shares`} />
            <Stat label="Exit multiple"             value={a.pe + "×"}        sub={curPE ? `now ${curPE.toFixed(0)}×` : "n/a"} />
          </div>

          <Chart
            categories={cats}
            height={210}
            lines={[{
              values: prices,
              color: PAL.price,
              axis: "left",
              dashFrom: series.fys.length,
              label: "Share price",
              fmt: (v) => F.rupees(v),
            }]}
            leftFmt={(v) => "₹" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v)}
          />
          <p className="proj-foot">Dashed segment is your modelled path. Educational model — not investment advice.</p>
        </div>
      </div>
    </div>
  );
}

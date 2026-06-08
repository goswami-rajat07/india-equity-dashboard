"use client";

import { useState } from "react";
import { PAL } from "./ui";

interface BarSpec { values: (number | null)[]; color: string; label: string; fmt?: (v: number) => string; labelFmt?: (v: number) => string; }
interface LineSpec { values: (number | null)[]; color: string; axis: "left" | "right"; label: string; fmt?: (v: number) => string; labelFmt?: (v: number) => string; dashFrom?: number; }

interface ChartProps {
  categories: string[];
  height?: number;
  viewBoxWidth?: number;
  bars?: BarSpec;
  lines?: LineSpec[];
  leftFmt?: (v: number) => string;
  rightFmt?: (v: number) => string;
  yZero?: boolean;
  showLabels?: boolean;
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

export function Chart({ categories, bars, lines = [], height = 230, viewBoxWidth = 720, leftFmt, rightFmt, yZero = false, showLabels = false }: ChartProps) {
  const [hi, setHi] = useState<number | null>(null);
  const W = viewBoxWidth, H = height;
  const m = { t: showLabels ? 26 : 16, r: lines.some(l => l.axis === "right") ? 52 : 18, b: 30, l: 56 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const n = categories.length;

  const leftVals: number[] = [];
  if (bars) bars.values.forEach(v => v != null && leftVals.push(v));
  lines.filter(l => l.axis !== "right").forEach(l => l.values.forEach(v => v != null && leftVals.push(v)));
  let lMin = Math.min(0, ...leftVals);
  const lMax = Math.max(...leftVals, 1);
  if (!yZero && lMin >= 0) lMin = 0;
  const lTop = niceMax(lMax), lBot = lMin < 0 ? -niceMax(-lMin) : 0;
  const lSpan = lTop - lBot || 1;

  const rLines = lines.filter(l => l.axis === "right");
  const rightVals: number[] = [];
  rLines.forEach(l => l.values.forEach(v => v != null && rightVals.push(v)));
  const rMin = Math.min(0, ...rightVals);
  const rMax = Math.max(...rightVals, 1);
  const rTop = niceMax(rMax), rBot = rMin < 0 ? -niceMax(-rMin) : 0;
  const rSpan = rTop - rBot || 1;

  const xAt = (i: number) => m.l + (n === 1 ? iw / 2 : (iw * i) / (n - 1));
  const xBand = iw / n;
  const xBar = (i: number) => m.l + xBand * i + xBand * 0.5;
  const yL = (v: number) => m.t + ih - ((v - lBot) / lSpan) * ih;
  const yR = (v: number) => m.t + ih - ((v - rBot) / rSpan) * ih;

  const ticks = 4;
  const gridY = Array.from({ length: ticks + 1 }, (_, i) => lBot + (lSpan * i) / ticks);

  function buildPath(vals: (number | null)[], scale: (v: number) => number, dashFrom?: number) {
    let solid = "", dash = "";
    let started = false;
    vals.forEach((v, i) => {
      if (v == null) { started = false; return; }
      const x = xAt(i), y = scale(v);
      const isDash = dashFrom != null && i >= dashFrom;
      if (isDash) {
        if (dash === "" && i > 0 && vals[i - 1] != null) dash += `M${xAt(i - 1)},${scale(vals[i - 1]!)} `;
        else if (dash === "") dash += `M${x},${y} `;
        dash += `L${x},${y} `;
      } else {
        solid += (started ? "L" : "M") + x + "," + y + " ";
        started = true;
      }
    });
    return { solid, dash };
  }

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0, bd = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs((bars ? xBar(i) : xAt(i)) - px);
      if (d < bd) { bd = d; best = i; }
    }
    setHi(best);
  }

  const hx = hi == null ? 0 : (bars ? xBar(hi) : xAt(hi));

  return (
    <div className="chart" style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        onMouseMove={onMove}
        onMouseLeave={() => setHi(null)}
      >
        {gridY.map((g, i) => (
          <g key={i}>
            <line x1={m.l} x2={W - m.r} y1={yL(g)} y2={yL(g)} stroke={g === 0 ? PAL.border : PAL.grid} strokeWidth={g === 0 ? 1.2 : 1} />
            <text x={m.l - 8} y={yL(g) + 3.5} textAnchor="end" className="cax">{leftFmt ? leftFmt(g) : g}</text>
          </g>
        ))}

        {rLines.length > 0 && Array.from({ length: ticks + 1 }, (_, i) => rBot + (rSpan * i) / ticks).map((g, i) => (
          <text key={i} x={W - m.r + 8} y={yR(g) + 3.5} textAnchor="start" className="cax" style={{ fill: rLines[0].color }}>
            {rightFmt ? rightFmt(g) : g}
          </text>
        ))}

        {hi != null && (
          <line x1={hx} x2={hx} y1={m.t} y2={m.t + ih} stroke={PAL.border} strokeWidth="1" strokeDasharray="3 3" />
        )}

        {bars && bars.values.map((v, i) => {
          if (v == null) return null;
          const y0 = yL(0), y1 = yL(v);
          const bw = Math.min(34, xBand * 0.56);
          return (
            <rect key={i} x={xBar(i) - bw / 2} y={Math.min(y0, y1)} width={bw} height={Math.abs(y1 - y0) || 1}
              rx="2" fill={bars.color} opacity={hi == null || hi === i ? 0.92 : 0.4} />
          );
        })}

        {showLabels && bars && bars.values.map((v, i) => {
          if (v == null) return null;
          const y0 = yL(0), y1 = yL(v);
          const isNeg = v < 0;
          const lf = bars.labelFmt ?? bars.fmt;
          const txt = lf ? lf(v) : v.toFixed(0);
          const labelY = isNeg
            ? Math.min(H - m.b - 4, Math.max(y0, y1) + 11)
            : Math.max(m.t + 9, Math.min(y0, y1) - 3);
          return (
            <text key={i} x={xBar(i)} y={labelY} textAnchor="middle" className="cax">
              {txt}
            </text>
          );
        })}

        {lines.map((l, li) => {
          const scale = l.axis === "right" ? yR : yL;
          const p = buildPath(l.values, scale, l.dashFrom);
          return (
            <g key={li}>
              {p.solid && <path d={p.solid} fill="none" stroke={l.color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />}
              {p.dash && <path d={p.dash} fill="none" stroke={l.color} strokeWidth="2.2" strokeDasharray="5 4" strokeLinecap="round" />}
              {l.values.map((v, i) => v == null ? null : (
                <circle key={i} cx={xAt(i)} cy={scale(v)} r={hi === i ? 4 : 2.6} fill="#fff" stroke={l.color} strokeWidth="2" />
              ))}
              {showLabels && l.values.map((v, i) => {
                if (v == null) return null;
                const lf = l.labelFmt ?? l.fmt;
                const txt = lf ? lf(v) : String(v);
                const cy = scale(v);
                const above = li % 2 === 0;
                const labelY = above
                  ? Math.max(m.t + 9, cy - 8)
                  : Math.min(H - m.b - 4, cy + 15);
                return (
                  <text key={`lbl-${i}`} x={xAt(i)} y={labelY} textAnchor="middle" className="cax" style={{ fill: l.color }}>
                    {txt}
                  </text>
                );
              })}
            </g>
          );
        })}

        {categories.map((c, i) => {
          const show = n <= 8 || i % Math.ceil(n / 8) === 0 || i === n - 1;
          if (!show) return null;
          return <text key={i} x={bars ? xBar(i) : xAt(i)} y={H - 10} textAnchor="middle" className="cax">{c}</text>;
        })}
      </svg>

      {hi != null && (
        <div className="ctip" style={{ left: `${(hx / W) * 100}%`, transform: `translateX(${hx > W * 0.6 ? "-105%" : "8px"})` }}>
          <div className="ctip-h">{categories[hi]}</div>
          {bars && bars.values[hi] != null && (
            <div className="ctip-r">
              <span className="dot" style={{ background: bars.color }} />
              {bars.label}
              <b>{bars.fmt ? bars.fmt(bars.values[hi]!) : bars.values[hi]}</b>
            </div>
          )}
          {lines.map((l, li) => l.values[hi] == null ? null : (
            <div className="ctip-r" key={li}>
              <span className="dot" style={{ background: l.color }} />
              {l.label}
              <b>{l.fmt ? l.fmt(l.values[hi]!) : l.values[hi]}{l.dashFrom != null && hi >= l.dashFrom ? " (est)" : ""}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

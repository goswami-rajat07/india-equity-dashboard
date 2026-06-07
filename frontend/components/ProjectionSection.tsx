"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Projections } from "@/lib/types";
import { Info } from "lucide-react";

const TOOLTIP_STYLE = {
  backgroundColor: "#0f1629",
  border: "1px solid #1e2d50",
  borderRadius: 8,
  color: "#e8edf7",
  fontSize: 12,
};

const axisProps = {
  tick: { fill: "#6b7fa3", fontSize: 11 },
  axisLine: { stroke: "#1e2d50" },
  tickLine: false,
};

function ChartCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f1629] border border-[#1e2d50] rounded-xl p-5">
      <p className="font-semibold text-sm mb-0.5">{title}</p>
      <p className="text-[11px] text-[#6b7fa3] mb-4">{sub}</p>
      {children}
    </div>
  );
}

export function ProjectionSection({ data }: { data: Projections }) {
  const combined = data.base.map((b, i) => ({
    fy: b.fy,
    base_rev: b.revenue,
    bull_rev: data.bull[i].revenue,
    bear_rev: data.bear[i].revenue,
    base_margin: b.margin_pct,
    bull_margin: data.bull[i].margin_pct,
    bear_margin: data.bear[i].margin_pct,
    base_price: b.share_price,
    bull_price: data.bull[i].share_price,
    bear_price: data.bear[i].share_price,
  }));

  return (
    <div className="mb-8">
      <SectionTitle>5-Year Forward Projections — FY2025 – FY2029</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Revenue Projection */}
        <ChartCard title="Revenue Projection" sub="₹ Crore · Base / Bull / Bear cases">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={combined} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <CartesianGrid vertical={false} stroke="#1e2d50" />
              <XAxis dataKey="fy" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => [`₹${v.toLocaleString()} Cr`, name]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6b7fa3" }} />
              <Bar dataKey="base_rev" name="Base" fill="#22d3a0" radius={[3, 3, 0, 0]} opacity={0.8} />
              <Line dataKey="bull_rev" name="Bull" stroke="#60a5fa" strokeWidth={2} dot={false} type="monotone" />
              <Line dataKey="bear_rev" name="Bear" stroke="#f43f5e" strokeWidth={2} dot={false} type="monotone" strokeDasharray="4 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Share Price Projection */}
        <ChartCard title="Share Price Projection" sub="₹ per share · P/S multiple method">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={combined} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <CartesianGrid vertical={false} stroke="#1e2d50" />
              <XAxis dataKey="fy" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => [`₹${v}`, name]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6b7fa3" }} />
              <Line dataKey="bull_price"  name="Bull"  stroke="#60a5fa" strokeWidth={2}   type="monotone" dot={{ r: 3 }} />
              <Line dataKey="base_price"  name="Base"  stroke="#22d3a0" strokeWidth={2.5} type="monotone" dot={{ r: 4 }} />
              <Line dataKey="bear_price"  name="Bear"  stroke="#f43f5e" strokeWidth={2}   type="monotone" dot={{ r: 3 }} strokeDasharray="4 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Margin Projection — full width */}
      <ChartCard title="Net Profit Margin Projection" sub="% · path to profitability across scenarios">
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={combined} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="fy" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => [`${v.toFixed(1)}%`, name]} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#6b7fa3" }} />
            <ReferenceLine y={0} stroke="#22d3a0" strokeDasharray="4 3" label={{ value: "Breakeven", fill: "#22d3a0", fontSize: 10 }} />
            <Line dataKey="bull_margin"  name="Bull"  stroke="#60a5fa" strokeWidth={2}   type="monotone" dot={{ r: 3 }} />
            <Line dataKey="base_margin"  name="Base"  stroke="#fbbf24" strokeWidth={2.5} type="monotone" dot={{ r: 4 }} />
            <Line dataKey="bear_margin"  name="Bear"  stroke="#f43f5e" strokeWidth={2}   type="monotone" dot={{ r: 3 }} strokeDasharray="4 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Assumptions */}
      <details className="mt-4 bg-[#0f1629] border border-[#1e2d50] rounded-xl overflow-hidden">
        <summary className="cursor-pointer px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#6b7fa3] flex items-center gap-2 select-none hover:text-[#e8edf7] transition-colors">
          <Info size={13} /> Projection Assumptions &amp; Remarks
        </summary>
        <ul className="px-5 pb-4 space-y-1.5 border-t border-[#1e2d50]">
          {data.assumptions.map((a, i) => (
            <li key={i} className="text-xs text-[#6b7fa3] leading-relaxed flex gap-2 pt-2">
              <span className="text-amber-400 shrink-0">→</span>
              {a}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7fa3]">{children}</p>
      <div className="flex-1 h-px bg-[#1e2d50]" />
    </div>
  );
}

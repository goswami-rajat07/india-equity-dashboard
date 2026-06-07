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
  const rows = data.base;
  const hasPrice = rows.some((r) => r.price_base != null);
  const hasMargin = rows.some((r) => r.margin_base != null);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Revenue Projection */}
        <ChartCard title="Revenue Projection" sub="₹ Crore · Base / Bull (+20%) / Bear (−20%)">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <CartesianGrid vertical={false} stroke="#1e2d50" />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown, name: unknown) => [`₹${Number(v).toLocaleString()} Cr`, String(name)]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6b7fa3" }} />
              <Bar dataKey="revenue_base" name="Base" fill="#22d3a0" radius={[3, 3, 0, 0]} opacity={0.8} />
              <Line dataKey="revenue_bull" name="Bull" stroke="#60a5fa" strokeWidth={2} dot={false} type="monotone" />
              <Line dataKey="revenue_bear" name="Bear" stroke="#f43f5e" strokeWidth={2} dot={false} type="monotone" strokeDasharray="4 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Share Price Projection */}
        {hasPrice ? (
          <ChartCard title="Share Price Projection" sub="₹ per share · valuation multiple method">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
                <CartesianGrid vertical={false} stroke="#1e2d50" />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(1)}K` : `₹${v}`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown, name: unknown) => [`₹${Number(v).toLocaleString()}`, String(name)]} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#6b7fa3" }} />
                <Line dataKey="price_bull"  name="Bull"  stroke="#60a5fa" strokeWidth={2}   type="monotone" dot={{ r: 3 }} />
                <Line dataKey="price_base"  name="Base"  stroke="#22d3a0" strokeWidth={2.5} type="monotone" dot={{ r: 4 }} />
                <Line dataKey="price_bear"  name="Bear"  stroke="#f43f5e" strokeWidth={2}   type="monotone" dot={{ r: 3 }} strokeDasharray="4 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <ChartCard title="Share Price Projection" sub="Not available for this company">
            <div className="flex items-center justify-center h-[220px] text-[#6b7fa3] text-sm">
              Price model not available
            </div>
          </ChartCard>
        )}
      </div>

      {/* Margin Projection */}
      {hasMargin && (
        <ChartCard title="Net Profit Margin Projection" sub="% · path to profitability across scenarios">
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <CartesianGrid vertical={false} stroke="#1e2d50" />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown, name: unknown) => [`${Number(v).toFixed(1)}%`, String(name)]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6b7fa3" }} />
              <ReferenceLine y={0} stroke="#22d3a0" strokeDasharray="4 3" label={{ value: "Breakeven", fill: "#22d3a0", fontSize: 10 }} />
              <Line dataKey="margin_bull" name="Bull" stroke="#60a5fa" strokeWidth={2}   type="monotone" dot={{ r: 3 }} connectNulls />
              <Line dataKey="margin_base" name="Base" stroke="#fbbf24" strokeWidth={2.5} type="monotone" dot={{ r: 4 }} connectNulls />
              <Line dataKey="margin_bear" name="Bear" stroke="#f43f5e" strokeWidth={2}   type="monotone" dot={{ r: 3 }} strokeDasharray="4 3" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Assumptions */}
      {data.assumptions?.length > 0 && (
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
      )}
    </div>
  );
}

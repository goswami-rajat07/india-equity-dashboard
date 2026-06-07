"use client";

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { FinancialRow } from "@/lib/types";

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

interface Props {
  data: FinancialRow[];
  meta?: { multiple_type?: string; name?: string; ticker?: string; sector?: string; exchange?: string; latest_price?: number | null; latest_revenue?: number | null; market_cap?: number | null } | null;
}

export function HistoricalCharts({ data, meta }: Props) {
  const multipleLabel = meta?.multiple_type ?? "P/E";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Revenue */}
      <ChartCard title="Annual Revenue" sub="₹ Crore · lighter bar = estimate">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [`₹${Number(v).toLocaleString()} Cr`, "Revenue"]}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.year} fill={d.estimated ? "#22d3a060" : "#22d3a0"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Net Profit / Loss */}
      <ChartCard title="Net Profit / Loss" sub="₹ Crore · negative = loss · lighter bar = estimate">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [`₹${Number(v).toLocaleString()} Cr`, "Net P&L"]}
            />
            <ReferenceLine y={0} stroke="#1e2d50" strokeWidth={1.5} />
            <Bar dataKey="net_profit" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.year}
                  fill={(d.net_profit ?? 0) >= 0
                    ? (d.estimated ? "#22d3a060" : "#22d3a0")
                    : (d.estimated ? "#f43f5e60" : "#f43f5e")}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Profit Margin */}
      <ChartCard title="Net Profit Margin" sub="% of revenue · path to breakeven">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`, "Net Margin"]}
            />
            <ReferenceLine y={0} stroke="#22d3a0" strokeDasharray="4 3" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="margin_pct"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={{ fill: "#fbbf24", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Valuation + Share Price */}
      <ChartCard
        title={`Valuation & Share Price`}
        sub={`${multipleLabel} multiple (left) · Share price ₹ (right) · Pre-listing = no data`}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `${v}×`} yAxisId="mult" />
            <YAxis {...axisProps} tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(1)+"K" : v}`} yAxisId="price" orientation="right" />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown, name: unknown) => {
                const n = Number(v);
                const key = String(name);
                if (!v || n === 0) return ["Unlisted / N/A", key];
                return key === "valuation_multiple" ? [`${n}×`, multipleLabel] : [`₹${n.toLocaleString()}`, "Share Price"];
              }}
            />
            <Bar dataKey="valuation_multiple" yAxisId="mult" fill="#a78bfa" radius={[4, 4, 0, 0]} name="valuation_multiple">
              {data.map((d) => (
                <Cell key={d.year} fill={d.estimated ? "#a78bfa60" : "#a78bfa"} />
              ))}
            </Bar>
            <Bar dataKey="share_price" yAxisId="price" fill="#60a5fa" radius={[4, 4, 0, 0]} name="share_price">
              {data.map((d) => (
                <Cell key={d.year} fill={d.estimated ? "#60a5fa60" : "#60a5fa"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

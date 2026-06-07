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

export function HistoricalCharts({ data }: { data: FinancialRow[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Revenue */}
      <ChartCard title="Annual Revenue" sub="₹ Crore · FY2020 – FY2025E">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="fy" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [`₹${v.toLocaleString()} Cr`, "Revenue"]}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.fy} fill={d.estimated ? "#22d3a060" : "#22d3a0"} />
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
            <XAxis dataKey="fy" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [`₹${v.toLocaleString()} Cr`, "Net P&L"]}
            />
            <ReferenceLine y={0} stroke="#1e2d50" strokeWidth={1.5} />
            <Bar dataKey="net_profit" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.fy} fill={d.estimated ? "#f43f5e60" : "#f43f5e"} />
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
            <XAxis dataKey="fy" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [`${v.toFixed(1)}%`, "Net Margin"]}
            />
            <ReferenceLine y={0} stroke="#22d3a0" strokeDasharray="4 3" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="margin_pct"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={{ fill: "#fbbf24", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* P/S Multiple + Share Price combined */}
      <ChartCard title="Valuation &amp; Share Price" sub="P/S multiple (left) · Share price ₹ (right) · Pre-IPO unlisted">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data.map((d, i) => ({
              ...d,
              ps: i === data.length - 1 ? 3.5 : null,
              price: i === data.length - 1 ? 310 : null,
            }))}
            margin={{ top: 4, right: 4, bottom: 0, left: 10 }}
          >
            <CartesianGrid vertical={false} stroke="#1e2d50" />
            <XAxis dataKey="fy" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => `${v}×`} yAxisId="ps" />
            <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} yAxisId="price" orientation="right" />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number | null, name: string) =>
                v == null
                  ? ["Unlisted", name]
                  : name === "ps"
                  ? [`${v}×`, "P/S"]
                  : [`₹${v}`, "Share Price"]
              }
            />
            <Bar dataKey="ps" yAxisId="ps" fill="#a78bfa" radius={[4, 4, 0, 0]} name="ps" />
            <Bar dataKey="price" yAxisId="price" fill="#60a5fa" radius={[4, 4, 0, 0]} name="price" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

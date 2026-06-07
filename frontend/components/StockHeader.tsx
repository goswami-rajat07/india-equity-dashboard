"use client";

import { StockMeta } from "@/lib/types";
import { TrendingUp, TrendingDown, Building2, Calendar } from "lucide-react";

interface Props {
  meta: StockMeta;
}

const KPI = ({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) => (
  <div className="bg-[#0f1629] border border-[#1e2d50] rounded-xl p-4 relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${color}`} />
    <p className="text-[10px] uppercase tracking-widest text-[#6b7fa3] mb-2">{label}</p>
    <p className="text-xl font-bold">{value}</p>
    <p className="text-[11px] text-[#6b7fa3] mt-1">{sub}</p>
  </div>
);

export function StockHeader({ meta }: Props) {
  const isNeg = meta.day_change_pct < 0;
  const ps = (meta.market_cap_cr / 2500).toFixed(1);

  return (
    <div className="mb-8">
      {/* Top bar */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{meta.name}</h1>
            <span className="bg-[#1a2a4a] border border-[#1e2d50] text-blue-400 text-xs font-semibold px-2 py-0.5 rounded">
              {meta.exchange}: ATHENERGY
            </span>
            <span className="bg-[#1a2a4a] border border-[#1e2d50] text-[#6b7fa3] text-xs px-2 py-0.5 rounded">
              {meta.sector}
            </span>
          </div>
          <p className="text-[#6b7fa3] text-sm mt-1.5 flex items-center gap-2">
            <Building2 size={13} />
            {meta.headquarters}
            <Calendar size={13} className="ml-2" />
            IPO {meta.ipo_date} @ ₹{meta.ipo_price}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">₹{meta.current_price.toLocaleString()}</p>
          <p className={`text-sm mt-1 flex items-center justify-end gap-1 ${isNeg ? "text-rose-400" : "text-emerald-400"}`}>
            {isNeg ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {isNeg ? "▼" : "▲"} {Math.abs(meta.day_change_pct).toFixed(2)}% today
          </p>
          <p className="text-[11px] text-[#6b7fa3] mt-0.5">
            52W: ₹{meta.week_52_low} – ₹{meta.week_52_high}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPI label="FY25E Revenue"   value="₹2,500 Cr"    sub="+40% YoY · 5yr CAGR 123%"          color="bg-gradient-to-r from-emerald-500 to-transparent" />
        <KPI label="FY25E Net Loss"  value="−₹800 Cr"     sub="Improving from −₹1,059 Cr in FY24"  color="bg-gradient-to-r from-rose-500 to-transparent"    />
        <KPI label="FY25E Margin"    value="−32%"          sub="Up from −59% in FY24"               color="bg-gradient-to-r from-amber-500 to-transparent"   />
        <KPI label="P/S Multiple"    value={`${ps}×`}      sub="Mkt Cap ₹8,700 Cr / FY25E Rev"     color="bg-gradient-to-r from-violet-500 to-transparent"  />
        <KPI label="Market Cap"      value="₹8,700 Cr"     sub={`${meta.shares_outstanding_cr} Cr shares outstanding`} color="bg-gradient-to-r from-blue-500 to-transparent" />
      </div>

      {/* Disclaimer */}
      <div className="mt-4 bg-[#1a2236] border border-[#1e2d50] border-l-amber-500 border-l-2 rounded-lg px-4 py-2.5 text-xs text-[#6b7fa3]">
        ⚠ &nbsp;FY2025 figures are <strong className="text-amber-400">estimates</strong> based on H1 run-rate + management guidance — not audited.
        P/E is N/A for loss-making years; P/S (Price-to-Sales) shown instead. Pre-IPO years show no market data.
      </div>
    </div>
  );
}

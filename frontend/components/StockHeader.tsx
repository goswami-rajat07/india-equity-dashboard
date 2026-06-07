"use client";

import { StockMeta } from "@/lib/types";
import { TrendingUp, Building2 } from "lucide-react";

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

function fmt(n: number | null | undefined, prefix = "", suffix = "", fallback = "N/A"): string {
  if (n == null) return fallback;
  if (Math.abs(n) >= 100000) return `${prefix}${(n / 100000).toFixed(1)}L${suffix}`;
  if (Math.abs(n) >= 1000) return `${prefix}${(n / 1000).toFixed(1)}K${suffix}`;
  return `${prefix}${n.toFixed(0)}${suffix}`;
}

export function StockHeader({ meta }: Props) {
  const price = meta.latest_price != null ? `₹${meta.latest_price.toFixed(0)}` : "Unlisted";
  const rev = meta.latest_revenue != null ? fmt(meta.latest_revenue, "₹", " Cr") : "N/A";
  const mcap = meta.market_cap != null ? fmt(meta.market_cap, "₹", " Cr") : "N/A";

  const multipleLabel = meta.multiple_type || "P/E";

  return (
    <div className="mb-8">
      {/* Top bar */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{meta.name}</h1>
            <span className="bg-[#1a2a4a] border border-[#1e2d50] text-blue-400 text-xs font-semibold px-2 py-0.5 rounded">
              {meta.exchange}: {meta.ticker}
            </span>
            <span className="bg-[#1a2a4a] border border-[#1e2d50] text-[#6b7fa3] text-xs px-2 py-0.5 rounded">
              {meta.sector}
            </span>
            <span className="bg-[#1a2a4a] border border-[#1e2d50] text-amber-400 text-xs px-2 py-0.5 rounded">
              {multipleLabel}
            </span>
          </div>
          <p className="text-[#6b7fa3] text-sm mt-1.5 flex items-center gap-2">
            <Building2 size={13} />
            {meta.sector}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">{price}</p>
          {meta.latest_price != null && (
            <p className="text-sm mt-1 flex items-center justify-end gap-1 text-[#6b7fa3]">
              <TrendingUp size={14} className="text-emerald-400" />
              Latest market price
            </p>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <KPI
          label="Latest Revenue"
          value={rev}
          sub="Most recent financial year"
          color="bg-gradient-to-r from-emerald-500 to-transparent"
        />
        <KPI
          label="Market Cap"
          value={mcap}
          sub="Based on tracker model"
          color="bg-gradient-to-r from-blue-500 to-transparent"
        />
        <KPI
          label="Share Price"
          value={price}
          sub="Latest from tracker"
          color="bg-gradient-to-r from-violet-500 to-transparent"
        />
        <KPI
          label="Valuation"
          value={multipleLabel}
          sub="Multiple basis for this company"
          color="bg-gradient-to-r from-amber-500 to-transparent"
        />
      </div>

      <div className="mt-4 bg-[#1a2236] border border-[#1e2d50] border-l-amber-500 border-l-2 rounded-lg px-4 py-2.5 text-xs text-[#6b7fa3]">
        ⚠ &nbsp;Projected years (marked <strong className="text-amber-400">E</strong>) are model estimates — not audited figures.
        Pre-IPO companies show no market price.{" "}
        {multipleLabel === "P/S" && "P/E is N/A for loss-making years; P/S (Price-to-Sales) is used instead."}
      </div>
    </div>
  );
}

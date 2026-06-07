"use client";

import { AIRecommendation } from "@/lib/types";
import { TrendingUp, ShieldAlert, Eye, AlertCircle, Sparkles } from "lucide-react";

const SIGNAL_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  BUY:        { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/40", label: "BUY" },
  ACCUMULATE: { bg: "bg-green-500/15",   text: "text-green-400",   border: "border-green-500/40",   label: "ACCUMULATE" },
  HOLD:       { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/40",    label: "HOLD" },
  WATCH:      { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/40",   label: "WATCH" },
  AVOID:      { bg: "bg-rose-500/15",    text: "text-rose-400",    border: "border-rose-500/40",    label: "AVOID" },
};

export function AIRecommendations({ data }: { data: AIRecommendation }) {
  const sig = SIGNAL_CONFIG[data.signal] ?? SIGNAL_CONFIG.HOLD;
  const isFallback = !!data._source;

  return (
    <div className="mb-8">
      <SectionTitle>AI Analyst Recommendation</SectionTitle>

      <div className={`bg-[#0f1629] border ${sig.border} rounded-xl p-6`}>
        {/* Signal + rationale */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-black px-4 py-1.5 rounded-lg ${sig.bg} ${sig.text} tracking-wider`}>
              {sig.label}
            </span>
            <div>
              <p className="text-sm font-medium">{data.signal_rationale}</p>
              {data.target_price_1yr && (
                <p className="text-xs text-[#6b7fa3] mt-0.5">
                  1-yr target: <span className={sig.text}>₹{data.target_price_1yr}</span>
                  {data.upside_pct && <span className="ml-2">({data.upside_pct > 0 ? "+" : ""}{data.upside_pct}% upside)</span>}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-violet-400">
            <Sparkles size={11} />
            {isFallback ? "Built-in model" : "Claude AI analysis"}
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Positives */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#6b7fa3] flex items-center gap-1.5">
              <TrendingUp size={11} className="text-emerald-400" /> Key Positives
            </p>
            {data.key_positives.map((p, i) => (
              <div key={i} className="flex gap-2 text-xs text-[#c5cfe8] leading-relaxed">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {p}
              </div>
            ))}
          </div>

          {/* Risks */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#6b7fa3] flex items-center gap-1.5">
              <ShieldAlert size={11} className="text-rose-400" /> Key Risks
            </p>
            {data.key_risks.map((r, i) => (
              <div key={i} className="flex gap-2 text-xs text-[#c5cfe8] leading-relaxed">
                <span className="text-rose-400 mt-0.5 shrink-0">✗</span>
                {r}
              </div>
            ))}
          </div>

          {/* Watchlist triggers */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#6b7fa3] flex items-center gap-1.5">
              <Eye size={11} className="text-amber-400" /> Watchlist Triggers
            </p>
            {data.watchlist_triggers.map((w, i) => (
              <div key={i} className="flex gap-2 text-xs text-[#c5cfe8] leading-relaxed">
                <span className="text-amber-400 mt-0.5 shrink-0">→</span>
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Analyst note */}
        <div className="bg-[#151e35] border border-[#1e2d50] rounded-lg px-4 py-3 text-xs text-[#9ab0d0] leading-relaxed italic">
          {data.analyst_note}
        </div>

        {isFallback && (
          <p className="mt-3 text-[10px] text-[#6b7fa3] flex items-center gap-1.5">
            <AlertCircle size={10} />
            {data._source} — add <code className="bg-[#151e35] px-1 rounded">ANTHROPIC_API_KEY</code> to backend/.env for live Claude analysis
          </p>
        )}
      </div>
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

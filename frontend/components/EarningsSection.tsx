"use client";

import { EarningsGuidance } from "@/lib/types";
import { MessageSquare } from "lucide-react";

const TONE_CONFIG = {
  optimistic: { label: "Optimistic",  bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  positive:   { label: "Positive",    bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30"    },
  neutral:    { label: "Neutral",     bg: "bg-gray-500/10",    text: "text-gray-400",    border: "border-gray-500/30"    },
  cautious:   { label: "Cautious",    bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
  negative:   { label: "Negative",    bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/30"    },
};

export function EarningsSection({ data }: { data: EarningsGuidance[] }) {
  return (
    <div className="mb-8">
      <SectionTitle>Management Guidance — Last 4 Quarters</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((q) => {
          const tone = TONE_CONFIG[q.tone] ?? TONE_CONFIG.neutral;
          return (
            <div key={q.quarter} className={`bg-[#0f1629] border ${tone.border} rounded-xl p-5`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-sm">{q.quarter}</p>
                  <p className="text-xs text-[#6b7fa3] mt-0.5">{q.date} · {q.source}</p>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${tone.bg} ${tone.text} shrink-0`}>
                  {tone.label}
                </span>
              </div>
              <ul className="space-y-2">
                {q.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#c5cfe8] leading-relaxed">
                    <MessageSquare size={11} className={`${tone.text} shrink-0 mt-0.5`} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
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

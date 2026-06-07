"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { StockHeader } from "@/components/StockHeader";
import { HistoricalCharts } from "@/components/charts/HistoricalCharts";
import { EarningsSection } from "@/components/EarningsSection";
import { ProjectionSection } from "@/components/ProjectionSection";
import { AIRecommendations } from "@/components/AIRecommendations";
import { TickerInfo, StockMeta, FinancialRow, EarningsGuidance, ProjectionRow, AIRecommendation } from "@/lib/types";

interface DashboardData {
  meta: StockMeta | null;
  financials: { ticker: string; data: FinancialRow[] } | null;
  earnings: { ticker: string; data: EarningsGuidance[] } | null;
  projections: { ticker: string; base: ProjectionRow[]; bull: ProjectionRow[]; bear: ProjectionRow[]; assumptions: string[] } | null;
  recommendations: AIRecommendation | null;
}
import { ChevronDown, BarChart2 } from "lucide-react";

const DEFAULT_TICKER = "ATHENERGY";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7fa3]">{children}</p>
      <div className="flex-1 h-px bg-[#1e2d50]" />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-[#1e2d50] border-t-blue-400 rounded-full animate-spin" />
    </div>
  );
}

export default function DashboardPage() {
  const [tickers, setTickers] = useState<TickerInfo[]>([]);
  const [selected, setSelected] = useState(DEFAULT_TICKER);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  // Load ticker list once
  useEffect(() => {
    api.tickers()
      .then(setTickers)
      .catch(() => setBackendDown(true));
  }, []);

  const fetchStock = useCallback(async (ticker: string) => {
    setLoading(true);
    setBackendDown(false);
    try {
      const [meta, financialsRes, earningsRes, projectionsRes, recommendationsRes] =
        await Promise.allSettled([
          api.meta(ticker),
          api.financials(ticker),
          api.earnings(ticker),
          api.projections(ticker),
          api.recommendations(ticker),
        ]);

      if (meta.status === "rejected") {
        setBackendDown(true);
        return;
      }

      setData({
        meta:            meta.status === "fulfilled"             ? meta.value             : null,
        financials:      financialsRes.status === "fulfilled"    ? financialsRes.value    : null,
        earnings:        earningsRes.status === "fulfilled"      ? earningsRes.value      : null,
        projections:     projectionsRes.status === "fulfilled"   ? projectionsRes.value   : null,
        recommendations: recommendationsRes.status === "fulfilled" ? recommendationsRes.value : null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock(selected);
  }, [selected, fetchStock]);

  if (backendDown) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#0f1629] border border-[#1e2d50] rounded-xl p-8 max-w-md text-center">
          <p className="text-rose-400 text-lg font-semibold mb-2">Backend not running</p>
          <p className="text-[#6b7fa3] text-sm mb-4">
            Start the FastAPI backend first, then reload this page.
          </p>
          <code className="bg-[#151e35] border border-[#1e2d50] rounded px-3 py-2 text-xs text-[#9ab0d0] block">
            cd backend && python3 -m uvicorn main:app --reload
          </code>
        </div>
      </div>
    );
  }

  const selectedInfo = tickers.find((t) => t.ticker === selected);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Company Selector */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[#6b7fa3] text-sm">
          <BarChart2 size={16} className="text-blue-400" />
          <span>India Equity Dashboard</span>
          <span className="text-[#1e2d50]">/</span>
          <span className="text-[#e8edf7] font-medium">{selectedInfo?.name ?? selected}</span>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-2 bg-[#0f1629] border border-[#1e2d50] rounded-lg px-4 py-2 text-sm text-[#e8edf7] hover:border-blue-500 transition-colors"
          >
            <span>{selectedInfo?.name ?? selected}</span>
            <span className="text-[#6b7fa3] text-xs">({selectedInfo?.sector ?? ""})</span>
            <ChevronDown size={14} className={`ml-1 text-[#6b7fa3] transition-transform ${selectorOpen ? "rotate-180" : ""}`} />
          </button>

          {selectorOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-[#0a1020] border border-[#1e2d50] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-2 border-b border-[#1e2d50]">
                <p className="text-[10px] uppercase tracking-widest text-[#6b7fa3] px-2 py-1">Select Company</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {tickers.map((t) => (
                  <button
                    key={t.ticker}
                    onClick={() => { setSelected(t.ticker); setSelectorOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-[#1a2a4a] transition-colors flex items-center justify-between gap-2 ${
                      t.ticker === selected ? "bg-[#1a2a4a] text-blue-400" : "text-[#e8edf7]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-[10px] text-[#6b7fa3]">{t.sector}</p>
                    </div>
                    <span className="text-[10px] text-[#6b7fa3] shrink-0">{t.ticker}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {selectorOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSelectorOpen(false)} />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : data?.meta ? (
        <>
          <StockHeader meta={data.meta} />

          <SectionTitle>Historical Performance</SectionTitle>
          {data.financials?.data && data.financials.data.length > 0 ? (
            <HistoricalCharts data={data.financials.data} meta={data.meta} />
          ) : (
            <p className="text-[#6b7fa3] text-sm mb-8">No historical data available.</p>
          )}

          {data.earnings?.data && data.earnings.data.length > 0 && (
            <>
              <SectionTitle>Earnings Guidance · Last 4 Quarters</SectionTitle>
              <EarningsSection data={data.earnings.data} />
            </>
          )}

          {data.projections?.base && data.projections.base.length > 0 && (
            <>
              <SectionTitle>Forward Projections</SectionTitle>
              <ProjectionSection data={data.projections} />
            </>
          )}

          {data.recommendations && (
            <>
              <SectionTitle>AI Analysis</SectionTitle>
              <AIRecommendations data={data.recommendations} />
            </>
          )}

          <div className="mt-8 pt-5 border-t border-[#1e2d50] flex justify-between flex-wrap gap-2 text-[11px] text-[#6b7fa3]">
            <span>Data sourced from SEBI filings, annual reports & investor presentations</span>
            <span>Estimates marked with E · Last updated June 2025</span>
          </div>
        </>
      ) : null}
    </main>
  );
}

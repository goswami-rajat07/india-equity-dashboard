import type { StockMeta, TickerInfo, AIRecommendation, FinancialRow, EarningsGuidance, ProjectionRow } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  tickers:         ()             => get<TickerInfo[]>(`/api/tickers`),
  meta:            (ticker: string) => get<StockMeta>(`/api/meta/${ticker}`),
  financials:      (ticker: string) => get<{ ticker: string; data: FinancialRow[] }>(`/api/financials/${ticker}`),
  earnings:        (ticker: string) => get<{ ticker: string; data: EarningsGuidance[] }>(`/api/earnings/${ticker}`),
  projections:     (ticker: string) => get<{ ticker: string; base: ProjectionRow[]; bull: ProjectionRow[]; bear: ProjectionRow[]; assumptions: string[] }>(`/api/projections/${ticker}`),
  recommendations: (ticker: string) => get<AIRecommendation>(`/api/recommendations/${ticker}`),
};

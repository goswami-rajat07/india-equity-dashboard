import type { PortfolioStock, DetailSeries, ProjectionRow } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

function enrichStock(s: PortfolioStock): PortfolioStock {
  const invested = s.qty * s.avg_cost;
  const value = s.qty * s.latest_price;
  return {
    ...s,
    invested,
    value,
    pnl: value - invested,
    pnl_pct: +((s.latest_price / s.avg_cost - 1) * 100).toFixed(1),
    day_chg: +((s.latest_price / s.prev_close - 1) * 100).toFixed(2),
  };
}

export const api = {
  portfolio: () =>
    get<PortfolioStock[]>("/api/portfolio").then((stocks) => stocks.map(enrichStock)),

  detail: (ticker: string) =>
    get<DetailSeries>(`/api/detail/${ticker}`),

  projections: (ticker: string) =>
    get<{ ticker: string; base: ProjectionRow[]; bull: ProjectionRow[]; bear: ProjectionRow[]; assumptions: string[] }>(
      `/api/projections/${ticker}`
    ),
};

import type { PortfolioStock, DetailSeries, ProjectionRow } from "@/lib/types";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

function enrichStock(s: PortfolioStock): PortfolioStock {
  const invested = s.qty * s.avg_cost;
  const hasPrice = s.latest_price != null && s.latest_price > 0;
  const value = hasPrice ? s.qty * s.latest_price! : null;
  return {
    ...s,
    invested,
    value,
    pnl: value != null ? value - invested : null,
    pnl_pct: hasPrice ? +((s.latest_price! / s.avg_cost - 1) * 100).toFixed(1) : null,
    day_chg: hasPrice && s.prev_close ? +((s.latest_price! / s.prev_close - 1) * 100).toFixed(2) : null,
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

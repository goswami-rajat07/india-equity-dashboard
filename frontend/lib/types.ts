export interface Signal {
  label: "Buy" | "Hold" | "Sell";
  score: number;
  reasons: string[];
}

export interface PortfolioStock {
  ticker: string;
  name: string;
  sector: string;
  multiple_type: string;
  shares: number;
  latest_price: number;
  prev_close: number;
  qty: number;
  avg_cost: number;
  fys: string[];
  rev: number[];
  np: number[];
  price_history: (number | null)[];
  npm: (number | null)[];
  pe: (number | null)[];
  eps: (number | null)[];
  rev_growth: (number | null)[];
  signal: Signal;
  // computed client-side
  invested?: number;
  value?: number;
  pnl?: number;
  pnl_pct?: number;
  day_chg?: number;
}

export interface DetailSeries {
  ticker: string;
  name: string;
  sector: string;
  multiple_type: string;
  shares: number;
  fys: string[];
  rev: number[];
  np: number[];
  npm: (number | null)[];
  pe: (number | null)[];
  eps: (number | null)[];
  rev_growth: (number | null)[];
  price_history: (number | null)[];
}

export interface ProjectionRow {
  year: string;
  revenue_base: number;
  revenue_bull: number;
  revenue_bear: number;
  margin_base: number | null;
  margin_bull: number | null;
  margin_bear: number | null;
  price_base: number | null;
  price_bull: number | null;
  price_bear: number | null;
  valuation_multiple: number | null;
}

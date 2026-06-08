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
  shares: number | null;
  latest_price: number | null;
  prev_close: number | null;
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
  value?: number | null;
  pnl?: number | null;
  pnl_pct?: number | null;
  day_chg?: number | null;
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
  np_growth: (number | null)[];
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

export interface AIRecommendation {
  signal: "BUY" | "ACCUMULATE" | "HOLD" | "WATCH" | "AVOID";
  signal_rationale: string;
  target_price_1yr: number | null;
  upside_pct: number | null;
  key_positives: string[];
  key_risks: string[];
  watchlist_triggers: string[];
  analyst_note: string;
  _fallback?: boolean;
}

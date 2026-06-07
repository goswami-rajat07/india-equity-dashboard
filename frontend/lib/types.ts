export interface FinancialRow {
  year: string;
  revenue: number | null;
  net_profit: number | null;
  margin_pct: number | null;
  valuation_multiple: number | null;
  share_price: number | null;
  estimated: boolean;
}

export interface EarningsGuidance {
  quarter: string;
  date: string;
  source: string;
  highlights: string[];
  tone: "optimistic" | "positive" | "neutral" | "cautious" | "negative";
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

export interface Projections {
  ticker: string;
  base: ProjectionRow[];
  bull: ProjectionRow[];
  bear: ProjectionRow[];
  assumptions: string[];
}

export interface StockMeta {
  ticker: string;
  name: string;
  sector: string;
  exchange: string;
  multiple_type: string;
  latest_price: number | null;
  latest_revenue: number | null;
  market_cap: number | null;
}

export interface TickerInfo {
  ticker: string;
  name: string;
  sector: string;
}

export interface AIRecommendation {
  ticker: string;
  signal: "BUY" | "ACCUMULATE" | "HOLD" | "WATCH" | "AVOID";
  signal_rationale: string;
  target_price_1yr: number | null;
  upside_pct: number | null;
  key_positives: string[];
  key_risks: string[];
  watchlist_triggers: string[];
  analyst_note: string;
  _source?: string;
  error?: string;
}

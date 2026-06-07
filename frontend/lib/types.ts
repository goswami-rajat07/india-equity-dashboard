export interface FinancialRow {
  fy: string;
  year: number;
  revenue: number;
  net_profit: number;
  ebitda: number;
  margin_pct: number;
  estimated?: boolean;
}

export interface StockPriceRow {
  fy: string;
  year: number;
  price: number | null;
  listed: boolean;
  ipo_price?: number;
  ipo_date?: string;
}

export interface EarningsGuidance {
  quarter: string;
  date: string;
  source: string;
  highlights: string[];
  tone: "optimistic" | "positive" | "neutral" | "cautious" | "negative";
}

export interface ProjectionRow {
  fy: string;
  year: number;
  revenue: number;
  net_profit: number;
  margin_pct: number;
  share_price: number;
}

export interface Projections {
  ticker: string;
  base: ProjectionRow[];
  bull: ProjectionRow[];
  bear: ProjectionRow[];
  assumptions: string[];
}

export interface StockMeta {
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  founded: number;
  headquarters: string;
  ipo_date: string;
  ipo_price: number;
  market_cap_cr: number;
  shares_outstanding_cr: number;
  promoters: string[];
  description: string;
  current_price: number;
  day_change_pct: number;
  week_52_high: number;
  week_52_low: number;
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

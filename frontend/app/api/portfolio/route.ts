import { NextResponse } from "next/server";
import { TRACKER_DATA, COMPANY_META, PORTFOLIO, computeSignal } from "@/lib/data";

export async function GET() {
  const result = [];

  for (const [ticker, meta] of Object.entries(COMPANY_META)) {
    const rows = TRACKER_DATA[ticker] ?? [];
    const hist = rows.filter((r) => !r.estimated);
    const estimated = rows.filter((r) => r.estimated);
    const holding = PORTFOLIO[ticker] ?? { qty: 1, avg_cost: 1000, prev_close: null };

    const last = hist[hist.length - 1] ?? null;
    const recent = hist.slice(-7);
    const shares = last?.shares_cr ?? null;
    const latest_price = last?.share_price ?? null;
    const prev_close = holding.prev_close ?? latest_price ?? null;

    result.push({
      ticker,
      name: meta.name,
      sector: meta.sector,
      multiple_type: meta.multiple_type,
      shares,
      latest_price,
      prev_close,
      qty: holding.qty,
      avg_cost: holding.avg_cost,
      fys: recent.map((r) => r.year),
      rev: recent.map((r) => r.revenue),
      np: recent.map((r) => r.net_profit),
      price_history: recent.map((r) => r.share_price),
      npm: recent.map((r) => r.pat_margin !== null ? +(r.pat_margin * 100).toFixed(2) : null),
      pe: recent.map((r) => r.valuation_multiple),
      eps: recent.map((r) => r.shares_cr && r.shares_cr > 0 ? +(r.net_profit / r.shares_cr).toFixed(2) : null),
      rev_growth: recent.map((r) => r.revenue_growth !== null ? +(r.revenue_growth * 100).toFixed(1) : null),
      signal: computeSignal(hist, estimated),
    });
  }

  return NextResponse.json(result);
}

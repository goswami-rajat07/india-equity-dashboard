import { NextResponse } from "next/server";
import { TRACKER_DATA, COMPANY_META } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const key = ticker.toUpperCase();
  const rows = TRACKER_DATA[key] ?? [];
  const hist = rows.filter((r) => !r.estimated);
  if (!hist.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const meta = COMPANY_META[key] ?? { name: key, sector: "", multiple_type: "P/E" };
  const last = hist[hist.length - 1];

  return NextResponse.json({
    ticker: key,
    name: meta.name,
    sector: meta.sector,
    multiple_type: meta.multiple_type,
    shares: last.shares_cr ?? 1,
    fys: hist.map((r) => r.year),
    rev: hist.map((r) => r.revenue),
    np: hist.map((r) => r.net_profit),
    npm: hist.map((r) => r.pat_margin !== null ? +(r.pat_margin * 100).toFixed(2) : null),
    pe: hist.map((r) => r.valuation_multiple),
    eps: hist.map((r) => r.shares_cr && r.shares_cr > 0 ? +(r.net_profit / r.shares_cr).toFixed(2) : null),
    rev_growth: hist.map((r) => r.revenue_growth !== null ? +(r.revenue_growth * 100).toFixed(1) : null),
    price_history: hist.map((r) => r.share_price),
  });
}

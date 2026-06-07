import { NextResponse } from "next/server";
import { TRACKER_DATA } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const key = ticker.toUpperCase();
  const rows = TRACKER_DATA[key] ?? [];
  const estimated = rows.filter((r) => r.estimated);
  if (!estimated.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const base = estimated.map((r) => ({
    year: r.year,
    revenue_base: r.revenue,
    revenue_bull: +(r.revenue * 1.2).toFixed(1),
    revenue_bear: +(r.revenue * 0.8).toFixed(1),
    margin_base: r.pat_margin !== null ? +(r.pat_margin * 100).toFixed(2) : null,
    margin_bull: r.pat_margin !== null ? +(r.pat_margin * 100 * 1.3).toFixed(2) : null,
    margin_bear: r.pat_margin !== null ? +(r.pat_margin * 100 * 0.7).toFixed(2) : null,
    price_base: r.share_price,
    price_bull: r.share_price ? +(r.share_price * 1.25).toFixed(1) : null,
    price_bear: r.share_price ? +(r.share_price * 0.75).toFixed(1) : null,
    valuation_multiple: r.valuation_multiple,
  }));

  return NextResponse.json({ ticker: key, base, assumptions: [] });
}

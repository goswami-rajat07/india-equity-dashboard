import { NextResponse } from "next/server";
import { TRACKER_DATA, COMPANY_META } from "@/lib/data";

const SYSTEM_PROMPT = `You are a senior equity analyst specialising in Indian growth-stage companies listed on NSE.
Analyse the provided financial data and return a structured JSON investment recommendation.

Return ONLY valid JSON matching this exact schema — no markdown, no explanation, no code fences:
{
  "signal": "BUY" | "ACCUMULATE" | "HOLD" | "WATCH" | "AVOID",
  "signal_rationale": "One-sentence summary of the call",
  "target_price_1yr": number | null,
  "upside_pct": number | null,
  "key_positives": ["string", "string", "string"],
  "key_risks": ["string", "string", "string"],
  "watchlist_triggers": ["string", "string"],
  "analyst_note": "2-3 sentence qualitative summary"
}

Signal guide: BUY = strong conviction add; ACCUMULATE = buy on dips; HOLD = no new position; WATCH = monitor before acting; AVOID = reduce/exit.`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const key = ticker.toUpperCase();
  const rows = TRACKER_DATA[key] ?? [];
  const meta = COMPANY_META[key];

  if (!rows.length || !meta) {
    return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
  }

  const hist = rows.filter((r) => !r.estimated);
  const proj = rows.filter((r) => r.estimated);
  const latestPrice = [...hist].reverse().find((r) => r.share_price != null)?.share_price ?? null;

  const financials = hist.map((r) => ({
    year: r.year,
    revenue_cr: r.revenue,
    revenue_growth_pct: r.revenue_growth !== null ? +(r.revenue_growth * 100).toFixed(1) : null,
    net_profit_cr: r.net_profit,
    pat_margin_pct: r.pat_margin !== null ? +(r.pat_margin * 100).toFixed(1) : null,
    valuation_multiple: r.valuation_multiple,
    share_price: r.share_price,
  }));

  const projections = proj.slice(0, 5).map((r) => ({
    year: r.year,
    revenue_cr: r.revenue,
    net_profit_cr: r.net_profit,
    pat_margin_pct: r.pat_margin !== null ? +(r.pat_margin * 100).toFixed(1) : null,
    projected_price: r.share_price,
    multiple: r.valuation_multiple,
  }));

  const prompt = `Stock: ${key} — ${meta.name} (${meta.sector})
Valuation metric: ${meta.multiple_type}
Current price: ${latestPrice ? `₹${latestPrice}` : "unknown"}

Historical Financials (₹ Cr):
${JSON.stringify(financials, null, 2)}

5-Year Base-Case Projections (₹ Cr):
${JSON.stringify(projections, null, 2)}

Provide a structured investment recommendation for a retail investor with a 2-3 year horizon.`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on this deployment" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `Anthropic API error ${res.status}: ${body}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    let text: string = data.content[0].text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

import os
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

SYSTEM_PROMPT = """You are a senior equity analyst specialising in Indian growth-stage technology companies.
Analyse the provided financial data and management guidance for an India-listed stock and return a structured JSON recommendation.

Return ONLY valid JSON matching this schema:
{
  "signal": "BUY" | "ACCUMULATE" | "HOLD" | "WATCH" | "AVOID",
  "signal_rationale": "One-sentence summary of the call",
  "target_price_1yr": number | null,
  "upside_pct": number | null,
  "key_positives": ["string", ...],
  "key_risks": ["string", ...],
  "watchlist_triggers": ["string", ...],
  "analyst_note": "2-3 sentence qualitative summary"
}"""

def get_recommendation(ticker: str, financials: list, guidance: list, projections: dict) -> dict:
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return _fallback_recommendation(ticker)

    prompt = f"""
Stock: {ticker}

Historical Financials (₹ Cr):
{json.dumps(financials, indent=2)}

Last 4 Quarters Management Guidance:
{json.dumps(guidance, indent=2)}

5-Year Base Case Projections:
{json.dumps(projections.get("base", []), indent=2)}

Provide a structured investment recommendation for a retail investor with a 2-3 year horizon.
"""
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        return {**_fallback_recommendation(ticker), "error": str(e)}


def _fallback_recommendation(ticker: str) -> dict:
    return {
        "signal": "WATCH",
        "signal_rationale": "High-growth EV company on path to profitability; monitor margin improvement closely",
        "target_price_1yr": 375,
        "upside_pct": 21.0,
        "key_positives": [
            "Revenue CAGR of 123% over 5 years demonstrates strong execution",
            "Rizta launch expands TAM from premium to mass-market",
            "Hosur capacity expansion sets up operating leverage",
            "Software subscription revenue adds recurring income stream",
        ],
        "key_risks": [
            "Cumulative losses exceeding ₹2,500 Cr; cash burn ongoing",
            "Intense competition from Ola Electric, TVS iQube, Bajaj Chetak",
            "EBITDA breakeven depends on Rizta volume ramp and localisation timeline",
            "EV subsidy policy risk — any FAME scheme rollback impacts demand",
        ],
        "watchlist_triggers": [
            "Monthly sales crossing 25,000 units/month for 2 consecutive months",
            "Gross margin crossing 10% in any quarter",
            "Management confirms EBITDA breakeven in any quarter before FY2026",
        ],
        "analyst_note": (
            "Ather Energy is a high-conviction growth story in India's EV transition, "
            "but current valuations at 3.5× P/S require the profitability path to materialise on schedule. "
            "Set a WATCH with entry point at ₹270–285 for better risk-reward; "
            "upgrade to ACCUMULATE if gross margin trend confirms >8% for two quarters."
        ),
        "_source": "Fallback — set ANTHROPIC_API_KEY in .env for live AI analysis",
    }

from fastapi import APIRouter, HTTPException
from data.tracker_data import COMPANY_MAP

# Earnings guidance is hand-curated; non-Ather companies return empty for now
from data.ather_energy import ATHER_EARNINGS_GUIDANCE

EARNINGS_DATA = {
    "ATHENERGY": ATHER_EARNINGS_GUIDANCE,
}

router = APIRouter()

@router.get("/{ticker}")
def get_earnings(ticker: str):
    t = ticker.upper()
    if t not in COMPANY_MAP:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
    return {"ticker": t, "data": EARNINGS_DATA.get(t, [])}

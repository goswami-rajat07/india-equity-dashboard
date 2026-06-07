from fastapi import APIRouter, HTTPException
from data.tracker_data import get_projections, COMPANY_MAP

router = APIRouter()

@router.get("/{ticker}")
def get_projections_route(ticker: str):
    t = ticker.upper()
    if t not in COMPANY_MAP:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
    rows = get_projections(t)
    return {
        "ticker": t,
        "base": rows,
        "bull": rows,
        "bear": rows,
        "assumptions": [
            "Revenue projections from tracker model; bull/bear apply ±20% revenue, ±30% margin",
            "Valuation multiples compress as revenue scales",
            "Share price = market cap / shares outstanding",
        ],
    }

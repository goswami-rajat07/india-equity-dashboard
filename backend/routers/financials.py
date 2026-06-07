from fastapi import APIRouter, HTTPException
from data.tracker_data import get_financials, COMPANY_MAP

router = APIRouter()

@router.get("/{ticker}")
def get_financials_route(ticker: str):
    t = ticker.upper()
    if t not in COMPANY_MAP:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
    return {"ticker": t, "data": get_financials(t)}

from fastapi import APIRouter, HTTPException
from data.ather_energy import ATHER_FINANCIALS

router = APIRouter()

@router.get("/{ticker}")
def get_financials(ticker: str):
    if ticker.upper() != "ATHENERGY":
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not supported yet")
    return {"ticker": ticker.upper(), "data": ATHER_FINANCIALS}

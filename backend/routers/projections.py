from fastapi import APIRouter, HTTPException
from data.ather_energy import ATHER_PROJECTIONS

router = APIRouter()

@router.get("/{ticker}")
def get_projections(ticker: str):
    if ticker.upper() != "ATHENERGY":
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not supported yet")
    return {"ticker": ticker.upper(), **ATHER_PROJECTIONS}

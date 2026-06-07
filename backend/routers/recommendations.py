from fastapi import APIRouter, HTTPException
from data.ather_energy import ATHER_FINANCIALS, ATHER_EARNINGS_GUIDANCE, ATHER_PROJECTIONS
from services.ai_service import get_recommendation

router = APIRouter()

@router.get("/{ticker}")
def get_recommendations(ticker: str):
    if ticker.upper() != "ATHENERGY":
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not supported yet")
    result = get_recommendation(
        ticker=ticker.upper(),
        financials=ATHER_FINANCIALS,
        guidance=ATHER_EARNINGS_GUIDANCE,
        projections=ATHER_PROJECTIONS,
    )
    return {"ticker": ticker.upper(), **result}

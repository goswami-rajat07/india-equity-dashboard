from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import financials, earnings, projections, recommendations

app = FastAPI(title="India Equity Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(financials.router,     prefix="/api/financials",     tags=["Financials"])
app.include_router(earnings.router,       prefix="/api/earnings",       tags=["Earnings"])
app.include_router(projections.router,    prefix="/api/projections",    tags=["Projections"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["AI"])

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/tickers")
def list_tickers():
    from data.tracker_data import COMPANY_MAP, COMPANY_META
    return [
        {
            "ticker": ticker,
            "name": COMPANY_META[ticker]["name"],
            "sector": COMPANY_META[ticker]["sector"],
        }
        for ticker in COMPANY_MAP
    ]

@app.get("/api/meta/{ticker}")
def get_meta(ticker: str):
    from data.tracker_data import get_meta
    meta = get_meta(ticker)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
    return meta

@app.get("/api/portfolio")
def get_portfolio():
    from data.tracker_data import get_portfolio_overview
    return get_portfolio_overview()

@app.get("/api/detail/{ticker}")
def get_detail(ticker: str):
    from data.tracker_data import get_detail_series, COMPANY_MAP
    if ticker.upper() not in COMPANY_MAP:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
    return get_detail_series(ticker)

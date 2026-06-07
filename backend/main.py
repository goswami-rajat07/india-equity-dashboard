from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import financials, earnings, projections, recommendations

app = FastAPI(title="India Equity Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

@app.get("/api/meta/{ticker}")
def get_meta(ticker: str):
    from data.ather_energy import STOCK_METADATA
    key = ticker.upper()
    if key not in STOCK_METADATA:
        return {"error": f"Ticker {ticker} not found"}
    return STOCK_METADATA[key]

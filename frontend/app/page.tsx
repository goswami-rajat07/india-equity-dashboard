"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { PortfolioStock, DetailSeries } from "@/lib/types";
import { Overview } from "@/components/Overview";
import { Detail } from "@/components/Detail";

interface DetailData {
  series: DetailSeries;
  holding: PortfolioStock;
}

export default function Page() {
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    api.portfolio()
      .then((s) => setStocks(s))
      .catch(() => setBackendDown(true))
      .finally(() => setLoading(false));
  }, []);

  async function openDetail(ticker: string) {
    setDetailLoading(true);
    window.scrollTo(0, 0);
    try {
      const series = await api.detail(ticker);
      const holding = stocks.find((s) => s.ticker === ticker)!;
      setDetail({ series, holding });
    } catch {
      // stay on overview on error
    } finally {
      setDetailLoading(false);
    }
  }

  function goBack() {
    setDetail(null);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <header className="topbar">
        <div className="brand" onClick={goBack} style={{ cursor: "pointer" }}>
          <span className="brand-mark" />
          <span className="brand-name">Ledger</span>
          <span className="brand-sub">Portfolio Tracker</span>
        </div>
        <div>
          <span className="qtr-tag">Q4 FY25 · Jun 2025</span>
        </div>
      </header>

      <main className="main">
        {backendDown && (
          <div style={{
            background: "#FFF3CD", border: "1px solid #FFEAA7", borderRadius: 8,
            padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#856404",
          }}>
            Backend not reachable at <code>http://localhost:8000</code>. Start the FastAPI server and refresh.
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)", fontSize: 14 }}>
            Loading portfolio…
          </div>
        )}

        {!loading && !backendDown && (
          detailLoading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)", fontSize: 14 }}>
              Loading…
            </div>
          ) : detail ? (
            <Detail series={detail.series} holding={detail.holding} onBack={goBack} />
          ) : (
            <Overview stocks={stocks} onOpen={openDetail} />
          )
        )}
      </main>
    </>
  );
}

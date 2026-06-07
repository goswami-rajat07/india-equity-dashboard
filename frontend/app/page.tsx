"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { PortfolioStock, DetailSeries } from "@/lib/types";
import { Overview } from "@/components/Overview";
import { Detail } from "@/components/Detail";

interface DetailData {
  series: DetailSeries;
  holding: PortfolioStock;
}

export default function Page() {
  const router = useRouter();
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    api.portfolio()
      .then((s) => setStocks(s))
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="qtr-tag">Q4 FY25 · Jun 2025</span>
          <button
            onClick={handleLogout}
            style={{
              border: "1px solid var(--line)", background: "var(--card)",
              color: "var(--muted)", fontSize: 12, fontWeight: 500,
              padding: "5px 13px", borderRadius: 999, cursor: "pointer",
              fontFamily: "var(--font-sans)", transition: ".12s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--ink)"; (e.target as HTMLElement).style.borderColor = "#D4D6DC"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--muted)"; (e.target as HTMLElement).style.borderColor = "var(--line)"; }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)", fontSize: 14 }}>
            Loading portfolio…
          </div>
        )}

        {!loading && (
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

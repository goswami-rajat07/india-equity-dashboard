"use client";

import { useState } from "react";
import type { AIRecommendation as AIRec } from "@/lib/types";
import { api } from "@/lib/api";
import { F } from "./ui";

const SIG_COLOR: Record<string, string> = {
  BUY:        "#22C55E",
  ACCUMULATE: "#14B8A6",
  HOLD:       "#EAB308",
  WATCH:      "#F97316",
  AVOID:      "#EF4444",
};

const SIG_BG: Record<string, string> = {
  BUY:        "rgba(34,197,94,0.12)",
  ACCUMULATE: "rgba(20,184,166,0.12)",
  HOLD:       "rgba(234,179,8,0.12)",
  WATCH:      "rgba(249,115,22,0.12)",
  AVOID:      "rgba(239,68,68,0.12)",
};

interface Props {
  ticker: string;
  latestPrice: number | null;
}

export function AIRecommendation({ ticker, latestPrice }: Props) {
  const [rec, setRec] = useState<AIRec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.recommendation(ticker);
      setRec(data);
    } catch {
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sigColor = rec ? (SIG_COLOR[rec.signal] ?? "#EAB308") : "";
  const sigBg    = rec ? (SIG_BG[rec.signal]    ?? "rgba(234,179,8,0.12)") : "";

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-h">
        <span>AI Analysis</span>
        {rec && !loading && (
          <button className="preset" style={{ fontSize: 12 }} onClick={generate}>
            Refresh
          </button>
        )}
      </div>

      {!rec && !loading && !error && (
        <div style={{ padding: "24px 0", textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
            Generate an AI-powered investment analysis using historical financials and projections.
          </p>
          <button className="preset" onClick={generate} style={{ padding: "8px 20px", fontSize: 13 }}>
            Generate Analysis
          </button>
        </div>
      )}

      {loading && (
        <div style={{ padding: "32px 0", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
          Analysing {ticker}…
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: "16px 0" }}>
          <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{error}</p>
          <button className="preset" onClick={generate} style={{ fontSize: 12 }}>
            Try again
          </button>
        </div>
      )}

      {rec && !loading && (
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
            <div style={{
              background: sigBg,
              border: `1.5px solid ${sigColor}`,
              color: sigColor,
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}>
              {rec.signal}
            </div>
            <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55, margin: 0, flex: 1 }}>
              {rec.signal_rationale}
            </p>
          </div>

          {(rec.target_price_1yr != null || rec.upside_pct != null) && (
            <div style={{
              display: "flex", gap: 32, marginBottom: 20,
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid var(--line)",
            }}>
              {rec.target_price_1yr != null && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>1-yr target</div>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>
                    {F.rupees(rec.target_price_1yr)}
                  </div>
                </div>
              )}
              {rec.upside_pct != null && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Upside</div>
                  <div className="mono" style={{
                    fontSize: 18, fontWeight: 600,
                    color: rec.upside_pct >= 0 ? "#22C55E" : "#EF4444",
                  }}>
                    {rec.upside_pct >= 0 ? "+" : ""}{rec.upside_pct.toFixed(1)}%
                  </div>
                </div>
              )}
              {latestPrice != null && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Current</div>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: "var(--muted)" }}>
                    {F.rupees(latestPrice)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#22C55E", marginBottom: 8, letterSpacing: "0.07em" }}>
                KEY POSITIVES
              </div>
              {rec.key_positives.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0, lineHeight: 1.55 }}>+</span>
                  <span style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#EF4444", marginBottom: 8, letterSpacing: "0.07em" }}>
                KEY RISKS
              </div>
              {rec.key_risks.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#EF4444", fontWeight: 700, flexShrink: 0, lineHeight: 1.55 }}>–</span>
                  <span style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.55 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {rec.watchlist_triggers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#F97316", marginBottom: 8, letterSpacing: "0.07em" }}>
                WATCHLIST TRIGGERS
              </div>
              {rec.watchlist_triggers.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#F97316", fontWeight: 700, flexShrink: 0, lineHeight: 1.55 }}>→</span>
                  <span style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Analyst note</div>
            <p style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.7, margin: 0 }}>
              {rec.analyst_note}
            </p>
          </div>

          <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>
            Generated by Claude · For informational purposes only · Not financial advice
          </p>
        </div>
      )}
    </div>
  );
}

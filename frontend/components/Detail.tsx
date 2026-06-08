"use client";

import { useState, useEffect } from "react";
import type { DetailSeries, PortfolioStock } from "@/lib/types";
import { SEED_NOTES } from "@/lib/earnings_notes";
import { Chart } from "./Chart";
import { Projection } from "./Projection";
import { AIRecommendation } from "./AIRecommendation";
import { SignalBadge, Delta, Stat, PAL, F } from "./ui";

interface QNote { id: string; quarter: string; text: string; }

function QuarterlyNotes({ ticker }: { ticker: string }) {
  const [notes, setNotes] = useState<QNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ quarter: "", text: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`qnotes_${ticker}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setNotes(parsed);
        if (parsed.length) setActiveId(parsed[0].id);
      } else {
        const seeds = SEED_NOTES[ticker] ?? [];
        if (seeds.length) {
          const seeded: QNote[] = seeds.map((s, i) => ({
            id: `seed_${i}_${ticker}`,
            quarter: s.quarter,
            text: s.text,
          }));
          setNotes(seeded);
          setActiveId(seeded[0].id);
          localStorage.setItem(`qnotes_${ticker}`, JSON.stringify(seeded));
        }
      }
    } catch {}
    setLoaded(true);
  }, [ticker]);

  const persist = (next: QNote[]) => {
    setNotes(next);
    try { localStorage.setItem(`qnotes_${ticker}`, JSON.stringify(next)); } catch {}
  };

  const startAdd = () => { setDraft({ quarter: "", text: "" }); setAddMode(true); setEditId(null); };
  const startEdit = (n: QNote) => { setDraft({ quarter: n.quarter, text: n.text }); setEditId(n.id); setAddMode(false); };
  const cancel = () => { setAddMode(false); setEditId(null); };

  const save = () => {
    if (!draft.text.trim()) return;
    if (addMode) {
      const newNote: QNote = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        quarter: draft.quarter.trim() || "—",
        text: draft.text.trim(),
      };
      const next = [newNote, ...notes];
      persist(next);
      setActiveId(newNote.id);
      setAddMode(false);
    } else if (editId) {
      persist(notes.map(n =>
        n.id === editId ? { ...n, quarter: draft.quarter.trim() || "—", text: draft.text.trim() } : n
      ));
      setEditId(null);
    }
  };

  const del = (id: string) => {
    const next = notes.filter(n => n.id !== id);
    persist(next);
    setActiveId(next.length ? next[0].id : null);
    setEditId(null);
  };

  if (!loaded) return null;

  const active = notes.find(n => n.id === activeId) ?? null;

  const editForm = (
    <div className="qnote-edit">
      <input
        className="qnote-qin" placeholder="Quarter (e.g. Q3 FY26)"
        value={draft.quarter} onChange={e => setDraft(d => ({ ...d, quarter: e.target.value }))}
      />
      <textarea
        className="qnote-ta"
        placeholder="Management guidance, key metrics, earnings highlights, thesis updates…"
        value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save(); }}
        autoFocus
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button className="qnote-save" onClick={save}>Save</button>
        <button className="qnote-cancel" onClick={cancel}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-h">
        <span>Quarterly Notes</span>
        {!addMode && !editId && (
          <button className="preset" style={{ fontSize: 12 }} onClick={startAdd}>+ Add note</button>
        )}
      </div>

      {/* Quarter tab strip */}
      {notes.length > 0 && (
        <div className="qnote-tabs">
          {notes.map(n => (
            <button
              key={n.id}
              className={`qnote-tab${n.id === activeId && !addMode ? " active" : ""}`}
              onClick={() => { setActiveId(n.id); setAddMode(false); setEditId(null); }}
            >
              {n.quarter}
            </button>
          ))}
        </div>
      )}

      {/* Add form */}
      {addMode && editForm}

      {/* Empty state */}
      {!addMode && notes.length === 0 && (
        <p className="qnote-empty">No notes yet. Add quarterly guidance, earnings highlights, or thesis updates.</p>
      )}

      {/* Active note */}
      {!addMode && active && (
        <div className="qnote-body">
          {editId === active.id ? editForm : (
            <>
              <div className="qnote-head">
                <strong className="qnote-q">{active.quarter}</strong>
                <div className="qnote-actions">
                  <button className="qnote-btn" onClick={() => startEdit(active)}>Edit</button>
                  <button className="qnote-btn qnote-del" onClick={() => del(active.id)}>Delete</button>
                </div>
              </div>
              <p className="qnote-text">{active.text}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  series: DetailSeries;
  holding: PortfolioStock;
  onBack: () => void;
}

function shortCr(v: number): string {
  const a = Math.abs(v), s = v < 0 ? "-" : "";
  if (a >= 100000) return s + (a / 1000).toFixed(0) + "k";
  if (a >= 10000)  return s + (a / 1000).toFixed(1) + "k";
  if (a >= 1000)   return s + (a / 1000).toFixed(1) + "k";
  return s + Math.round(a).toString();
}

function shortPct(v: number): string {
  return (v >= 0 ? "+" : "") + v.toFixed(0) + "%";
}

function shortRupee(v: number): string {
  const a = Math.abs(v), s = v < 0 ? "-₹" : "₹";
  if (a >= 1000) return s + (a / 1000).toFixed(1) + "k";
  return s + Math.round(a).toString();
}

export function Detail({ series, holding, onBack }: Props) {
  const sig = holding.signal;
  const latestNpm  = series.npm[series.npm.length - 1];
  const latestPe   = series.pe[series.pe.length - 1];
  const latestG    = series.rev_growth[series.rev_growth.length - 1];
  const latestNp   = series.np[series.np.length - 1];
  const latestRev  = series.rev[series.rev.length - 1];
  const npmThreeAgo = series.npm.length >= 3 ? series.npm[series.npm.length - 4] : null;

  const npGrowthCapped = series.np_growth.map(v =>
    v == null ? null : Math.max(-300, Math.min(500, v))
  );

  const rows = [
    { l: "Revenue",          v: series.rev,        f: (x: number) => F.crore(x) },
    { l: "Net profit",       v: series.np,         f: (x: number) => F.crore(x), neg: true },
    { l: "Net margin",       v: series.npm,        f: (x: number | null) => x == null ? "—" : F.pctPlain(x), neg: true },
    { l: "Rev growth YoY",  v: series.rev_growth, f: (x: number | null) => x == null ? "—" : F.pct(x), neg: true },
    { l: "Profit growth YoY", v: series.np_growth, f: (x: number | null) => x == null ? "—" : F.pct(x), neg: true },
    { l: "EPS",              v: series.eps,        f: (x: number | null) => x == null ? "—" : F.rupees(x, 1), neg: true },
    { l: "P/E or P/S",      v: series.pe,         f: (x: number | null) => x == null ? "—" : F.mult(x) },
    { l: "Price",            v: series.price_history, f: (x: number | null) => x == null ? "—" : F.rupees(x) },
  ];

  return (
    <div className="view">
      <button className="back" onClick={onBack}>← Portfolio</button>

      <div className="dt-head">
        <div className="dt-id">
          <div className="dt-name-row">
            <h1 className="page-title">{series.name}</h1>
            <SignalBadge signal={sig} size="lg" />
          </div>
          <p className="page-sub">{series.ticker} · {series.sector} · {series.shares} Cr shares</p>
          <div className="reasons">
            {sig.reasons.map((r, i) => <span key={i} className="reason">{r}</span>)}
          </div>
        </div>

        <div className="dt-price-box">
          <div className="dt-ltp mono">{F.rupees(holding.latest_price)}</div>
          <Delta value={holding.day_chg} dp={2} />
          <div className="dt-hold">
            <div className="hold-row"><span>Holding</span><b className="mono">{holding.qty} sh</b></div>
            <div className="hold-row"><span>Avg cost</span><b className="mono">{F.rupees(holding.avg_cost)}</b></div>
            <div className="hold-row"><span>Value</span><b className="mono">{F.money(holding.value)}</b></div>
            <div className="hold-row">
              <span>Unrealised</span>
              <b className="mono" style={{ color: (holding.pnl ?? 0) >= 0 ? PAL.buy : PAL.sell }}>
                {F.money(holding.pnl)} <Delta value={holding.pnl_pct} />
              </b>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-strip">
        <Stat label="Revenue (latest)" value={F.crore(latestRev)} sub={<Delta value={latestG} />} />
        <Stat label="Net profit (latest)" value={F.crore(latestNp)} accent={latestNp != null && latestNp < 0 ? PAL.sell : undefined} />
        <Stat label="Net margin" value={latestNpm != null ? F.pctPlain(latestNpm) : "—"}
          sub={npmThreeAgo != null ? `from ${F.pctPlain(npmThreeAgo)} (3yr ago)` : undefined} />
        <Stat label={series.multiple_type + " (latest)"} value={latestPe != null ? F.mult(latestPe) : "—"}
          accent={(latestPe ?? 0) > 80 ? PAL.hold : undefined} />
        <Stat label="EPS (latest)" value={F.rupees(series.eps[series.eps.length - 1], 1)} />
      </div>

      <div className="sec-bar">
        <h3 className="sec-title">Financial history · {series.fys[0]} → {series.fys[series.fys.length - 1]}</h3>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-h">
            <span>Revenue & net margin</span>
            <span className="leg">
              <i style={{ background: PAL.rev }} />Revenue
              <i style={{ background: PAL.margin }} />Margin
            </span>
          </div>
          <Chart
            categories={series.fys} height={230}
            bars={{ values: series.rev, color: PAL.rev, label: "Revenue", fmt: (v) => F.crore(v), labelFmt: shortCr }}
            lines={[{ values: series.npm, color: PAL.margin, axis: "right", label: "Net margin", fmt: (v) => F.pctPlain(v), labelFmt: (v) => v.toFixed(1) + "%" }]}
            leftFmt={(v) => v >= 1000 ? (v / 1000).toFixed(0) + "k" : String(v)}
            rightFmt={(v) => v + "%"}
            showLabels
          />
        </div>

        <div className="card">
          <div className="card-h"><span>Net profit</span></div>
          <Chart
            categories={series.fys} height={230} yZero
            bars={{ values: series.np, color: PAL.rev, label: "Net profit", fmt: (v) => F.crore(v), labelFmt: shortCr }}
            leftFmt={(v) => v >= 1000 || v <= -1000 ? (v / 1000).toFixed(0) + "k" : String(v)}
            showLabels
          />
        </div>

        <div className="card">
          <div className="card-h"><span>{series.multiple_type} ratio</span></div>
          <Chart
            categories={series.fys} height={230}
            lines={[{ values: series.pe, color: PAL.pe, axis: "left", label: series.multiple_type, fmt: (v) => F.mult(v), labelFmt: (v) => v.toFixed(0) + "×" }]}
            leftFmt={(v) => v + "×"}
            showLabels
          />
        </div>

        <div className="card">
          <div className="card-h"><span>Share price</span></div>
          <Chart
            categories={series.fys} height={230}
            lines={[{ values: series.price_history, color: PAL.price, axis: "left", label: "Price", fmt: (v) => F.rupees(v), labelFmt: shortRupee }]}
            leftFmt={(v) => "₹" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v)}
            showLabels
          />
        </div>

        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-h">
            <span>Revenue & profit growth (YoY %)</span>
            <span className="leg">
              <i style={{ background: PAL.rev }} />Revenue growth
              <i style={{ background: "#E8752A" }} />Profit growth
            </span>
          </div>
          <Chart
            categories={series.fys} height={200} viewBoxWidth={1440}
            bars={{ values: series.rev_growth, color: PAL.rev, label: "Revenue growth", fmt: (v) => F.pct(v), labelFmt: shortPct }}
            lines={[{ values: npGrowthCapped, color: "#E8752A", axis: "left", label: "Profit growth", fmt: (v) => F.pct(v), labelFmt: shortPct }]}
            leftFmt={(v) => v + "%"}
            showLabels
          />
        </div>
      </div>

      <div className="card tbl-card">
        <table className="fin-tbl mono">
          <thead>
            <tr>
              <th className="th-left fin-metric">₹ Cr / ratio</th>
              {series.fys.map((fy) => <th key={fy}>{fy}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.l}>
                <td className="th-left fin-metric">{r.l}</td>
                {(r.v as (number | null)[]).map((x, i) => (
                  <td key={i} style={r.neg && (x ?? 0) < 0 ? { color: PAL.sell } : undefined}>
                    {r.f(x as never)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Projection
        series={series}
        holdings={{ qty: holding.qty, avg_cost: holding.avg_cost, latest_price: holding.latest_price }}
      />

      <AIRecommendation ticker={series.ticker} latestPrice={holding.latest_price ?? null} />

      <QuarterlyNotes ticker={series.ticker} />
    </div>
  );
}

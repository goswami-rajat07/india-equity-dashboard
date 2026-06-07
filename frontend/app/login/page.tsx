"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 32, justifyContent: "center" }}>
          <span style={{
            width: 18, height: 18, borderRadius: 5, background: "var(--ink)", flexShrink: 0,
            boxShadow: "inset 0 0 0 3px var(--bg), inset 0 0 0 5px var(--ink)",
          }} />
          <span style={{ fontWeight: 700, letterSpacing: "-.02em", fontSize: 18 }}>Ledger</span>
          <span style={{
            color: "var(--faint)", fontSize: 12,
            borderLeft: "1px solid var(--line)", paddingLeft: 9, marginLeft: 2,
          }}>Portfolio Tracker</span>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--line)",
          borderRadius: "var(--radius)", padding: "28px 28px 24px",
          boxShadow: "var(--shadow)",
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em", margin: "0 0 4px" }}>Sign in</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 24px" }}>Access your portfolio dashboard</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--ink2)", display: "block", marginBottom: 6 }}>
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid var(--line)", borderRadius: 8,
                  fontSize: 14, color: "var(--ink)", background: "var(--bg)",
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "var(--font-mono)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--rev)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--ink2)", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid var(--line)", borderRadius: 8,
                  fontSize: 14, color: "var(--ink)", background: "var(--bg)",
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "var(--font-mono)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--rev)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
              />
            </div>

            {error && (
              <div style={{
                fontSize: 13, color: "var(--sell)", background: "var(--sell-bg)",
                border: "1px solid #F5C6C4", borderRadius: 7, padding: "8px 12px",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "10px",
                background: loading ? "var(--ink2)" : "var(--ink)",
                color: "#fff", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "-.01em", marginTop: 4,
                transition: "background .15s",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

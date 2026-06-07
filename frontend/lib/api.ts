const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  meta:            (ticker: string) => get<any>(`/api/meta/${ticker}`),
  financials:      (ticker: string) => get<any>(`/api/financials/${ticker}`),
  earnings:        (ticker: string) => get<any>(`/api/earnings/${ticker}`),
  projections:     (ticker: string) => get<any>(`/api/projections/${ticker}`),
  recommendations: (ticker: string) => get<any>(`/api/recommendations/${ticker}`),
};

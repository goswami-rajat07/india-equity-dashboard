import { api } from "@/lib/api";
import { StockHeader } from "@/components/StockHeader";
import { HistoricalCharts } from "@/components/charts/HistoricalCharts";
import { EarningsSection } from "@/components/EarningsSection";
import { ProjectionSection } from "@/components/ProjectionSection";
import { AIRecommendations } from "@/components/AIRecommendations";

const TICKER = "ATHENERGY";

async function getData() {
  const [meta, financialsRes, earningsRes, projectionsRes, recommendationsRes] = await Promise.allSettled([
    api.meta(TICKER),
    api.financials(TICKER),
    api.earnings(TICKER),
    api.projections(TICKER),
    api.recommendations(TICKER),
  ]);

  return {
    meta:            meta.status === "fulfilled"            ? meta.value            : null,
    financials:      financialsRes.status === "fulfilled"   ? financialsRes.value   : null,
    earnings:        earningsRes.status === "fulfilled"     ? earningsRes.value     : null,
    projections:     projectionsRes.status === "fulfilled"  ? projectionsRes.value  : null,
    recommendations: recommendationsRes.status === "fulfilled" ? recommendationsRes.value : null,
  };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7fa3]">{children}</p>
      <div className="flex-1 h-px bg-[#1e2d50]" />
    </div>
  );
}

export default async function DashboardPage() {
  const { meta, financials, earnings, projections, recommendations } = await getData();

  if (!meta || !financials) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#0f1629] border border-[#1e2d50] rounded-xl p-8 max-w-md text-center">
          <p className="text-rose-400 text-lg font-semibold mb-2">Backend not running</p>
          <p className="text-[#6b7fa3] text-sm mb-4">
            Start the FastAPI backend first, then reload this page.
          </p>
          <code className="bg-[#151e35] border border-[#1e2d50] rounded px-3 py-2 text-xs text-[#9ab0d0] block">
            cd backend && python3 -m uvicorn main:app --reload
          </code>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header + KPI cards */}
      <StockHeader meta={meta} />

      {/* Historical charts */}
      <SectionTitle>5-Year Historical Performance · FY2020 – FY2025E</SectionTitle>
      <HistoricalCharts data={financials.data} />

      {/* Earnings guidance */}
      {earnings && <EarningsSection data={earnings.data} />}

      {/* Projections */}
      {projections && <ProjectionSection data={projections} />}

      {/* AI Recommendations */}
      {recommendations && <AIRecommendations data={recommendations} />}

      {/* Footer */}
      <div className="mt-8 pt-5 border-t border-[#1e2d50] flex justify-between flex-wrap gap-2 text-[11px] text-[#6b7fa3]">
        <span>Data: Ather Energy SEBI RHP · Annual Reports · Post-IPO Investor Presentations</span>
        <span>FY2025E = estimate · Last updated June 2025</span>
      </div>
    </main>
  );
}

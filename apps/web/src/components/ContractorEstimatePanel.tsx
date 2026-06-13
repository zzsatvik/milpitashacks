import { useState } from "react";
import type { ContractorEstimate, LawnAnalysis, LawnZone } from "@terraview/shared";
import { fetchContractorEstimate } from "../lib/auditFeatures";
import { useMockMode } from "../lib/env";
import { mockContractorEstimate } from "../lib/mockFeatures";
import { ChevronRight } from "./Icons";

interface ContractorEstimatePanelProps {
  zone: LawnZone;
  analysis: LawnAnalysis;
  zipCode: string;
}

export function ContractorEstimatePanel({
  zone,
  analysis,
  zipCode,
}: ContractorEstimatePanelProps) {
  const USE_MOCK = useMockMode();
  const [estimate, setEstimate] = useState<ContractorEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEstimate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
        setEstimate(mockContractorEstimate(zone));
      } else {
        setEstimate(await fetchContractorEstimate(analysis, zone, zipCode));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate estimate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 border-t border-white/6 pt-3">
      {!estimate ? (
        <button
          type="button"
          onClick={loadEstimate}
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-aurora-cyan transition hover:text-glow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={14} strokeWidth={2} />
          {loading ? "Calculating estimate…" : "Get a rough cost estimate"}
        </button>
      ) : (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
              Cost estimate · {zone.label}
            </h4>
            <button
              type="button"
              onClick={() => setEstimate(null)}
              className="cursor-pointer text-xs text-forest-100/40 hover:text-forest-100/70"
            >
              Reset
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <EstimateColumn
              title="DIY"
              badge={estimate.diy.difficulty}
              total={`~$${estimate.diy.materials_usd} materials`}
              summary={estimate.diy.summary}
              meta={`${estimate.diy.hours} hrs · ${estimate.diy.difficulty}`}
              items={estimate.diy.line_items}
            />
            <EstimateColumn
              title="Hire a pro"
              badge="contractor"
              total={`~$${estimate.professional.total_usd.toLocaleString()}`}
              summary={estimate.professional.summary}
              meta={estimate.professional.timeline}
              items={estimate.professional.line_items}
            />
          </div>
          <p className="text-xs text-forest-100/40">
            Ballpark AI estimate for your ZIP — get written quotes before committing.
          </p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}

function EstimateColumn({
  title,
  badge,
  total,
  summary,
  meta,
  items,
}: {
  title: string;
  badge: string;
  total: string;
  summary: string;
  meta: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-forest-50">{title}</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono-data text-[9px] uppercase text-forest-100/45">
          {badge}
        </span>
      </div>
      <div className="mt-1 font-display text-xl text-glow-300">{total}</div>
      <div className="text-xs text-forest-100/45">{meta}</div>
      <p className="mt-2 text-sm text-forest-100/65">{summary}</p>
      <ul className="mt-2 space-y-1 text-xs text-forest-100/55">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span className="text-glow-400">·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

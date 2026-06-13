import type { LawnAnalysis } from "@lawn-audit/shared";
import { useMemo, useState } from "react";
import { LawnCanvas } from "./LawnCanvas";
import { Scorecard } from "./Scorecard";
import { SwapSuggestionsList } from "./SwapSuggestionsList";
import { ZoneDetailPanel } from "./ZoneDetailPanel";
import { ArrowLeft } from "./Icons";
import type { ViewTab } from "../types";

interface AuditResultsProps {
  imageUrl: string;
  analysis: LawnAnalysis;
  onStartOver: () => void;
}

export function AuditResults({
  imageUrl,
  analysis,
  onStartOver,
}: AuditResultsProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("before");
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);

  const selectedZone = useMemo(
    () => analysis.zones.find((z) => z.id === selectedZoneId) ?? null,
    [analysis.zones, selectedZoneId],
  );

  return (
    <div className="animate-fade-up space-y-7 pb-20 pt-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
            <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
            Audit&nbsp;·&nbsp;{analysis.zones.length} zones
          </div>
          <h2 className="mt-1.5 font-display text-3xl tracking-tight-display text-forest-50">
            Your yard, decoded
          </h2>
          <p className="mt-1 text-sm text-forest-100/55">
            {activeTab === "before"
              ? "Tap any overlay to inspect a zone in detail."
              : "Each number matches a recommendation below."}
          </p>
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-forest-100/85 transition hover:border-glow-400/25 hover:text-forest-50"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          New audit
        </button>
      </div>

      {/* Tab switcher — glass pills */}
      <div className="glass-subtle inline-flex w-full rounded-2xl p-1 sm:w-auto">
        {(["before", "after"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setSelectedZoneId(null);
            }}
            className={`
              relative flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition-all sm:flex-none
              ${activeTab === tab
                ? "bg-forest-50 text-forest-950 shadow-sm"
                : "text-forest-100/55 hover:text-forest-50"
              }
            `}
          >
            {tab === "before" ? "Before · Current" : "After · Suggested swaps"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          <div className="glass overflow-hidden rounded-3xl p-2">
            <LawnCanvas
              imageUrl={imageUrl}
              zones={analysis.zones}
              activeTab={activeTab}
              selectedZoneId={selectedZoneId}
              onZoneSelect={setSelectedZoneId}
            />
          </div>

          {activeTab === "before" ? (
            <>
              <div className="flex flex-wrap gap-3 font-mono-data text-[10px] uppercase tracking-[0.12em]">
                <LegendItem color="#dc2626" label="Urgent" />
                <LegendItem color="#ca8a04" label="Moderate" />
                <LegendItem color="#16a34a" label="Good" />
              </div>
              <ZoneDetailPanel
                zone={selectedZone}
                onClose={() => setSelectedZoneId(null)}
              />
            </>
          ) : (
            <SwapSuggestionsList
              zones={analysis.zones}
              selectedZoneId={selectedZoneId}
              onZoneSelect={setSelectedZoneId}
            />
          )}
        </div>

        <Scorecard scores={analysis.scores} summary={analysis.summary} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-forest-100/60">
      <span
        className="inline-block h-2 w-2 rounded-sm"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}88` }}
      />
      {label}
    </span>
  );
}

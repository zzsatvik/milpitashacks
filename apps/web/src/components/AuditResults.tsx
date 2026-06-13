import type { LawnAnalysis } from "@lawn-audit/shared";
import { useMemo, useState } from "react";
import { LawnCanvas } from "./LawnCanvas";
import { Scorecard } from "./Scorecard";
import { SwapSuggestionsList } from "./SwapSuggestionsList";
import { ZoneDetailPanel } from "./ZoneDetailPanel";
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
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-forest-900">
            Your Lawn Audit
          </h2>
          <p className="text-sm text-forest-600">
            {activeTab === "before"
              ? `Click any zone to see details · ${analysis.zones.length} zones detected`
              : `Numbered zones match the list below · ${analysis.zones.length} suggestions`}
          </p>
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-lg border border-forest-300 px-4 py-2 text-sm font-medium text-forest-700 transition hover:bg-forest-50"
        >
          ← New audit
        </button>
      </div>

      <div className="flex gap-1 rounded-xl bg-forest-100/80 p-1">
        {(["before", "after"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setSelectedZoneId(null);
            }}
            className={`
              flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition
              ${activeTab === tab
                ? "bg-white text-forest-900 shadow-sm"
                : "text-forest-600 hover:text-forest-800"
              }
            `}
          >
            {tab === "before" ? "Before — Current State" : "After — Suggested Swaps"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <LawnCanvas
            imageUrl={imageUrl}
            zones={analysis.zones}
            activeTab={activeTab}
            selectedZoneId={selectedZoneId}
            onZoneSelect={setSelectedZoneId}
          />

          {activeTab === "before" ? (
            <>
              <div className="flex flex-wrap gap-3 text-xs">
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
    <span className="flex items-center gap-1.5 text-forest-600">
      <span
        className="inline-block h-3 w-3 rounded-sm border-2"
        style={{ borderColor: color, backgroundColor: `${color}22` }}
      />
      {label}
    </span>
  );
}
